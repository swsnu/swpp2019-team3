"""test.py"""
import json

from django.test import TestCase, Client
from papersfeed import constants
from papersfeed.models.users.user import User
from papersfeed.models.users.user_follow import UserFollow

class ApiEntryTestCase(TestCase):
    """api_entry test"""

    def test_notfound(self):
        """response status should be 404 if wrong url"""
        client = Client()
        response = client.get('/api/wrong')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/wrong/wrong')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/wrong/wrong/wrong')
        self.assertEqual(response.status_code, 404)

        response = client.get('/api/wrong/wrong/wrong')
        self.assertEqual(response.status_code, 404)

    def test_session_error(self):
        """response status should be 207 if there is no session"""
        client = Client()

        # For Example Follow Action
        response = client.post('/api/follow',
                               json.dumps({
                                   constants.ID: 0
                               }),
                               content_type='application/json')

        self.assertEqual(response.status_code, 403)

    def test_invalid_json_error(self):
        """response status should be 421 if json.loads failed"""
        client = Client()

        response = client.post('/api/collection',
                               data='{array: [1, 2, 3]}',
                               content_type='application/json')

        self.assertEqual(response.status_code, 500)

    # pylint: disable=too-many-locals, too-many-statements
    def test_pagination(self):
        """pagination should return isFinished value correctly, and current page number"""
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

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp4@snu.ac.kr',
                        constants.USERNAME: 'swpp4',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp5@snu.ac.kr',
                        constants.USERNAME: 'swpp5',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp6@snu.ac.kr',
                        constants.USERNAME: 'swpp6',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp7@snu.ac.kr',
                        constants.USERNAME: 'swpp7',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp8@snu.ac.kr',
                        constants.USERNAME: 'swpp8',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp9@snu.ac.kr',
                        constants.USERNAME: 'swpp9',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp10@snu.ac.kr',
                        constants.USERNAME: 'swpp10',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp11@snu.ac.kr',
                        constants.USERNAME: 'swpp11',
                        constants.PASSWORD: 'iluvswpp1234'
                    }),
                    content_type='application/json')

        client.post('/api/user',
                    json.dumps({
                        constants.EMAIL: 'swpp12@snu.ac.kr',
                        constants.USERNAME: 'swpp12',
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

        swpp_user_id = User.objects.filter(email='swpp@snu.ac.kr').first().id
        swpp2_user_id = User.objects.filter(email='swpp2@snu.ac.kr').first().id
        swpp3_user_id = User.objects.filter(email='swpp3@snu.ac.kr').first().id
        swpp4_user_id = User.objects.filter(email='swpp4@snu.ac.kr').first().id
        swpp5_user_id = User.objects.filter(email='swpp5@snu.ac.kr').first().id
        swpp6_user_id = User.objects.filter(email='swpp6@snu.ac.kr').first().id
        swpp7_user_id = User.objects.filter(email='swpp7@snu.ac.kr').first().id
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp2_user_id)
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp3_user_id)
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp4_user_id)
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp5_user_id)
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp6_user_id)
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp7_user_id)

        # Test without page_number it should be 1 by default
        response = client.get('/api/user/following',
                              data={
                                  constants.ID: swpp_user_id
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 6)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        swpp8_user_id = User.objects.filter(email='swpp8@snu.ac.kr').first().id
        swpp9_user_id = User.objects.filter(email='swpp9@snu.ac.kr').first().id
        swpp10_user_id = User.objects.filter(email='swpp10@snu.ac.kr').first().id
        swpp11_user_id = User.objects.filter(email='swpp11@snu.ac.kr').first().id

        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp8_user_id)
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp9_user_id)
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp10_user_id)
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp11_user_id)

        # Test Pagination Edge Case
        response = client.get('/api/user/following',
                              data={
                                  constants.ID: swpp_user_id,
                                  constants.PAGE_NUMBER: 1
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 10)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        swpp12_user_id = User.objects.filter(email='swpp12@snu.ac.kr').first().id
        UserFollow.objects.create(following_user_id=swpp_user_id, followed_user_id=swpp12_user_id)

        response = client.get('/api/user/following',
                              data={
                                  constants.ID: swpp_user_id,
                                  constants.PAGE_NUMBER: 1
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 10)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], False)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 1)

        response = client.get('/api/user/following',
                              data={
                                  constants.ID: swpp_user_id,
                                  constants.PAGE_NUMBER: 2
                              },
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(json.loads(response.content.decode())[constants.USERS]), 1)
        self.assertEqual(json.loads(response.content.decode())[constants.IS_FINISHED], True)
        self.assertEqual(int(json.loads(response.content.decode())[constants.PAGE_NUMBER]), 2)
    # pylint: enable=too-many-locals, too-many-statements


# TEST UTILS
# pylint: disable=too-few-public-methods
class MockResponse:
    """MockResponse"""
    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        """json()"""
        return self.json_data
