"""test.py"""
import json

from django.test import TestCase, Client
from papersfeed import constants

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

        self.assertEqual(response.status_code, 207)
