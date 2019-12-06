"""search.py"""
# -*- coding: utf-8 -*-

from __future__ import absolute_import, unicode_literals
import time
import urllib
import logging
from pprint import pformat
import requests
import xmltodict
from django.core.exceptions import ObjectDoesNotExist
from celery import shared_task

from papersfeed.utils.papers.abstract_analysis import get_key_phrases
from papersfeed.models.papers.paper import Paper
from papersfeed.models.papers.author import Author
from papersfeed.models.papers.keyword import Keyword
from papersfeed.models.papers.paper_author import PaperAuthor
from papersfeed.models.papers.paper_keyword import PaperKeyword

SEARCH_COUNT = 20 # pagination count for searching papers
TIMEOUT = 2

MAX_REQ_SIZE = 500000 # maxCharactersPerRequest of Text Analytics API is 524288
MAX_DOC_SIZE = 5120 # size limit of one document is 5120 (request consists of multiple documents)


def exploit_arxiv(search_word, page_number):
    """Exploit arXiv"""
    try:
        start = SEARCH_COUNT * (page_number-1)
        logging.info("[arXiv API] searching (%d~%d)", start, start+SEARCH_COUNT-1)
        arxiv_url = "http://export.arxiv.org/api/query"
        query = "?search_query=" + urllib.parse.quote(search_word) \
            + "&start=" + str(start) + "&max_results=" + str(SEARCH_COUNT)
        start_time = time.time()
        response = requests.get(arxiv_url + query, timeout=TIMEOUT)
        logging.info("[arXiv API] response latency: %s", time.time() - start_time)

        if response.status_code == 200:
            response_xml = response.text
            response_dict = xmltodict.parse(response_xml)['feed']
            if 'entry' in response_dict and response_dict['entry']:
                return __parse_and_save_arxiv_info(response_dict) # paper_ids, is_finished
            # if 'entry' doesn't exist or it's the end of results
            logging.warning("[arXiv API] entries don't exist")
        else:
            logging.warning("[arXiv API] error code %d", response.status_code)
    except requests.exceptions.RequestException as exception:
        logging.warning(exception)
    return [], True


def exploit_crossref(search_word, page_number):
    """Exploit Crossref"""
    try:
        start = SEARCH_COUNT * (page_number-1)
        logging.info("[Crossref API] searching (%d~%d)", start, start+SEARCH_COUNT-1)
        crossref_url = "http://api.crossref.org/works"
        query = "?query=" + urllib.parse.quote(search_word) \
            + "&rows=" + str(SEARCH_COUNT) + "&offset=" + str(start)
        start_time = time.time()
        response = requests.get(crossref_url + query, timeout=TIMEOUT)
        logging.info("[Crossref API] response latency: %s", time.time() - start_time)

        if response.status_code == 200:
            response_json = response.json()
            if 'items' in response_json['message'] and response_json['message']['items']:
                return __parse_and_save_crossref_info(response_json['message']) # paper_ids, is_finished
            logging.warning("[Crossref API] items don't exist")
        else:
            logging.warning("[Crossref API] error code %d", response.status_code)
    except requests.exceptions.RequestException as exception:
        logging.warning(exception)
    return [], True


# pylint: disable=too-many-locals
def __parse_and_save_arxiv_info(feed):
    paper_ids = []
    abstracts = {} # key: primary key of paper, value: abstract of the paper

    entries = feed['entry'] if isinstance(feed['entry'], list) else [feed['entry']]
    is_finished = len(entries) < SEARCH_COUNT
    for entry in entries:
        # find papers with the title in DB
        dup_ids = Paper.objects.filter(title=entry['title']).values_list('id', flat=True)
        if dup_ids.count() > 0: # if duplicate papers exist
            paper_ids.append(dup_ids[0]) # just return the first id

            # check it has keywords
            keywords_exist = PaperKeyword.objects.filter(paper_id=dup_ids[0]).exists()
            if not keywords_exist: # if not exist, try extracting keywords this time
                abstracts[dup_ids[0]] = entry['summary']
            continue

        download_url = ""
        for link in entry['link']:
            if "@title" in link and link['@title'] == "pdf":
                download_url = link['@href']
                break

        # save information of the paper
        new_paper = Paper(
            title=entry['title'][:400],
            language="english",
            abstract=entry['summary'][:5000],
            DOI=entry['arxiv:doi']['#text'][:40] if "arxiv:doi" in entry and "#text" in entry['arxiv:doi'] else "",
            file_url=entry['id'],
            download_url=download_url,
        )
        new_paper.save()
        paper_ids.append(new_paper.id)

        # save the abstract with key of paper for extracting keywords later
        abstracts[new_paper.id] = entry['summary']

        # save information of the authors
        author_rank = 1
        authors = entry['author'] if isinstance(entry['author'], list) else [entry['author']]
        for author in authors:
            first_last = author['name'].split(' ')
            first_name = first_last[0].strip()
            last_name = first_last[1].strip() if len(first_last) > 1 else ''
            __process_author(first_name, last_name, author_rank, new_paper.id)
            author_rank += 1

    __extract_keywords_from_abstract.delay(abstracts)

    return paper_ids, is_finished
# pylint: enable=too-many-locals


# pylint: disable=too-many-locals
def __parse_and_save_crossref_info(message):
    paper_ids = []
    abstracts = {}
    no_abstract_dois = {}

    is_finished = len(message['items']) < SEARCH_COUNT
    for item in message['items']:
        if 'title' not in item or 'author' not in item:
            continue

        # NOTE: Sometimes, results have 'subtitle'. Should we handle it?
        title = item['title'][0]

        # find papers with the title in DB
        dup_ids_abstracts = Paper.objects.filter(title=title).values_list('id', 'abstract')
        if dup_ids_abstracts.count() > 0: # if duplicate papers exist
            paper_id = dup_ids_abstracts[0][0]
            abstract = dup_ids_abstracts[0][1]

            paper_ids.append(paper_id) # just return the first id

            # check it has keywords
            keywords_exist = PaperKeyword.objects.filter(paper_id=paper_id).exists()
            if abstract:
                if not keywords_exist: # if not exist, try extracting keywords this time
                    abstracts[paper_id] = abstract # if it doesn't have abstract, move on
            else: # if abstract doesn't exist, try getting abstract this time
                if 'DOI' in item:
                    no_abstract_dois[paper_id] = item['DOI']
            continue

        # many times, abstract doesn't exist
        abstract = ""
        if 'abstract' in item:
            abstract = item['abstract']
            if abstract.startswith('<p>'):
                abstract = abstract[3:]
            if abstract.endswith('</p>'):
                abstract = abstract[:-4]

        # save information of the paper
        # it seems that it always doesn't have download_url(which users can directly download)
        new_paper = Paper(
            title=title[:400],
            language="english" if 'language' not in item or item['language'] == "en" else "",
            abstract=abstract[:5000],
            DOI=item['DOI'][:40] if 'DOI' in item else "",
            ISSN=item['ISSN'][0] if 'ISSN' in item else "",
            file_url=item['URL'] if 'URL' in item else "",
        )
        new_paper.save()
        paper_ids.append(new_paper.id)

        # save the abstract with key of paper for extracting keywords later
        if abstract: # if it doesn't have abstract, move on
            abstracts[new_paper.id] = abstract
        else: # if abstract doesn't exist, try getting abstract this time
            if 'DOI' in item:
                no_abstract_dois[new_paper.id] = item['DOI']

        # save information of the authors
        author_rank = 1
        for author in item['author']:
            first_name = author['given'] if 'given' in author else ""
            last_name = author['family'] if 'family' in author else ""
            __process_author(first_name, last_name, author_rank, new_paper.id)
            author_rank += 1

    __extract_keywords_from_abstract.delay(abstracts)
    for paper_id, doi in no_abstract_dois.items():
        __exploit_semanticscholar_for_abstract.delay(paper_id, doi)

    return paper_ids, is_finished
# pylint: enable=too-many-locals


def __process_author(first_name, last_name, author_rank, new_paper_id):
    """Create Author and PaperAuthor records"""
    new_author = Author(
        first_name=first_name,
        last_name=last_name,
    )
    new_author.save()

    PaperAuthor.objects.create(
        paper_id=new_paper_id,
        author_id=new_author.id,
        type="general",
        rank=author_rank
    )


@shared_task
def __exploit_semanticscholar_for_abstract(paper_id, doi):
    """Exploit Semantic Scholar for getting detailed information"""
    semanticscholar_url = "https://api.semanticscholar.org/v1/paper/"
    try:
        logging.info("[Semantic Scholar API] searching")
        start_time = time.time()
        response = requests.get(semanticscholar_url + doi, timeout=TIMEOUT)
        logging.info("[Semantic Scholar API] response latency: %s", time.time() - start_time)

        if response.status_code == 200:
            __save_semanticscholar_info(paper_id, response.json())

        elif response.status_code == 404:
            # sometiems, DOI should be upper-cased
            start_time = time.time()
            logging.info("[Semantic Scholar API] searching - upper")
            response = requests.get(semanticscholar_url + doi.upper(), timeout=TIMEOUT)
            logging.info("[Semantic Scholar API] response latency: %s", time.time() - start_time)
            if response.status_code == 200:
                __save_semanticscholar_info(paper_id, response.json())
            else:
                logging.warning("[Semantic Scholar API] error code %d", response.status_code)

        else:
            logging.warning("[Semantic Scholar API] error code %d", response.status_code)

    except requests.exceptions.RequestException as exception:
        logging.warning(exception)


def __save_semanticscholar_info(paper_id, response_json):
    if 'abstract' in response_json and response_json['abstract']:
        try:
            paper = Paper.objects.get(id=paper_id)
            paper.abstract = response_json['abstract']
            paper.save()
            __extract_keywords_from_abstract.delay({paper_id: response_json['abstract']})
        except ObjectDoesNotExist:
            logging.warning("[Semantic Scholar API] cannot find corresponding paper in PapersFeed DB")
    else:
        logging.warning("[Semantic Scholar API] the abstract don't exist")


@shared_task
def __extract_keywords_from_abstract(abstracts):
    """for every abstract, extract keywords by calling 'get_key_phrases'"""
    doc_list = []
    request_len = 0
    for paper_key in abstracts:
        request_len += min(len(abstracts[paper_key]), MAX_DOC_SIZE)

        # create as few as requests possible, considering maximum sizes of request and doc
        if request_len >= MAX_REQ_SIZE:
            documents = {"documents": doc_list}
            key_phrases = get_key_phrases(documents)
            if key_phrases:
                __process_key_phrases(key_phrases)

            doc_list = []
            request_len = min(len(abstracts[paper_key]), MAX_DOC_SIZE)

        doc_list.append({"id": str(paper_key), "language": "en", "text": abstracts[paper_key][:MAX_DOC_SIZE]})

    # create a request with remaining abstracts
    if doc_list:
        documents = {"documents": doc_list}
        key_phrases = get_key_phrases(documents)
        if key_phrases:
            __process_key_phrases(key_phrases)


def __process_key_phrases(key_phrases):
    """ process result of response and save them in DB
        To check struct of response, refer to
        https://koreacentral.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c6
    """

    # print errors if exist
    if key_phrases['errors']:
        logging.warning("[Text Analytics API] there were errors")
        logging.warning(pformat(key_phrases['errors']))

    # save information of mapping keyword to paper (abstract)
    if key_phrases['documents']:
        for result in key_phrases['documents']:
            keyword_ids = []
            for key_phrase in result['keyPhrases']:
                key_phrase = key_phrase.lower()
                paper_id = int(result['id'])

                # find keywords with the name in DB
                dup_ids = Keyword.objects.filter(name=key_phrase).values_list('id', flat=True)
                if dup_ids.count() > 0: # if duplicate keywords don't exist
                    keyword_ids.extend(dup_ids)
                    continue

                new_keyword = Keyword(
                    name=key_phrase
                )
                new_keyword.save()
                keyword_ids.append(new_keyword.id)

            for keyword_id in keyword_ids:
                PaperKeyword.objects.create(
                    paper_id=paper_id,
                    keyword_id=keyword_id,
                    type="abstract"
                )
