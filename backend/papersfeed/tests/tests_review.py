"""tests_review.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
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

        # Make Review
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

        paper_id = Paper.objects.filter(title='paper1').first().id

        # Make Review
        response = client.post('/api/review',
                               data=json.dumps({
                                   constants.ID: paper_id,
                                   constants.TITLE: "Test Review Title",
                                   constants.TEXT: 'Test Review Text'
                               }),
                               content_type='application/json')

        self.assertEqual(response.status_code, 201)

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
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

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

        paper_id = Paper.objects.filter(title='paper1').first().id

        # Get Paper's Reviews
        response = client.get('/api/review/paper',
                              data={
                                  constants.ID: paper_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

    def test_review_like(self):
        """ REVIEW LIKE """
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

        # Creating reviews
        Review.objects.create(
            title="review1",
            text="review1_text",
            paper_id=paper_id,
            user_id=user_id
        )
        Review.objects.create(
            title="review2",
            text="review2_text",
            paper_id=paper_id,
            user_id=user_id
        )

        # Like review1
        review_id = Review.objects.filter(title='review1').first().id
        client.post('/api/like/review',
                    data=json.dumps({
                        constants.ID: review_id,
                    }),
                    content_type='application/json')

        # Like review2
        review_id = Review.objects.filter(title='review2').first().id
        client.post('/api/like/review',
                    data=json.dumps({
                        constants.ID: review_id,
                    }),
                    content_type='application/json')

        # Get Reviews the user liked
        response = client.get('/api/review/like')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        reviews = json.loads(response.content)['reviews']
        self.assertEqual(len(reviews), 2)

        # the last action comes first
        self.assertEqual(reviews[0]['title'], 'review2')
        self.assertEqual(reviews[1]['title'], 'review1')

    def test_anonymous_review(self):
        """ ANONYMOUS REVIEW """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        paper_id = Paper.objects.filter(title='paper1').first().id
        swpp_user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        # Make Anonymous Review
        response = client.post('/api/review',
                               data=json.dumps({
                                   constants.ID: paper_id,
                                   constants.TITLE: 'Anonymous Title',
                                   constants.TEXT: 'Anonymous Text',
                                   constants.IS_ANONYMOUS: True
                               }),
                               content_type='application/json')

        self.assertEqual(response.status_code, 201)

        review = json.loads(response.content)['review']
        self.assertEqual(review[constants.IS_ANONYMOUS], True)
        self.assertEqual(review[constants.TITLE], 'Anonymous Title')

        # Get My Reviews
        response = client.get('/api/review/user',
                              data={
                                  constants.ID: swpp_user_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        reviews = json.loads(response.content)['reviews']
        self.assertEqual(len(reviews), 2)

        # Get Paper's Review It should be count 2
        paper_id = Paper.objects.filter(title='paper1').first().id
        response = client.get('/api/review/paper',
                              data={
                                  constants.ID: paper_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        reviews = json.loads(response.content)['reviews']
        self.assertEqual(len(reviews), 2)

        # Sign Up & In with swpp2
        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp2@snu.ac.kr',
                        constants.USERNAME: 'swpp2',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp2@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Get swpp's Reviews: It should be count 1 cause one is anonymous
        response = client.get('/api/review/user',
                              data={
                                  constants.ID: swpp_user_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        reviews = json.loads(response.content)['reviews']
        self.assertEqual(len(reviews), 1)

        # Get Paper's Review It should be count 2
        response = client.get('/api/review/paper',
                              data={
                                  constants.ID: paper_id
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)
        reviews = json.loads(response.content)['reviews']
        self.assertEqual(len(reviews), 2)
