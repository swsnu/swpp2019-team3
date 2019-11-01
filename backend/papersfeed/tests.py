from django.test import TestCase, Client

class ApiEntryTestCase(TestCase):
    def test_api_entry(self):
        client = Client()
        response = client.get('/api/wrong')
        self.assertEqual(response.status_code, 404)
        