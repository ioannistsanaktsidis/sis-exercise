from django.test import TestCase
from rest_framework import status
from rest_framework.response import Response
from unittest.mock import patch
from api.views import SearchView
from sis_exercise.exceptions import InvalidInputError, InternalServerError, ResourceNotFound


class SearchViewTest(TestCase):
    def setUp(self):
        self.search_view = SearchView()
        self.url = '/api/search/'

    @patch('api.views.mock_openai_summarize')
    def test_generate_summary_with_results(self, mock_summarize):
        mock_summarize.return_value = "This is a summary."
        results = [
            {"title": "Title 1", "abstract": "Abstract 1"},
            {"title": "Title 2", "abstract": "Abstract 2"}
        ]
        summary = self.search_view._generate_summary(results)
        self.assertEqual(summary, "This is a summary.")
        mock_summarize.assert_called_once_with("Title 1Abstract 1 Title 2Abstract 2")

    @patch('api.views.mock_openai_summarize')
    def test_generate_summary_with_empty_results(self, mock_summarize):
        results = []
        summary = self.search_view._generate_summary(results)
        self.assertEqual(summary, "")
        mock_summarize.assert_not_called()

    @patch('api.views.SearchView.get')
    def test_get_success(self, mock_get):
        mock_response = Response({
            "total": 2,
            "results": [
                {"title": "Title 1", "abstract": "Abstract 1"},
                {"title": "Title 2", "abstract": "Abstract 2"}
            ],
            "summary": "This is a summary."
        }, status=status.HTTP_200_OK)
        mock_get.return_value = mock_response

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total"], 2)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["summary"], "This is a summary.")

    @patch('api.views.SearchView.get')
    def test_get_validation_error(self, mock_get):
        mock_get.side_effect = InvalidInputError("Invalid input provided")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('api.views.SearchView.get')
    def test_get_internal_server_error(self, mock_get):
        mock_get.side_effect = InternalServerError("Server error")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    @patch('api.views.SearchView.get')
    def test_get_not_found_error(self, mock_get):
        mock_get.side_effect = ResourceNotFound("Not found")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
