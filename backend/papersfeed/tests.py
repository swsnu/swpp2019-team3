"""test.py"""
from django.test import TestCase, Client

class ApiEntryTestCase(TestCase):
    """api_entry test"""
    def test_notfound(self):
        """api_entry_test"""
        client = Client()
        response = client.get('/api/wrong')
        self.assertEqual(response.status_code, 404)
        