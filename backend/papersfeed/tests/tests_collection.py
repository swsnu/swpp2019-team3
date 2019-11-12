"""tests_user.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.collections.collection import Collection
from papersfeed.models.users.user import User


class CollectionTestCase(TestCase):
    """ collection test case"""

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

        # Make Collection
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'SWPP Papers',
                        constants.TEXT: 'papers for swpp 2019 class'
                    }),
                    content_type='application/json')

    def test_make_collection(self):
        """ MAKE COLLECTION """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Make Collection
        response = client.post('/api/collection',
                               json.dumps({
                                   constants.TITLE: 'SWPP Papers Test',
                                   constants.TEXT: 'papers for swpp 2019 class Test'
                               }),
                               content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_get_collection(self):
        """ GET COLLECTION"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        collection_id = Collection.objects.filter(title='SWPP Papers').first().id

        # Get Collection
        response = client.get('/api/collection',
                              data={
                                  constants.ID: collection_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_edit_collection(self):
        """ EDIT COLLECTION """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        collection_id = Collection.objects.filter(title='SWPP Papers').first().id

        # Put Collection
        response = client.put('/api/collection',
                              data=json.dumps({
                                  constants.ID: collection_id,
                                  constants.TITLE: 'SWPP Papers Changed',
                                  constants.TEXT: 'papers for swpp 2019 class Changed'

                              }),
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_get_collections_of_user(self):
        """ GET USER'S COLLECTIONS """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        # Get User's Collections
        response = client.get('/api/collection/user',
                              data={
                                  constants.ID: user_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_delete_collection(self):
        """ DELETE Collection """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        collection_id = Collection.objects.filter(title='SWPP Papers').first().id

        # Delete Collection
        response = client.delete('/api/collection',
                                 data=json.dumps({
                                     constants.ID: collection_id
                                 }),
                                 content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_search_collection(self):
        """ Search Collection """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Make Collection
        # Title : Title Keyword Test
        # Text : foo boo
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'Title Keyword Test',
                        constants.TEXT: 'foo boo'
                    }),
                    content_type='application/json')

        # Make Collection
        # Title : foo boo
        # Text : Text Keyword Test
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'foo boo',
                        constants.TEXT: 'Text Keyword Test'
                    }),
                    content_type='application/json')

        # Make Collection
        # Title : TitleKeywordTest
        # Text : TextKeywordTest
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'TitleKeywordTest',
                        constants.TEXT: 'TextKeywordTest'
                    }),
                    content_type='application/json')

        # Make Collection
        # Title : foo boo
        # Text : foo boo
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'foo boo',
                        constants.TEXT: 'foo boo'
                    }),
                    content_type='application/json')

        # Search with Keyword 'swpp'
        response = client.get('/api/collection/search',
                              data={
                                  constants.TEXT: 'swpp'
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.COLLECTIONS]), 1)

        # Search with Keyword 'keyword'
        response = client.get('/api/collection/search',
                              data={
                                  constants.TEXT: 'keyword'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.COLLECTIONS]), 3)

        # Search with Keyword 'blahblah'
        response = client.get('/api/collection/search',
                              data={
                                  constants.TEXT: 'blahblah'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.COLLECTIONS]), 0)
