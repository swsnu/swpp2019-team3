"""tests_user.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.papers.paper import Paper
from papersfeed.models.collections.collection import Collection
from papersfeed.models.collections.collection_user import CollectionUser
from papersfeed.models.users.user import User


class CollectionTestCase(TestCase):
    """ collection test case"""

    def setUp(self):
        """SET UP"""
        client = Client()

        # Sign Up: swpp
        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp@snu.ac.kr',
                        constants.USERNAME: 'swpp',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp_second@snu.ac.kr',
                        constants.USERNAME: 'swpp2',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        # Sign In: swpp
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Make Public Collection
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'SWPP Papers',
                        constants.TEXT: 'papers for swpp 2019 class, can be revert to private'
                    }),
                    content_type='application/json')
        # Make Private Collection and invite swpp_second
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'Private Collection1',
                        constants.TEXT: 'Private Collection1'
                    }),
                    content_type='application/json')
        private1_collection_id = Collection.objects.filter(title='Private Collection1').first().id
        client.put('/api/collection/type',
                   data=json.dumps({
                       constants.ID: private1_collection_id,
                       constants.TYPE: 'private'
                   }),
                   content_type='application/json')
        swpp_second_user_id = User.objects.filter(email='swpp_second@snu.ac.kr').first().id
        client.post('/api/user/collection',
                    json.dumps({
                        constants.ID: private1_collection_id,
                        constants.USER_IDS: [swpp_second_user_id]
                    }),
                    content_type='application/json')

        # Make Private Collection alone
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'Private Collection2',
                        constants.TEXT: 'Private Collection2'
                    }),
                    content_type='application/json')
        private2_collection_id = Collection.objects.filter(title='Private Collection2').first().id
        client.put('/api/collection/type',
                   data=json.dumps({
                       constants.ID: private2_collection_id,
                       constants.TYPE: 'private'
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
        collection = json.loads(response.content)[constants.COLLECTION]
        self.assertEqual(collection[constants.OWNER][constants.USERNAME], 'swpp')

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

    def test_edit_collection_type(self):
        """ EDIT COLLECTION TYPE """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        collection_id = Collection.objects.filter(title='SWPP Papers').first().id

        # Put Collection with Type: Wrong Type
        response = client.put('/api/collection/type',
                              data=json.dumps({
                                  constants.ID: collection_id,
                                  constants.TYPE: 'privatee'
                              }),
                              content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # Put Collection with Type: Private Type
        response = client.put('/api/collection/type',
                              data=json.dumps({
                                  constants.ID: collection_id,
                                  constants.TYPE: 'private'
                              }),
                              content_type='application/json')
        collection = json.loads(response.content)[constants.COLLECTION]
        self.assertEqual(collection[constants.TYPE], 'private')
        self.assertEqual(response.status_code, 200)

        # Put Collection with Type: Public Type
        response = client.put('/api/collection/type',
                              data=json.dumps({
                                  constants.ID: collection_id,
                                  constants.TYPE: 'public'
                              }),
                              content_type='application/json')
        collection = json.loads(response.content)[constants.COLLECTION]
        self.assertEqual(collection[constants.TYPE], 'public')
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
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        collections = json.loads(response.content)[constants.COLLECTIONS]
        self.assertEqual(len(collections), 3)
        self.assertEqual(collections[0][constants.TITLE], 'Private Collection2')

    def test_get_collections_of_user_except_private(self):
        """ GET USER'S COLLECTIONS EXCEPT PRIVATE"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp_second@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        swpp_user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        # Get swpp2 User's Collections: count should be 0 cause it's private
        response = client.get('/api/collection/user',
                              data={
                                  constants.ID: swpp_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)
        collections = json.loads(response.content)[constants.COLLECTIONS]
        self.assertEqual(len(collections), 2)

    def test_get_collections_of_user_with_paper(self):
        """ GET USER'S COLLECTIONS WITH PAPER """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        # Creating papers
        Paper.objects.create(
            title="paper1",
            language="English",
            abstract="abstract1",
        )

        collection_id = Collection.objects.filter(title='SWPP Papers').first().id

        paper_id = Paper.objects.filter(title='paper1').first().id

        # Add paper to 'SWPP Papers'
        client.put('/api/paper/collection',
                   json.dumps({
                       constants.ID: paper_id,
                       constants.COLLECTION_IDS: [collection_id]
                   }),
                   content_type='application/json')

        # Get User's Collections
        response = client.get('/api/collection/user',
                              data={
                                  constants.ID: user_id,
                                  constants.PAPER: paper_id,
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        collections = json.loads(response.content)[constants.COLLECTIONS]
        self.assertEqual(len(collections), 3)
        self.assertEqual(collections[2][constants.TITLE], 'SWPP Papers')
        self.assertEqual(collections[2][constants.CONTAINS_PAPER], True)
        self.assertEqual(collections[0][constants.TITLE], 'Private Collection2')
        self.assertEqual(collections[0][constants.CONTAINS_PAPER], False)

    def test_get_shared_collections_of_user(self):
        """ GET USER'S SHARED COLLECTIONS WITH PAPER """
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
        response = client.get('/api/collection/user/shared',
                              data={
                                  constants.ID: user_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        collections = json.loads(response.content)[constants.COLLECTIONS]
        self.assertEqual(len(collections), 1)
        self.assertEqual(collections[0][constants.TITLE], 'Private Collection1')

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

    def test_collection_search_except_private(self):
        """ Search Collection Except Private """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp_second@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Search with Keyword 'private'
        response = client.get('/api/collection/search',
                              data={
                                  constants.TEXT: 'private'
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.COLLECTIONS]), 2)
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

        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        # Creating a collection
        collection = Collection(
            title="collection2",
            text="collection2_text"
        )
        collection.save()

        CollectionUser.objects.create(
            user_id=user_id,
            collection_id=collection.id,
            type="owner"
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

    def test_collection_user_type(self):
        """Test Collection User Type"""
        client = Client()

        collection_id = Collection.objects.filter(title='Private Collection1').first().id

        # Sign In: swpp
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        client.put('/api/collection/type',
                   data=json.dumps({
                       constants.ID: collection_id,
                       constants.TYPE: 'public'
                   }),
                   content_type='application/json')

        # Get Collection
        response = client.get('/api/collection',
                              data={
                                  constants.ID: collection_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        collection = json.loads(response.content)[constants.COLLECTION]
        self.assertEqual(collection[constants.COLLECTION_USER_TYPE], 'owner')

        # Sign In: swpp_second
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp_second@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Get Collection
        response = client.get('/api/collection',
                              data={
                                  constants.ID: collection_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        collection = json.loads(response.content)[constants.COLLECTION]
        self.assertEqual(collection[constants.COLLECTION_USER_TYPE], 'member')

        # Sign Up: swpp_third
        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp_thrid@snu.ac.kr',
                        constants.USERNAME: 'swpp_third',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        # Sign In: swpp_third
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp_thrid@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Get Collection
        response = client.get('/api/collection',
                              data={
                                  constants.ID: collection_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        collection = json.loads(response.content)[constants.COLLECTION]
        self.assertEqual(collection[constants.COLLECTION_USER_TYPE], None)
