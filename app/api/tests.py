from django.test import TestCase
from unittest.mock import patch
from sis_exercise.views import SearchView

class SearchViewTest(TestCase):
    def setUp(self):
        self.search_view = SearchView()

    @patch('sis_exercise.views.mock_openai_summarize')
    def test_generate_summary(self, mock_summarize):
        # Mock the summarization function
        mock_summarize.return_value = "This is a summary."

        # Test case with results
        results = [
            {"title": "Title 1", "abstract": "Abstract 1"},
            {"title": "Title 2", "abstract": "Abstract 2"}
        ]
        summary = self.search_view._generate_summary(results)
        self.assertEqual(summary, "This is a summary.")
        mock_summarize.assert_called_once_with("Title 1Abstract 1 Title 2Abstract 2")

        # Test case with empty results
        results = []
        summary = self.search_view._generate_summary(results)
        self.assertEqual(summary, "")
        mock_summarize.assert_called_once()  # Ensure it was called only once
