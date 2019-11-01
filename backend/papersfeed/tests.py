"""test.py"""
from django.test import TestCase, Client

class ApiEntryTestCase(TestCase):
    """api_entry test"""
    def test_notfound(self):
        """response status should be 404 if wrong url"""
        client = Client()
        response = client.get('/api/wrong')
        self.assertEqual(response.status_code, 404)
