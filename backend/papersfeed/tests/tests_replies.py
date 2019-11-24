"""tests_reply.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.users.user import User
from papersfeed.models.papers.paper import Paper
from papersfeed.models.reviews.review import Review
from papersfeed.models.collections.collection import Collection
from papersfeed.models.replies.reply_collection import ReplyCollection
from papersfeed.models.replies.reply_review import ReplyReview


class ReplyTestCase(TestCase):
    """ reply test case """

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

        paper_id = Paper.objects.filter(title='paper1').first().id

        # Creating reviews
        client.post('/api/review',
                    json.dumps({
                        constants.ID: paper_id,
                        constants.TITLE: 'test_review_1',
                        constants.TEXT: 'test_review_1'
                    }),
                    content_type='application/json')

        # Creating collections
        client.post('/api/collection',
                    json.dumps({
                        constants.TITLE: 'test_collection_1',
                        constants.TEXT: 'test_collection_1'
                    }),
                    content_type='application/json')

        collection_id = Collection.objects.filter(title='test_collection_1').first().id
        review_id = Review.objects.filter(title="test_review_1").first().id

        # Creating replies
        client.post('/api/reply/collection',
                    json.dumps({
                        constants.ID: collection_id,
                        constants.TEXT: 'test_reply_1'
                    }),
                    content_type='application/json')

        client.post('/api/reply/review',
                    json.dumps({
                        constants.ID: review_id,
                        constants.TEXT: 'test_reply_1'
                    }),
                    content_type='application/json')

    def test_make_reply(self):
        """MAKE Reply"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        collection_id = Collection.objects.filter(title='test_collection_1').first().id
        review_id = Review.objects.filter(title="test_review_1").first().id

        # Make Reply Collection
        response = client.post('/api/reply/collection',
                               json.dumps({
                                   constants.ID: collection_id,
                                   constants.TEXT: 'test_reply_2'
                               }),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # Make Reply Review
        response = client.post('/api/reply/review',
                               json.dumps({
                                   constants.ID: review_id,
                                   constants.TEXT: 'test_reply_2'
                               }),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_get_replies(self):
        """GET REPLY"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id
        collection_id = Collection.objects.filter(title='test_collection_1').first().id
        review_id = Review.objects.filter(title="test_review_1").first().id
        collection_reply_id = ReplyCollection.objects.filter(collection_id=collection_id).first().reply_id

        # Get Replies Collection
        response = client.get('/api/reply/collection',
                              data={
                                  constants.ID: collection_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertIn(
            '{"replies": [{"id": ' + str(collection_reply_id)
            + ', "text": "test_reply_1", "liked": false, "review": {}, "collection": {"id":'
            + ' ' + str(collection_id)
            + ', "title": "test_collection_1", "text": "test_collection_1", "liked": false, '
            + '"contains_paper": false, "count": {"users": 1, "papers": 0, "likes": 0, "replies": 1}},'
            + ' "user": {"id": ' + str(user_id)
            + ', "username": "swpp", "email": "swpp@snu.ac.kr", "description": "", '
            + '"count": {"follower": 0, "following": 0}}, "count": {"likes": 0}}], '
            + '"page_number": 1, '
            + '"is_finished": true}',
            response.content.decode())
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        # Get Replies Review
        response = client.get('/api/reply/review',
                              data={
                                  constants.ID: review_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

    def test_edit_reply(self):
        """EDIT REPLY"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        collection_id = Collection.objects.filter(title='test_collection_1').first().id
        review_id = Review.objects.filter(title="test_review_1").first().id

        collection_reply_id = ReplyCollection.objects.filter(collection_id=collection_id).first().reply_id
        review_reply_id = ReplyReview.objects.filter(review_id=review_id).first().reply_id

        # Get Replies Collection
        response = client.put('/api/reply/collection',
                              data={
                                  constants.ID: collection_reply_id,
                                  constants.TEXT: 'test_reply_edit'
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

        # Get Replies Review
        response = client.put('/api/reply/review',
                              data={
                                  constants.ID: review_reply_id,
                                  constants.TEXT: 'test_reply_edit'
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_delete_reply(self):
        """DELETE REPLY"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        collection_id = Collection.objects.filter(title='test_collection_1').first().id
        review_id = Review.objects.filter(title="test_review_1").first().id
        collection_reply_id = ReplyCollection.objects.filter(collection_id=collection_id).first().reply_id
        review_reply_id = ReplyReview.objects.filter(review_id=review_id).first().reply_id

        # Delete Reply
        response = client.delete('/api/reply/collection',
                                 data=json.dumps({
                                     constants.ID: collection_reply_id
                                 }),
                                 content_type='application/json')

        self.assertEqual(response.status_code, 200)

        response = client.delete('/api/reply/review',
                                 data=json.dumps({
                                     constants.ID: review_reply_id
                                 }),
                                 content_type='application/json')

        self.assertEqual(response.status_code, 200)
