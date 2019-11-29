"""tests_subscription.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.users.user import User
from papersfeed.models.papers.paper import Paper
from papersfeed.models.subscription.subscription import Subscription

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

        # User1 Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'user1@snu.ac.kr',
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
        client.post('/api/follow',
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
        response = client.get('api/subscription',
                    data={
                        constants.PAGE_NUMBER: 1
                    },
                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)