"""tests_user.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.users.user import User


class UserTestCase(TestCase):
    """user test case"""

    def setUp(self):
        """SET UP"""

        client = Client()

        """ Sign Up"""
        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp@snu.ac.kr',
                        constants.USERNAME: 'swpp',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp2@snu.ac.kr',
                        constants.USERNAME: 'swpp2',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp3@snu.ac.kr',
                        constants.USERNAME: 'swpp3',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

    def test_sign_up(self):
        """ SIGN UP """
        client = Client()

        """ Sign Up"""
        response = client.post('/api/user',
                               json.dumps({
                                   constants.EMAIL: 'swpptest@snu.ac.kr',
                                   constants.USERNAME: 'swpptest',
                                   constants.PASSWORD: 'iluvswpptest'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_sign_in(self):
        """ SIGN IN """
        client = Client()

        response = client.get('/api/session',
                              data={
                                  constants.EMAIL: 'swpp@snu.ac.kr',
                                  constants.PASSWORD: 'iluvswpp1234'
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_sign_out(self):
        """ SIGN OUT """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        response = client.delete('/api/session')

        self.assertEqual(response.status_code, 200)

    def test_follow(self):
        """ FOLLOW """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        follow_id = User.objects.filter(email='swpp2@snu.ac.kr').first().id

        # Follow Success
        response = client.post('/api/follow',
                               json.dumps({
                                   constants.ID: follow_id
                               }),
                               content_type='application/json')

        self.assertEqual(response.status_code, 200)

    # def test_unfollow(self):
    #     """ UNFOLLOW """
    #     client = Client()
    #
    #     # Sign In
    #     client.get('/api/session',
    #                data={
    #                    constants.EMAIL: 'swpp@snu.ac.kr',
    #                    constants.PASSWORD: 'iluvswpp1234'
    #                },
    #                content_type='application/json')
    #
    #     # Follow
    #     client.post('/api/follow',
    #                 json.dumps({
    #                     constants.ID: 2
    #                 }),
    #                 content_type='application/json')
    #
    #     unfollow_id = User.objects.filter(email='swpp2@snu.ac.kr').first().id
    #
    #     # Unfollow Success
    #     response = client.delete('/api/follow',
    #                              json.dumps({
    #                                constants.ID: unfollow_id
    #                              }),
    #                              content_type='application/json')
    #
    #     self.assertEqual(response.status_code, 200)

    def test_get_user(self):
        """" GET SINGLE USER """

        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        user_id = User.objects.filter(email='swpp2@snu.ac.kr').first().id

        response = client.get('/api/user',
                              {constants.ID: user_id},
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_edit_user(self):
        """" EDIT USER """

        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        response = client.put('/api/user',
                              data=json.dumps({
                                  constants.EMAIL: 'swppEdit@snu.ac.kr',
                                  constants.USERNAME: 'swppEdit',
                                  constants.PASSWORD: 'iluvswpp1234Edit'
                              }),
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

    def test_delete_user(self):
        """" DELETE USER """

        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        response = client.delete('/api/user')

        self.assertEqual(response.status_code, 200)
