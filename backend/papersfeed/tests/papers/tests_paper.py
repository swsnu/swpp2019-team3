"""tests_paper.py"""
# -*- coding: utf-8 -*-
import json

from unittest.mock import Mock, patch
from django.test import TestCase, Client

from papersfeed import constants
from papersfeed.tests.tests import MockResponse
from papersfeed.models.collections.collection import Collection
from papersfeed.models.papers.paper import Paper


class PaperTestCase(TestCase):
    """ paper test case """

    def setUp(self):
        """SET UP"""
        client = Client()

        # Sign Up
        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp@snu.ac.kr',
                        constants.USERNAME: 'swpp',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Creating papers
        Paper.objects.create(
            title="paper1",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13"
        )

        # Make Collections
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'test_collection_1',
                        constants.TEXT: 'test_collection_1'
                    }),
                    content_type='application/json')
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'test_collection_2',
                        constants.TEXT: 'test_collection_2'
                    }),
                    content_type='application/json')

        test_collection_1_id = Collection.objects.filter(title='test_collection_1').first().id

        paper_id = Paper.objects.filter(title='paper1').first().id

        # Add paper to test_collection_1
        client.put('/api/paper/collection',
                   json.dumps({
                       constants.ID: paper_id,
                       constants.COLLECTION_IDS: [test_collection_1_id]
                   }),
                   content_type='application/json')

    def test_get_paper(self):
        """ GET PAPER """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        paper_id = Paper.objects.filter(title='paper1').first().id

        # Get Collection
        response = client.get('/api/paper',
                              data={
                                  constants.ID: paper_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_get_papers_of_collection(self):
        """ GET COLLECTION"S PAPERS """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        test_collection_1_id = Collection.objects.filter(title='test_collection_1').first().id

        response = client.get('/api/paper/collection',
                              data={
                                  constants.ID: test_collection_1_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

    def test_put_paper_collection(self):
        """ PUT PAPER TO COLLECTION OR REMOVE PAPRE FROM COLLECTION"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        paper_id = Paper.objects.filter(title='paper1').first().id
        test_collection_2_id = Collection.objects.filter(title='test_collection_2').first().id

        # Remove from test_collection_1 and Add to test_collection_2
        response = client.put('/api/paper/collection',
                              data=json.dumps({
                                  constants.ID: paper_id,
                                  constants.COLLECTION_IDS: [test_collection_2_id]
                              }),
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_delete_paper_collection(self):
        """Delete Paper from Collection"""
        client = Client()
        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        test_paper_id = Paper.objects.filter(title='paper1').first().id
        collection_id = Collection.objects.filter(title='test_collection_2').first().id

        # Add paper to test_collection_2
        response = client.put('/api/paper/collection',
                              data=json.dumps({
                                  constants.ID: test_paper_id,
                                  constants.COLLECTION_IDS: [collection_id]
                              }),
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

        # Delete paper from test_collection_2
        response = client.delete('/api/paper/collection',
                                 data=json.dumps({
                                     constants.ID: collection_id,
                                     constants.PAPER_ID: test_paper_id,
                                 }),
                                 content_type='application/json')

        self.assertJSONEqual(response.content, {"count" : {"papers": 0}})
        self.assertEqual(response.status_code, 200)


    def test_paper_like(self):
        """ PAPER LIKE """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Creating papers
        Paper.objects.create(
            title="paper2",
            language="English",
            abstract="test",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13"
        )
        Paper.objects.create(
            title="paper3",
            language="English",
            abstract="AI",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13"
        )

        # Like paper2
        paper_id = Paper.objects.filter(title='paper2').first().id
        client.post('/api/like/paper',
                    data=json.dumps({
                        constants.ID: paper_id,
                    }),
                    content_type='application/json')

        # Like paper3
        paper_id = Paper.objects.filter(title='paper3').first().id
        client.post('/api/like/paper',
                    data=json.dumps({
                        constants.ID: paper_id,
                    }),
                    content_type='application/json')

        # Like paper1
        paper_id = Paper.objects.filter(title='paper1').first().id
        client.post('/api/like/paper',
                    data=json.dumps({
                        constants.ID: paper_id,
                    }),
                    content_type='application/json')

        # Get Papers the user liked
        response = client.get('/api/paper/like')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        papers = json.loads(response.content)['papers']
        self.assertEqual(len(papers), 3)

        # the last action comes first
        self.assertEqual(papers[0]['title'], 'paper1')
        self.assertEqual(papers[1]['title'], 'paper3')
        self.assertEqual(papers[2]['title'], 'paper2')

    @patch('requests.post')
    @patch('requests.get')
    def test_paper_search(self, mock_get, mock_post):
        """ PAPER SEARCH (when there is no result from external sources)"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Creating papers
        Paper.objects.create(
            title="computer",
            language="English",
            abstract="test",
        )
        Paper.objects.create(
            title="test",
            language="English",
            abstract="AI",
        )
        Paper.objects.create(
            title="paper2",
            language="English",
            abstract="abstract2",
        )

        # there is no result from external sources, so naive-search in our DB
        stub_xml = open("papersfeed/tests/papers/stub_arxiv_no_entry.xml", 'r')
        # mock a response from Crossref API (one has a entry)
        stub_json = json.loads(open("papersfeed/tests/papers/stub_crossref_no_item.json", 'r').read())

        mock_get.side_effect = [
            Mock(
                text=stub_xml.read(),
                status_code=200
            ), MockResponse(
                json_data=stub_json,
                status_code=200
            )
        ]

        # the result papers have no keywords, but trying extracting keywords fails
        mock_post.return_value = MockResponse(
            json_data=None,
            status_code=403
        )

        # Search with Keyword 'Paper' (first, send requests to arXiv)
        response = client.get('/api/paper/search',
                              data={
                                  constants.TEXT: 'paper'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 2)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        # Search with Keyword 'AI'
        response = client.get('/api/paper/search',
                              data={
                                  constants.TEXT: 'AI'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 1)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        # Search with Keyword 'Computer'
        response = client.get('/api/paper/search',
                              data={
                                  constants.TEXT: 'Computer'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 1)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        # Search with Keyword 'AI'
        response = client.get('/api/paper/search',
                              data={
                                  constants.TEXT: 'AI'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 1)

        # Search with Keyword 'Computer'
        response = client.get('/api/paper/search',
                              data={
                                  constants.TEXT: 'Computer'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 1)

    @patch('requests.post')
    @patch('requests.get')
    def test_paper_search_external(self, mock_get, mock_post):
        """Search Paper from external sources"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # mock a response from arXiv API (one has a entry)
        stub_xml = open("papersfeed/tests/papers/stub_arxiv_entry.xml", 'r')
        mock_arxiv = Mock(text=stub_xml.read(), status_code=200)

        # mock a response from Crossref API (one has a entry)
        stub_json = json.loads(open("papersfeed/tests/papers/stub_crossref_item.json", 'r').read())
        mock_crossref = MockResponse(json_data=stub_json, status_code=200)

        mock_get.side_effect = [
            # for first search
            mock_arxiv, mock_crossref,
            # for second search
            mock_arxiv, mock_crossref
        ]

        mock_post.return_value = make_stub_keyphrases_response("papersfeed/tests/papers/stub_key_phrases.json", 200)

        def __do_search_test(client):
            # Search with Keyword 'blahblah' (first, send requests to arXiv)
            response = client.get('/api/paper/search',
                                  data={
                                      constants.TEXT: 'blahblah'
                                  },
                                  content_type='application/json')

            self.assertEqual(response.status_code, 200)
            # there was one result from arXiv and one result from Crossref,
            # so our search API's response should have two paper result, too
            self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 2)
            self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
            self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        # when first searching, call each two API and save the results in DB
        __do_search_test(client)
        # when second searching, call each two API and give results same with before
        __do_search_test(client)

    @patch('requests.post')
    @patch('requests.get')
    def test_paper_search_ml(self, mock_get, mock_post):
        """Search Paper for ML(dummy data)"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # mock a response from arXiv API (one has a entry)
        stub_xml = open("papersfeed/tests/papers/stub_arxiv_entry.xml", 'r')

        mock_get.return_value = Mock(
            text=stub_xml.read(),
            status_code=403
        )

        # NOTE: for now, actually this API is not called
        # because the same paper is already saved in DB on 'test_paper_search_arxiv'
        mock_post.return_value = make_stub_keyphrases_response("papersfeed/tests/papers/stub_key_phrases.json", 200)

        # Search with Keyword 'afdaf' which doesn't exist in DB (send requests to arXiv)
        response = client.get('/api/paper/search/ml',
                              data={
                                  constants.TITLES: json.dumps(['afdaf'])
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        # there was one result from arXiv, so our search API's response should have one paper result, too
        self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 1)

def make_stub_keyphrases_response(json_file, status_code):
    """Make Stub Text Analytics API Response"""
    stub_json = json.loads(open(json_file, 'r').read())

    # just for getting a clue about the id of paper which will be added in this test
    Paper.objects.create(
        title="unused_paper",
        language="unused_paper",
        abstract="unused_paper",
    )
    paper_id = Paper.objects.filter(title='unused_paper').first().id
    # manipulate the id of static stub_key_phrases
    stub_json['documents'][0]['id'] = str(paper_id + 1)

    return MockResponse(json_data=stub_json, status_code=status_code)
