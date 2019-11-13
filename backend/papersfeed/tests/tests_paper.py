"""tests_paper.py"""
# -*- coding: utf-8 -*-
import json

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

        # Search with Keyword 'Computer'
        response = client.get('/api/paper/search',
                              data={
                                  constants.TEXT: 'computer'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        # cs_500.json 파일 기준 415개 이다.
        self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 415)

        # Search with Keyword 'AI'
        response = client.get('/api/paper/search',
                              data={
                                  constants.TEXT: 'AI'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        # cs_500.json 파일 기준 376개 이다.
        self.assertEqual(len(json.loads(response.content.decode())[constants.PAPERS]), 376)
