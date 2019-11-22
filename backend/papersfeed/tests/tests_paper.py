"""tests_paper.py"""
# -*- coding: utf-8 -*-
import json

from unittest.mock import Mock, patch
from django.test import TestCase, Client

from papersfeed import constants
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

    def test_paper_search(self):
        """ PAPER SEARCH """
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
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13"
        )
        Paper.objects.create(
            title="test",
            language="English",
            abstract="AI",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13"
        )
        Paper.objects.create(
            title="paper2",
            language="English",
            abstract="abstract2",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13"
        )
        # Search with Keyword 'Paper'
        response = client.get('/api/paper/search',
                              data={
                                  constants.TEXT: 'paper'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 2)

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
    def test_paper_search_arxiv(self, mock_get, mock_post):
        """Search Paper (arXiv)"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # mock two responses from arXiv API (one has a entry, and next one has no entry)
        mock_responses = []

        stub_xml = open("papersfeed/tests/stub_xml.txt", 'r')
        mock_responses.append(Mock(
            text=stub_xml.read(),
            status_code=200
        ))

        stub_xml = open("papersfeed/tests/no_entry_xml.txt", 'r')
        mock_responses.append(Mock(
            text=stub_xml.read(),
            status_code=200
        ))

        mock_get.side_effect = mock_responses

        stub_json = open("papersfeed/tests/stub_key_phrases.json", 'r')
        mock_post.return_value = MockResponse(
            json_data=json.loads(stub_json.read()),
            status_code=200
        )

        # Search with Keyword 'blahblah' which doesn't exist in DB (send requests to arXiv)
        response = client.get('/api/paper/search',
                              data={
                                  constants.TEXT: 'blahblah'
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        # there was one result from arXiv, so our search API's response should have one paper result, too
        self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 1)

# pylint: disable=too-few-public-methods
class MockResponse:
    """MockResponse"""
    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        """json()"""
        return self.json_data
