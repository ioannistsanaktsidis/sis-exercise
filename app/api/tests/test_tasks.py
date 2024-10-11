from django.test import TestCase
from datetime import datetime
from api.tasks import calculate_arxiv_id, parse_publication_date

class TestTasks(TestCase):

    def test_calculate_arxiv_id_with_valid_data(self):
        literature_data = {
            'arxiv_eprints': [
                {
                    'categories': [
                        'nucl-th',
                        'astro-ph.HE'
                    ],
                    'value': '2008.06932'
                }
            ]
        }
        expected_arxiv_id = 'nucl-th/2008.06932'
        self.assertEqual(calculate_arxiv_id(literature_data), expected_arxiv_id)

    def test_calculate_arxiv_id_with_missing_categories(self):
        literature_data = {
            'arxiv_eprints': [
                {
                    'categories': [],
                    'value': '1234.5678'
                }
            ]
        }
        expected_arxiv_id = ''
        self.assertEqual(calculate_arxiv_id(literature_data), expected_arxiv_id)

    def test_calculate_arxiv_id_with_missing_value(self):
        literature_data = {
            'arxiv_eprints': [
                {
                    'categories': [
                        "nucl-th",
                        "astro-ph.HE"
                    ],
                    'value': ''
                }
            ]
        }
        expected_arxiv_id = ''
        self.assertEqual(calculate_arxiv_id(literature_data), expected_arxiv_id)

    def test_calculate_arxiv_id_with_no_arxiv_eprints(self):
        literature_data = {}
        expected_arxiv_id = ''
        self.assertEqual(calculate_arxiv_id(literature_data), expected_arxiv_id)

    def test_parse_publication_date_with_valid_date(self):
        date_str = '2023-10-01'
        expected_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        self.assertEqual(parse_publication_date(date_str), expected_date)

    def test_parse_publication_date_with_invalid_date(self):
        date_str = 'invalid-date'
        self.assertIsNone(parse_publication_date(date_str))

    def test_parse_publication_date_with_none(self):
        date_str = None
        self.assertIsNone(parse_publication_date(date_str))
