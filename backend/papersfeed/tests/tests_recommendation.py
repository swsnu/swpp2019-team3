"""tests_recommendation.py"""
# -*- coding: utf-8 -*-
import json
from unittest.mock import patch
from django.test import TestCase, Client

from papersfeed import constants
from papersfeed.tests.tests import MockResponse
from papersfeed.models.users.user import User
from papersfeed.models.papers.paper import Paper
from papersfeed.models.reviews.review import Review
from papersfeed.models.collections.collection import Collection
from papersfeed.models.papers.keyword import Keyword
from papersfeed.models.papers.paper_keyword import PaperKeyword

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

        Paper.objects.create(
            title="paper2",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

        Keyword.objects.create(
            name="keyword1"
        )

        Keyword.objects.create(
            name="keyword2"
        )

        Paper.objects.create(
            title="paper",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

        Paper.objects.create(
            title="paper",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

        Paper.objects.create(
            title="paper",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

        Paper.objects.create(
            title="paper",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

        Paper.objects.create(
            title="paper",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

        Paper.objects.create(
            title="paper",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

        Paper.objects.create(
            title="paper",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

        Paper.objects.create(
            title="paper",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

        Paper.objects.create(
            title="paper",
            language="English",
            abstract="abstract1",
            ISSN="1",
            eISSN="1",
            DOI="1",
            creation_date="2019-11-13",
            modification_date="2019-11-13",
        )

        paper_id1 = Paper.objects.filter(title='paper1').first().id
        paper_id2 = Paper.objects.filter(title='paper2').first().id
        keyword_id1 = Keyword.objects.filter(name='keyword1').first().id
        keyword_id2 = Keyword.objects.filter(name='keyword2').first().id

        paper_qs = Paper.objects.filter(title='paper')
        paper_ids = [paper.id for paper in paper_qs]

        PaperKeyword.objects.bulk_create([
            PaperKeyword(
                paper_id=paper_id,
                keyword_id=keyword_id1,
                type='abstract'
            ) for paper_id in paper_ids
        ])

        PaperKeyword.objects.create(
            paper_id=paper_id1,
            keyword_id=keyword_id1,
            type="abstract"
        )

        PaperKeyword.objects.create(
            paper_id=paper_id2,
            keyword_id=keyword_id2,
            type="abstract"
        )


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

        client.post('/api/review',
                    data=json.dumps({
                        constants.ID: paper_id,
                        constants.TITLE: 'Set Up Review Title',
                        constants.TEXT: 'Set Up Review Text'
                    }),
                    content_type='application/json')

        client.post('/api/review',
                    data=json.dumps({
                        constants.ID: paper_id,
                        constants.TITLE: 'Set Up Review Title2',
                        constants.TEXT: 'Set Up Review Text2'
                    }),
                    content_type='application/json')

        review_id = Review.objects.filter(title='Set Up Review Title2').first().id

        # Like Review
        response = client.post('/api/like/review',
                               data=json.dumps({
                                   constants.ID: review_id,
                               }),
                               content_type='application/json')
        response = self.client.post('/api/user/recommendation',
                                    data=dict(data=json.dumps([{"user":user_id, "papers": [paper_id]}])))
        self.assertEqual(response.status_code, 201)


        response = client.get('/api/recommendation')
        self.assertEqual(response.status_code, 200)

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
        keyword_id = Keyword.objects.filter(name='keyword1').first().id

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
        self.assertDictEqual({
            'ItemId': paper_id,
            'Keywords': [{'id': keyword_id, 'name': 'keyword1', 'type': 'abstract'}],
            'Abstract': 'abstract1'
            }, json.loads(response.content)["papers"][10])

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
        response = self.client.post('/api/user/recommendation',
                                    data=dict(data=json.dumps([{"user":user_id, "papers": [paper_id]}])))

        self.assertEqual(response.status_code, 201)

    @patch('requests.get')
    def test_get_paper_all(self, mock_get):
        """Get Paper All"""

        # create paper with empty abstract
        Paper.objects.create(
            title="paper_without_abstract",
            language="English",
            abstract="",
            DOI="10.1136/jech.2007.061986",
        )

        stub_json = json.loads(open("papersfeed/tests/papers/stub_semanticscholar.json", 'r').read())
        mock_get.return_value = MockResponse(json_data=stub_json, status_code=200)

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
        # ['papers'][0] of response is corresponding to the "paper_without_abstract" paper
        # because we got a new abstract from Semantic Scholar API(mocked), its length should be more than 0
        self.assertTrue(response.json()['papers'][0]['Abstract'])

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

    def test_get_keyword_init(self):
        """Get Keyword init"""

        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        keyword_id = Keyword.objects.filter(name='keyword1').first().id

        response = client.get('/api/keyword/init')

        self.assertEqual(200, response.status_code)
        self.assertListEqual([{
            'id': keyword_id,
            'name': 'keyword1',
            }], json.loads(response.content)["keywords"])

    def test_post_recommendation_init(self):
        """Post Recommendation init"""

        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        keyword_id = Keyword.objects.filter(name='keyword1').first().id

        response = client.post('/api/recommendation/init',
                               json.dumps({
                                   'keywords': [keyword_id]
                               }),
                               content_type='application/json')

        self.assertEqual(201, response.status_code)

        response = client.get('/api/recommendation')
        self.assertEqual(response.status_code, 200)
