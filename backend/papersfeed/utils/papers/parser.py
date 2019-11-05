"""parser.py"""
import argparse
import csv
import json
import re
import sys
from datetime import datetime

csv.field_size_limit(sys.maxsize)

PUBLICATION_TYPE_DICT = {
    'J': 'journal',
    'B': 'book',
    'S': 'series',
    'P': 'patent'
}
MONTH_DICT = {
    'JAN': '01',
    'FEB': '02',
    'MAR': '03',
    'APR': '04',
    'MAY': '05',
    'JUN': '06',
    'JUL': '07',
    'AUG': '08',
    'SEP': '09',
    'OCT': '10',
    'NOV': '11',
    'DEC': '12',

    'FAL': '9',
    'WIN': '12'
}


# pylint: disable=too-many-locals, too-many-statements
def get_papers(filename):
    """
    Parser for tab seperated text files downloaded from Web Of Science
    Referencing cs_10.txt or cs_500.txt would be helpful for understanding this function
    Also, you can check all field tags in https://images.webofknowledge.com/images/help/WOS/hs_wos_fieldtags.html
    """
    now = str(datetime.now())
    creation_and_modification_date = {
        "creation_date": now,
        "modification_date": now,
    }

    reader = csv.DictReader(open(filename, 'r', encoding='utf-16'), dialect='excel-tab')
    pk = {
        "paper": 0,
        "author": 0,
        "paper_author": 0,
        "publisher": 0,
        "publication": 0,
        "paper_publication": 0,
        "keyword": 0,
        "paper_keyword": 0,
    }
    papers = []
    authors = []
    paper_authors = []
    publishers = []
    publications = []
    paper_publications = []
    keywords = []
    paper_keywords = []

    address_pattern = re.compile(r'(\[.*?\].*?)\;')
    address_author_pattern = re.compile(r'\[.*?\]')

    for row in reader: # one row for one paper information
        # 1. create a Paper record
        pk['paper'] += 1
        paper_fields = {
            "title": row['TI'],
            "language": row['LA'],
            "abstract": row['AB'],
            "ISSN": row['SN'],
            "eISSN": row['EI'],
            "DOI": row['DI'],
        }
        paper_fields.update(creation_and_modification_date)
        paper = {
            "model": "papersfeed.paper",
            "pk": pk['paper'],
            "fields": paper_fields
        }
        papers.append(paper)

        # 2. create Author records
        authors_name = list(map(str.strip, row['AF'].split(';')))
        emails = row['EM'].split(';')
        addresses = list(filter(len, address_pattern.split(row['C1'])))
        researcher_ids = row['RI'].split(';')

        author_rank = 0
        for author_name in authors_name: # for one paper, there can be multiple authors
            pk['author'] += 1
            author_rank += 1
            address = ''
            researcher_id = ''
            for addr in addresses: # find corresponding address
                # if matched address can't be found, it will be ''
                if author_name.lower() in addr.lower():
                    address = re.sub(address_author_pattern, '', addr).strip()
                    break
            for res_id in researcher_ids: # find corresponding researcher_id
                # if matched researcher_id can't be found, it will be ''
                if author_name.lower() in res_id.lower():
                    researcher_id = res_id.split('/')[1].strip()
                    break

            first_last = author_name.split(',')
            first_name = first_last[0].strip()
            last_name = first_last[1].strip() if len(first_last) > 1 else ''
            author_fields = {
                "first_name": first_name,
                "last_name": last_name,
                "email": emails.pop(0).strip() if emails else '',
                "address": address,
                "researcher_id": researcher_id.strip(),
            }
            author_fields.update(creation_and_modification_date)
            author = {
                "model": "papersfeed.author",
                "pk": pk['author'],
                "fields": author_fields
            }
            authors.append(author)

            # 3. create PaperAuthor records
            pk['paper_author'] += 1
            paper_author_fields = {
                "paper": pk['paper'],
                "author": pk['author'],
                "type": 'general',
                "rank": author_rank,
            }
            paper_author_fields.update(creation_and_modification_date)
            paper_author = {
                "model": "papersfeed.paperauthor",
                "pk": pk['paper_author'],
                "fields": paper_author_fields,
            }
            paper_authors.append(paper_author)

        # 4. create a Publisher record
        pk['publisher'] += 1
        publisher_fields = {
            "name": row['PU'],
            "city": row['PI'],
            "address": row['PA'],
        }
        publisher_fields.update(creation_and_modification_date)
        publisher = {
            "model": "papersfeed.publisher",
            "pk": pk['publisher'],
            "fields": publisher_fields
        }
        publishers.append(publisher)

        # 5. create a Publication record
        pk['publication'] += 1
        publication_fields = {
            "name": row['SO'],
            "type": PUBLICATION_TYPE_DICT[row['PT']],
            "publisher": pk['publisher'],
        }
        publication_fields.update(creation_and_modification_date)
        publication = {
            "model": "papersfeed.publication",
            "pk": pk['publication'],
            "fields": publication_fields
        }
        publications.append(publication)

        # 6. create a PaperPublication record
        pk['paper_publication'] += 1
        month_day = row['PD'].split()
        month = MONTH_DICT[month_day[0].split('-')[0].strip()] if month_day else '01'
        day = "{0:0>2}".format(month_day[1]) if len(month_day) > 1 else '01'
        date = row['PY'] + '-' + month + '-' + day if row['PY'] else None
        paper_publication_fields = {
            "paper": pk['paper'],
            "publication": pk['publication'],
            "volume": row['VL'] if row['VL'] else None,
            "issue": row['IS'] if row['IS'] else None,
            "date": date,
            "beginning_page": row['BP'] if row['BP'].isdigit() else None,
            "ending_page": row['EP'] if row['EP'].isdigit() else None,
            "ISBN": row['BN'],
        }
        paper_publication_fields.update(creation_and_modification_date)
        paper_publication = {
            "model": "papersfeed.paperpublication",
            "pk": pk['paper_publication'],
            "fields": paper_publication_fields,
        }
        paper_publications.append(paper_publication)

        # 7. create a Keyword record
        keywords_name = list(map(str.strip, row['DE'].split(';')))
        for keyword_name in keywords_name:
            pk['keyword'] += 1
            keyword_fields = {
                "name": keyword_name.strip()
            }
            keyword_fields.update(creation_and_modification_date)
            keyword = {
                "model": "papersfeed.keyword",
                "pk": pk['keyword'],
                "fields": keyword_fields
            }
            keywords.append(keyword)

            # 8. create a PaperKeyword record
            pk['paper_keyword'] += 1
            paper_keyword_fields = {
                "paper": pk['paper'],
                "keyword": pk['keyword'],
                "type": "author",
            }
            paper_keyword_fields.update(creation_and_modification_date)
            paper_keyword = {
                "model": "papersfeed.paperkeyword",
                "pk": pk['paper_keyword'],
                "fields": paper_keyword_fields,
            }
            paper_keywords.append(paper_keyword)

    # create one json file with all record information
    # pylint: disable=line-too-long
    models = papers + authors + paper_authors + publishers + publications + paper_publications + keywords + paper_keywords
    # pylint: enable=line-too-long
    json_filename = filename.split('/')[-1].split('.')[0].strip() + '.json'
    json.dump(models, open(json_filename, 'w'), indent=4)
# pylint: enable=too-many-locals, too-many-statements


if __name__ == '__main__':
    # pylint: disable=invalid-name
    parser = argparse.ArgumentParser()
    parser.add_argument('--data_file', '-f', type=str, required=True, help="file to parse")
    args = parser.parse_args()
    get_papers(args.data_file)
    # pylint: enable=invalid-name
