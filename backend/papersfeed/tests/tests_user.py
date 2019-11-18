"""tests_user.py"""
# -*- coding: utf-8 -*-
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.users.user import User
from papersfeed.models.users.user_follow import UserFollow


class UserTestCase(TestCase):
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

    def test_csrf(self):
        """ CSRF TOKEN TEST """
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/user',
                               json.dumps({
                                   constants.EMAIL: 'csrf@snu.ac.kr',
                                   constants.USERNAME: 'scrf',
                                   constants.PASSWORD: 'iluvswpp1234'
                               }),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)  # Request without csrf token returns 403 response

        response = client.get('/api/token')

        csrf_token = response.cookies['csrftoken'].value  # Get csrf token from cookie

        response = client.post('/api/user',
                               json.dumps({
                                   constants.EMAIL: 'csrf@snu.ac.kr',
                                   constants.USERNAME: 'csrf',
                                   constants.PASSWORD: 'iluvswpp1234'
                               }),
                               content_type='application/json',
                               HTTP_X_CSRFTOKEN=csrf_token)

        self.assertEqual(response.status_code, 201)  # Pass csrf protection

    def test_sign_up(self):
        """ SIGN UP """
        client = Client()

        # Sign Up
        response = client.post('/api/user',
                               json.dumps({
                                   constants.EMAIL: 'swpptest@snu.ac.kr',
                                   constants.USERNAME: 'swpptest',
                                   constants.PASSWORD: 'iluvswpptest'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

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

        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        self.assertIn(
            '{"id": ' + str(user_id)
            + ', "username": "swpp", "email": "swpp@snu.ac.kr", "description": "",'
            + ' "count": {"follower": 0, "following": 0}}',
            response.content.decode())

    def test_get_user_me(self):
        """GET CURRENT USER"""
        client = Client()

        response = client.get('/api/session',
                              data={
                                  constants.EMAIL: 'swpp@snu.ac.kr',
                                  constants.PASSWORD: 'iluvswpp1234'
                              },
                              content_type='application/json')

        self.assertEqual(response.status_code, 200)

        response = client.get('/api/user/me', content_type='application/json')

        self.assertEqual(response.status_code, 200)

        user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id

        self.assertIn(
            '{"id": ' + str(user_id)
            + ', "username": "swpp", "email": "swpp@snu.ac.kr", "description": "",'
            + ' "count": {"follower": 0, "following": 0}}',
            response.content.decode())

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

        self.assertEqual(response.status_code, 201)

    def test_unfollow(self):
        """ UNFOLLOW """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        follow_id = User.objects.filter(email='swpp2@snu.ac.kr').first().id

        # Follow
        client.post('/api/follow',
                    json.dumps({
                        constants.ID: follow_id
                    }),
                    content_type='application/json')

        # Unfollow Success
        response = client.delete('/api/follow',
                                 json.dumps({
                                     constants.ID: follow_id
                                 }), content_type='application/json')

        self.assertEqual(response.status_code, 200)

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
                       constants.DESCRIPTION: 'swpp team 3',
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        response = client.put('/api/user',
                              data=json.dumps({
                                  constants.DESCRIPTION: 'papersfeed',
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

    def test_user_search(self):
        """ SEARCH USER """
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        # Make User
        # Username: IamKeyword
        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'IamKeyword@snu.ac.kr',
                        constants.USERNAME: 'IamKeyword',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        # Make User
        # Username: keywordUser
        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'keywordUser@snu.ac.kr',
                        constants.USERNAME: 'keywordUser',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        # Search with Keyword 'swpp'
        response = client.get('/api/user/search',
                              data={
                                  constants.TEXT: 'swpp'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 3)

        # Search with Keyword 'keyword'
        response = client.get('/api/user/search',
                              data={
                                  constants.TEXT: 'keyword'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 2)

        # Search with Keyword 'blahblah'
        response = client.get('/api/user/search',
                              data={
                                  constants.TEXT: 'blahblah'
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 0)

    def test_get_user_following(self):
        """Get Users User is Following"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        swpp_user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id
        swpp2_user_id = User.objects.filter(email='swpp2@snu.ac.kr').first().id
        swpp3_user_id = User.objects.filter(email='swpp3@snu.ac.kr').first().id

        # My Following User count : 0
        response = client.get('/api/user/following',
                              data={
                                  constants.ID: swpp_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 0)

        # My Following User count : 1
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp2_user_id)
        response = client.get('/api/user/following',
                              data={
                                  constants.ID: swpp_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 1)

        # My Following User count : 2
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp3_user_id)
        response = client.get('/api/user/following',
                              data={
                                  constants.ID: swpp_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 2)

        # Other's Following User count : 0
        response = client.get('/api/user/following',
                              data={
                                  constants.ID: swpp2_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 0)

        # Other's Following User count : 1
        UserFollow.objects.create(following_user_id=swpp2_user_id, followed_user_id=swpp_user_id)
        response = client.get('/api/user/following',
                              data={
                                  constants.ID: swpp2_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 1)

    def test_get_user_followed(self):
        """Get User’s Followers"""
        client = Client()

        # Sign In
        client.get('/api/session',
                   data={
                       constants.EMAIL: 'swpp@snu.ac.kr',
                       constants.PASSWORD: 'iluvswpp1234'
                   },
                   content_type='application/json')

        swpp_user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id
        swpp2_user_id = User.objects.filter(email='swpp2@snu.ac.kr').first().id
        swpp3_user_id = User.objects.filter(email='swpp3@snu.ac.kr').first().id

        # My Followed User count : 0
        response = client.get('/api/user/followed',
                              data={
                                  constants.ID: swpp_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 0)

        # My Followed User count : 1
        UserFollow.objects.create(following_user_id=swpp2_user_id, followed_user_id=swpp_user_id)
        response = client.get('/api/user/followed',
                              data={
                                  constants.ID: swpp_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 1)

        # My Followed User count : 2
        UserFollow.objects.create(following_user_id=swpp3_user_id, followed_user_id=swpp_user_id)
        response = client.get('/api/user/followed',
                              data={
                                  constants.ID: swpp_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 2)

        # Other's Followed User count : 0
        response = client.get('/api/user/followed',
                              data={
                                  constants.ID: swpp2_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 0)

        # Other's Followed User count : 1
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp2_user_id)
        response = client.get('/api/user/followed',
                              data={
                                  constants.ID: swpp2_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 1)
