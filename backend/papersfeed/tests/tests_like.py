"""tests_like.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.papers.paper import Paper
from papersfeed.models.papers.paper_like import PaperLike
from papersfeed.models.reviews.review import Review
from papersfeed.models.reviews.review_like import ReviewLike
from papersfeed.models.collections.collection import Collection
from papersfeed.models.collections.collection_like import CollectionLike
from papersfeed.models.users.user import User


class LikeTestCase(TestCase):
    """ like test case """

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
        Paper.objects.create(
            title="paper2",
            language="English",
            abstract="abstract2",
            ISSN="2",
            eISSN="2",
            DOI="2",
            creation_date="2019-11-15",
            modification_date="2019-11-15"
        )

        # Like paper2
        paper_id = Paper.objects.filter(title='paper2').first().id
        client.post('/api/like/paper',
                    data=json.dumps({
                        constants.ID: paper_id,
                    }),
                    content_type='application/json')

        # Creating reviews
        paper_id = Paper.objects.filter(title='paper1').first().id
        client.post('/api/review',
                    data=json.dumps({
                        constants.ID: paper_id,
                        constants.TITLE: 'review1',
                        constants.TEXT: 'Set Up Review Text'
                    }),
                    content_type='application/json')
        client.post('/api/review',
                    data=json.dumps({
                        constants.ID: paper_id,
                        constants.TITLE: 'review2',
                        constants.TEXT: 'Set Up Review Text'
                    }),
                    content_type='application/json')

        # Like review2
        review_id = Review.objects.filter(title='review2').first().id
        client.post('/api/like/review',
                    data=json.dumps({
                        constants.ID: review_id,
                    }),
                    content_type='application/json')

        # Creating collections
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'collection1',
                        constants.TEXT: 'Set Up Collection Text'
                    }),
                    content_type='application/json')
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'collection2',
                        constants.TEXT: 'Set Up Collection Text'
                    }),
                    content_type='application/json')

        # Like collection2
        collection_id = Collection.objects.filter(title='collection2').first().id
        client.post('/api/like/collection',
                    data=json.dumps({
                        constants.ID: collection_id,
                    }),
                    content_type='application/json')


    def test_like_paper(self):
        """LIKE PAPER"""
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
        self.assertEqual(len(PaperLike.objects.filter(paper_id=paper_id, user_id=user_id)), 0)

        # Like Paper
        response = client.post('/api/like/paper',
                               data=json.dumps({
                                   constants.ID: paper_id,
                               }),
                               content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(PaperLike.objects.filter(paper_id=paper_id, user_id=user_id)), 1)

    def test_unlike_paper(self):
        """UNLIKE PAPER"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        paper_id = Paper.objects.filter(title='paper2').first().id
        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id
        self.assertEqual(len(PaperLike.objects.filter(paper_id=paper_id, user_id=user_id)), 1)

        # Unlike Review
        response = client.delete('/api/like/paper',
                                 data=json.dumps({
                                     constants.ID: paper_id
                                 }),
                                 content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(PaperLike.objects.filter(paper_id=paper_id, user_id=user_id)), 0)


    def test_like_review(self):
        """LIKE REVIEW"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        review_id = Review.objects.filter(title='review1').first().id
        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id
        self.assertEqual(len(ReviewLike.objects.filter(review_id=review_id, user_id=user_id)), 0)

        # Like Review
        response = client.post('/api/like/review',
                               data=json.dumps({
                                   constants.ID: review_id,
                               }),
                               content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(ReviewLike.objects.filter(review_id=review_id, user_id=user_id)), 1)

    def test_unlike_review(self):
        """UNLIKE REVIEW"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        review_id = Review.objects.filter(title='review2').first().id
        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id
        self.assertEqual(len(ReviewLike.objects.filter(review_id=review_id, user_id=user_id)), 1)

        # Unlike Review
        response = client.delete('/api/like/review',
                                 data=json.dumps({
                                     constants.ID: review_id
                                 }),
                                 content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(ReviewLike.objects.filter(review_id=review_id, user_id=user_id)), 0)


    def test_like_collection(self):
        """LIKE COLLECTION"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        collection_id = Collection.objects.filter(title='collection1').first().id
        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id
        self.assertEqual(len(CollectionLike.objects.filter(collection_id=collection_id, user_id=user_id)), 0)

        # Like Collection
        response = client.post('/api/like/collection',
                               data=json.dumps({
                                   constants.ID: collection_id,
                               }),
                               content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(CollectionLike.objects.filter(collection_id=collection_id, user_id=user_id)), 1)

    def test_unlike_collection(self):
        """UNLIKE COLLECTION"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        collection_id = Collection.objects.filter(title='collection2').first().id
        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id
        self.assertEqual(len(CollectionLike.objects.filter(collection_id=collection_id, user_id=user_id)), 1)

        # Unlike Collection
        response = client.delete('/api/like/collection',
                                 data=json.dumps({
                                     constants.ID: collection_id
                                 }),
                                 content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(CollectionLike.objects.filter(collection_id=collection_id, user_id=user_id)), 0)
