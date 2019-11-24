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

        self.assertEqual(response.status_code, 201)

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

        collection_id = Collection.objects.filter(title='SWPP Papers').first().id
        self.assertJSONEqual(response.content, {
            constants.COLLECTIONS: [{
                constants.ID: collection_id,
                constants.TITLE: 'SWPP Papers',
                constants.TEXT: 'papers for swpp 2019 class',
                constants.LIKED: False,
                constants.CONTAINS_PAPER: False,
                constants.COUNT: {
                    constants.USERS: 1,
                    constants.PAPERS: 0,
                    constants.LIKES: 0,
                    constants.REPLIES: 0,
                }
            }]
        })

    def test_get_collections_of_user_with_paper(self):
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
                                  constants.ID: user_id,
                                  constants.PAPER: 1,
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        collection_id = Collection.objects.filter(title='SWPP Papers').first().id
        self.assertJSONEqual(response.content, {
            constants.COLLECTIONS: [{
                constants.ID: collection_id,
                constants.TITLE: 'SWPP Papers',
                constants.TEXT: 'papers for swpp 2019 class',
                constants.LIKED: False,
                constants.CONTAINS_PAPER: False,
                constants.COUNT: {
                    constants.USERS: 1,
                    constants.PAPERS: 0,
                    constants.LIKES: 0,
                    constants.REPLIES: 0,
                }
            }]
        })

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
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        # Search with Keyword 'keyword'
        response = client.get('/api/collection/search',
                              data={
                                  constants.TEXT: 'keyword'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.COLLECTIONS]), 3)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        # Search with Keyword 'blahblah'
        response = client.get('/api/collection/search',
                              data={
                                  constants.TEXT: 'blahblah'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.COLLECTIONS]), 0)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

    def test_collection_like(self):
        """ COLLECTION LIKE """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Creating a collection
        Collection.objects.create(
            title="collection2",
            text="collection2_text"
        )

        # Like collection2
        collection_id = Collection.objects.filter(title='collection2').first().id
        client.post('/api/like/collection',
                    data=json.dumps({
                        constants.ID: collection_id,
                    }),
                    content_type='application/json')

        # Like collection1(SWPP Papers)
        collection_id = Collection.objects.filter(title='SWPP Papers').first().id
        client.post('/api/like/collection',
                    data=json.dumps({
                        constants.ID: collection_id,
                    }),
                    content_type='application/json')

        # Get Collections the user liked
        response = client.get('/api/collection/like')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        collections = json.loads(response.content)['collections']
        self.assertEqual(len(collections), 2)

        # the last action comes first
        self.assertEqual(collections[0]['title'], 'SWPP Papers')
        self.assertEqual(collections[1]['title'], 'collection2')
