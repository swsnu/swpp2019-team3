"""tests_subscription.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.users.user import User
from papersfeed.models.papers.paper import Paper
from papersfeed.models.reviews.review import Review
# from papersfeed.models.collections.collection import Collection


class SubscriptionTestCase(TestCase):
    """subscription test case"""

    def setUp(self):
        """SET UP"""
        client = Client()

        # Sign Up : User1
        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'user1@snu.ac.kr',
                        constants.USERNAME: 'user1',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')
        # Sign Up : User2
        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'user2@snu.ac.kr',
                        constants.USERNAME: 'user2',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        # User2 Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'user2@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Creating a Paper
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

        # User2 Write a Review
        paper_id = Paper.objects.filter(title='paper1').first().id
        client.post('/api/review',
                    data=json.dumps({
                        constants.ID: paper_id,
                        constants.TITLE: 'review1',
                        constants.TEXT: 'Set Up Review Text'
                    }),
                    content_type='application/json')

        # User2 Sign out
        client.delete('/api/session')


    def test_select_subscriptions(self):
        """SELECT NOTIFICATIONS"""
        client = Client()

        # User2 Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'user2@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # User2 follows User1
        follow_id = User.objects.filter(email='user1@snu.ac.kr').first().id
        response = client.post('/api/follow',
                               json.dumps({
                                   constants.ID: follow_id
                               }),
                               content_type='application/json')

        # User2 Sign out
        client.delete('/api/session')

        # User1 Sign in
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'user1@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # User1 Likes paper1
        paper_id = Paper.objects.filter(title='paper1').first().id
        client.post('/api/like/paper',
                    data=json.dumps({
                        constants.ID: paper_id,
                    }),
                    content_type='application/json')
        # User1 created collection1
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'SWPP Papers Test',
                        constants.TEXT: 'papers for swpp 2019 class Test'
                    }),
                    content_type='application/json')

        # User1 Likes review1
        review_id = Review.objects.filter(title='review1').first().id
        client.post('/api/like/review',
                    data=json.dumps({
                        constants.ID: review_id,
                    }),
                    content_type='application/json')

        # User1 Sign out
        client.delete('/api/session')

        # User2 Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'user2@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')
        # User2 Get Subscriptions
        response = client.get('/api/subscription',
                              data={
                                  constants.PAGE_NUMBER: 1
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        user1_id = User.objects.get(email='user1@snu.ac.kr').id

        subscriptions = json.loads(response.content)['subscriptions']
        likes_paper = subscriptions[2]
        created_collection = subscriptions[1]
        likes_review = subscriptions[0]
        # test for likes_paper
        self.assertEqual(likes_paper['actor'], {
            constants.ID: user1_id,
            constants.USERNAME: 'user1',
        })
        self.assertEqual(likes_paper['verb'], 'liked')
        # paper = Paper.objects.get(id=paper_id)
        # self.assertEqual(likes_paper['action_object'], paper)

        # test for created_collection
        self.assertEqual(created_collection['actor'], {
            constants.ID: user1_id,
            constants.USERNAME: 'user1',
        })
        self.assertEqual(created_collection['verb'], 'created')
        # collection = Collection.objects.get(id=1)
        # self.assertEqual(created_collection['action_object'], collection)

        # test for likes_review
        self.assertEqual(likes_review['actor'], {
            constants.ID: user1_id,
            constants.USERNAME: 'user1',
        })
        self.assertEqual(likes_review['verb'], 'liked')
        # review = Review.objects.get(id=review_id)
        # self.assertEqual(likes_review['action_object'], review)

        # FIXME: Each of 'paper', 'collection', and 'review' is the result of
        # 'get_papers', 'get_collections' and 'get_reviews'.
        # Please give a hand for the problem.
