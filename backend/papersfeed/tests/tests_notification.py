"""tests_notification.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from notifications.models import Notification
from papersfeed import constants
from papersfeed.models.papers.paper import Paper
from papersfeed.models.reviews.review import Review
from papersfeed.models.collections.collection import Collection
from papersfeed.models.users.user import User


class LikeTestCase(TestCase):
    """ like test case """

    def setUp(self):
        """SET UP"""
        client = Client()

        # Sign Up
        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'user1@snu.ac.kr',
                        constants.USERNAME: 'user1',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

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

        # User1 Write a Review
        paper_id = Paper.objects.filter(title='paper1').first().id
        client.post('/api/review',
                    data=json.dumps({
                        constants.ID: paper_id,
                        constants.TITLE: 'review1',
                        constants.TEXT: 'Set Up Review Text'
                    }),
                    content_type='application/json')

        # User1 Create a Collection
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'collection1',
                        constants.TEXT: 'Set Up Collection Text'
                    }),
                    content_type='application/json')


    def test_select_notifications(self):
        """SELECT NOTIFICATIONS"""
        client = Client()

        # User2 Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'user2@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # User2 Like review1
        review_id = Review.objects.filter(title='review1').first().id
        client.post('/api/like/review',
                    data=json.dumps({
                        constants.ID: review_id,
                    }),
                    content_type='application/json')

        # User2 Like collection1
        collection_id = Collection.objects.filter(title='collection1').first().id
        client.post('/api/like/collection',
                    data=json.dumps({
                        constants.ID: collection_id,
                    }),
                    content_type='application/json')

        # User2 follow user1
        user1_id = User.objects.get(email='user1@snu.ac.kr').id
        client.post('/api/follow',
                    data=json.dumps({
                        constants.ID: user1_id
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

        # User1 Get Notifications
        response = client.get('/api/notification',
                              data={
                                  constants.PAGE_NUMBER: 1
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        user2_id = User.objects.get(email='user2@snu.ac.kr').id

        notifications = json.loads(response.content)['notifications']
        # the last action comes first
        follow_noti = notifications[0]
        collection_noti = notifications[1]
        review_noti = notifications[2]

        # Check follow_noti
        self.assertEqual(follow_noti['actor'], {
            constants.ID: user2_id,
            constants.USERNAME: 'user2'
        })
        self.assertEqual(follow_noti['verb'], 'started following you')
        self.assertEqual(follow_noti['target'], {
            constants.TYPE: 'user',
            constants.ID: user1_id,
            constants.STRING: 'user1'
        })

        # Check collection_noti
        self.assertEqual(collection_noti['actor'], {
            constants.ID: user2_id,
            constants.USERNAME: 'user2'
        })
        self.assertEqual(collection_noti['verb'], 'liked')
        self.assertEqual(collection_noti['target'], {
            constants.TYPE: 'collection',
            constants.ID: collection_id,
            constants.STRING: 'collection1'
        })

        # Check review_noti
        self.assertEqual(review_noti['actor'], {
            constants.ID: user2_id,
            constants.USERNAME: 'user2'
        })
        self.assertEqual(review_noti['verb'], 'liked')
        self.assertEqual(review_noti['target'], {
            constants.TYPE: 'review',
            constants.ID: review_id,
            constants.STRING: 'review1'
        })

    def test_read_notification(self):
        """READ NOTIFICATION"""
        client = Client()

        # User2 Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'user2@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # User2 Like review1
        review_id = Review.objects.filter(title='review1').first().id
        client.post('/api/like/review',
                    data=json.dumps({
                        constants.ID: review_id,
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

        user2_id = User.objects.get(email='user2@snu.ac.kr').id
        notification = Notification.objects.get(actor_object_id=user2_id)
        self.assertEqual(notification.unread, True)

        # Mark the Notification as Read
        client.put('/api/notification', data=json.dumps({
            constants.ID: notification.id,
        }))

        notification = Notification.objects.get(actor_object_id=user2_id)
        self.assertEqual(notification.unread, False)
