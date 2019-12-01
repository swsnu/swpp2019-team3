"""tests_recommendation.py"""
# -*- coding: utf-8 -*-
import json
# 
from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.users.user import User
from papersfeed.models.papers.paper import Paper
from papersfeed.models.collections.collection import Collection

class RecommnedationTestCase(TestCase):
    """user test case"""

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

        # Creating papers
        Paper.objects.create(
            title="paper1",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

    def test_get_user_action(self):
        """Get USER action"""

        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Make Collections
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'test_collection',
                        constants.TEXT: 'test_collection'
                    }),
                    content_type='application/json')

        test_collection_id = Collection.objects.filter(title='test_collection').first().id
        paper_id = Paper.objects.filter(title='paper1').first().id
        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        # Add paper to test_collection
        client.put('/api/paper/collection',
                   json.dumps({
                       constants.ID: paper_id,
                       constants.COLLECTION_IDS: [test_collection_id]
                   }),
                   content_type='application/json')

        # Like Paper
        client.post('/api/like/paper',
                    data=json.dumps({
                        constants.ID: paper_id,
                    }),
                    content_type='application/json')

        # Make Review For Paper
        client.post('/api/review',
                    data=json.dumps({
                        constants.ID: paper_id,
                        constants.TITLE: "Test Review Title",
                        constants.TEXT: 'Test Review Text'
                    }),
                    content_type='application/json')

        response = client.get('/api/user/action')

        self.assertEqual(response.status_code, 200)
        self.assertListEqual([
            {"UserId": user_id, "ItemId": paper_id, "Type": "make_review", "Count": 1},
            {"UserId": user_id, "ItemId": paper_id, "Type": "like_paper", "Count": 1},
            {"UserId": user_id, "ItemId": paper_id, "Type": "add_to_collection", "Count": 1}
            ], json.loads(response.content)["actions"])
        self.assertListEqual([{'UserId': user_id}], json.loads(response.content)["users"])
        self.assertDictEqual({'ItemId': paper_id, 'Keywords': [], 'Abstract': 'abstract1'},
                             json.loads(response.content)["papers"][0])

    def test_post_user_recommendation(self):
        """Post user recommendation"""

        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        paper_id = Paper.objects.filter(title='paper1').first().id
        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        response = client.post('/api/user/recommendation',
                               json.dumps(
                                   {"data": [{"user": user_id, "papers": [paper_id]}]}
                               ),
                               content_type='application/json')

        self.assertEqual(response.status_code, 201)

    def test_get_paper_all(self):
        """Get Paper All"""

        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        response = client.get('/api/paper/all')

        self.assertEqual(response.status_code, 200)

    def test_get_user_all(self):
        """Get User All"""

        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        response = client.get('/api/user/all')

        self.assertEqual(response.status_code, 200)

    def test_get_recommendation(self):
        "Get Recommnedation"

        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        paper_id = Paper.objects.filter(title='paper1').first().id
        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        response = client.post('/api/user/recommendation',
                               json.dumps(
                                   {"data": [{"user": user_id, "papers": [paper_id]}]}
                               ),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/recommendation')

        self.assertEqual(response.status_code, 200)
