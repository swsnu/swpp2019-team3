"""tests_paper.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.collections.collection import Collection
from papersfeed.models.papers.paper import Paper
from papersfeed.utils.papers.utils import get_paper_migration


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

        # Migrate
        get_paper_migration()

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

        paper_id = Paper.objects.filter(title='CERTIFIED LATTICE REDUCTION').first().id

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

        paper_id = Paper.objects.filter(title='CERTIFIED LATTICE REDUCTION').first().id

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

        paper_id = Paper.objects.filter(title='CERTIFIED LATTICE REDUCTION').first().id
        test_collection_2_id = Collection.objects.filter(title='test_collection_2').first().id

        # Remove from test_collection_1 and Add to test_collection_2
        response = client.put('/api/paper/collection',
                              data=json.dumps({
                                  constants.ID: paper_id,
                                  constants.COLLECTION_IDS: json.dumps([test_collection_2_id])
                              }),
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
