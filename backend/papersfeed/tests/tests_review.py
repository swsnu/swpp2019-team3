"""tests_review.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.utils.papers.utils import get_paper_migration
from papersfeed.models.papers.paper import Paper
from papersfeed.models.reviews.review import Review
from papersfeed.models.users.user import User


class ReviewTestCase(TestCase):
    """ review test case """

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

        # Migrate
        get_paper_migration()

        paper_id = Paper.objects.filter(title='CERTIFIED LATTICE REDUCTION').first().id

        client.post('/api/review',
                    data=json.dumps({
                        constants.ID: paper_id,
                        constants.TITLE: 'Set Up Review Title',
                        constants.TEXT: 'Set Up Review Text'
                    }),
                    content_type='application/json')

    def test_make_review(self):
        """MAKE REVIEW"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        paper_id = Paper.objects.filter(title='CERTIFIED LATTICE REDUCTION').first().id

        # Make Review
        response = client.post('/api/review',
                               data=json.dumps({
                                   constants.ID: paper_id,
                                   constants.TITLE: "Test Review Title",
                                   constants.TEXT: 'Test Review Text'
                               }),
                               content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_get_review(self):
        """GET REVIEW"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        review_id = Review.objects.filter(title='Set Up Review Title').first().id

        # Get Review
        response = client.get('/api/review',
                              data={
                                  constants.ID: review_id
                              })

        self.assertEqual(response.status_code, 200)

    def test_delete_review(self):
        """DELETE REVIEW"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        review_id = Review.objects.filter(title='Set Up Review Title').first().id

        # Delete Review
        response = client.delete('/api/review',
                                 data=json.dumps({
                                     constants.ID: review_id
                                 }),
                                 content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_edit_review(self):
        """ EDIT REVIEW """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        review_id = Review.objects.filter(title='Set Up Review Title').first().id

        # Put Collection
        response = client.put('/api/review',
                              data=json.dumps({
                                  constants.ID: review_id,
                                  constants.TITLE: 'Edited Review Title',
                                  constants.TEXT: 'Edited Review Text'

                              }),
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_get_reviews_of_user(self):
        """ GET USER'S REVIEWS """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        # Get User's Reviews
        response = client.get('/api/review/user',
                              data={
                                  constants.ID: user_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_get_reviews_of_paper(self):
        """ GET PAPER'S REVIEWS """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        # Get Paper's Reviews
        response = client.get('/api/review/paper',
                              data={
                                  constants.ID: user_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
