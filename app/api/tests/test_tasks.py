from django.test import TestCase
from datetime import datetime
from unittest.mock import patch, MagicMock
from api.tasks import calculate_arxiv_id, parse_publication_date, harvest_hep_data

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
        date_str = '2024-10-01'
        expected_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        self.assertEqual(parse_publication_date(date_str), expected_date)

    def test_parse_publication_date_with_invalid_date(self):
        date_str = 'invalid-date'
        self.assertIsNone(parse_publication_date(date_str))

    def test_parse_publication_date_with_none(self):
        date_str = None
        self.assertIsNone(parse_publication_date(date_str))

    @patch('api.tasks.requests.get')
    @patch('api.tasks.Literature.objects.create')
    def test_harvest_hep_data_success(self, mock_create, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'hits': {
                'hits': [
                    {
                        'metadata': {
                            'titles': [{'title': 'Test Title'}],
                            'abstracts': [{'value': 'Test Abstract'}],
                            'imprints': [{'date': '2024-10-01'}],
                            'arxiv_eprints': [{'categories': ['nucl-th'], 'value': '1234.5678'}]
                        }
                    }
                ]
            },
            'links': {'next': None}
        }
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        harvest_hep_data()

        mock_create.assert_called_once_with(
            title='Test Title',
            abstract='Test Abstract',
            publication_date=parse_publication_date('2024-10-01'),
            arxiv_id='nucl-th/1234.5678'
        )

    @patch('api.tasks.requests.get')
    @patch('api.tasks.Literature.objects.create')
    def test_harvest_hep_data_with_long_title(self, mock_create, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'hits': {
                'hits': [
                    {
                        'metadata': {
                            'titles': [{'title': 'T' * 201}],
                            'abstracts': [{'value': 'Test Abstract'}],
                            'imprints': [{'date': '2024-10-01'}],
                            'arxiv_eprints': [{'categories': ['nucl-th'], 'value': '1234.5678'}]
                        }
                    }
                ]
            },
            'links': {'next': None}
        }
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        harvest_hep_data()

        mock_create.assert_not_called()

    @patch('api.tasks.requests.get')
    @patch('api.tasks.Literature.objects.create')
    def test_harvest_hep_data_with_long_arxiv_id(self, mock_create, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'hits': {
                'hits': [
                    {
                        'metadata': {
                            'titles': [{'title': 'Test Title'}],
                            'abstracts': [{'value': 'Test Abstract'}],
                            'imprints': [{'date': '2024-10-01'}],
                            'arxiv_eprints': [{'categories': ['nucl-th'], 'value': '1' * 51}]
                        }
                    }
                ]
            },
            'links': {'next': None}
        }
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        harvest_hep_data()

        mock_create.assert_called_once_with(
            title='Test Title',
            abstract='Test Abstract',
            publication_date=parse_publication_date('2024-10-01'),
            arxiv_id=''
        )

    @patch('api.tasks.requests.get')
    @patch('api.tasks.Literature.objects.create')
    def test_harvest_hep_data_with_invalid_date(self, mock_create, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'hits': {
                'hits': [
                    {
                        'metadata': {
                            'titles': [{'title': 'Test Title'}],
                            'abstracts': [{'value': 'Test Abstract'}],
                            'imprints': [{'date': '2024'}],
                            'arxiv_eprints': [{'categories': ['nucl-th'], 'value': '1' * 51}]
                        }
                    }
                ]
            },
            'links': {'next': None}
        }
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        harvest_hep_data()

        mock_create.assert_not_called()

    @patch('api.tasks.requests.get')
    @patch('api.tasks.Literature.objects.create')
    def test_harvest_hep_data_with_missing_fields(self, mock_create, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'hits': {
                'hits': [
                    {
                        'metadata': {
                            'titles': [{'title': ''}],
                            'abstracts': [{'value': ''}],
                            'imprints': [{'date': ''}],
                            'arxiv_eprints': [{'categories': ['nucl-th'], 'value': '1234.5678'}]
                        }
                    }
                ]
            },
            'links': {'next': None}
        }
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        harvest_hep_data()

        mock_create.assert_not_called()

    @patch('api.tasks.requests.get')
    @patch('api.tasks.Literature.objects.create')
    def test_harvest_hep_data_pagination(self, mock_create, mock_get):
        mock_response_page_1 = MagicMock()
        mock_response_page_1.json.return_value = {
            'hits': {
                'hits': [
                    {
                        'metadata': {
                            'titles': [{'title': 'Test Title 1'}],
                            'abstracts': [{'value': 'Test Abstract 1'}],
                            'imprints': [{'date': '2024-10-01'}],
                            'arxiv_eprints': [{'categories': ['nucl-th'], 'value': '1234.5678'}]
                        }
                    }
                ]
            },
            'links': {'next': 'https://inspirehep.net/api/literature?page=2'}
        }
        mock_response_page_1.raise_for_status = MagicMock()

        mock_response_page_2 = MagicMock()
        mock_response_page_2.json.return_value = {
            'hits': {
                'hits': [
                    {
                        'metadata': {
                            'titles': [{'title': 'Test Title 2'}],
                            'abstracts': [{'value': 'Test Abstract 2'}],
                            'imprints': [{'date': '2024-10-02'}],
                            'arxiv_eprints': [{'categories': ['nucl-th'], 'value': '2345.6789'}]
                        }
                    }
                ]
            },
            'links': {'next': None}
        }
        mock_response_page_2.raise_for_status = MagicMock()
        mock_get.side_effect = [mock_response_page_1, mock_response_page_2]

        harvest_hep_data()

        self.assertEqual(mock_create.call_count, 2)
        mock_create.assert_any_call(
            title='Test Title 1',
            abstract='Test Abstract 1',
            publication_date=parse_publication_date('2024-10-01'),
            arxiv_id='nucl-th/1234.5678'
        )
        mock_create.assert_any_call(
            title='Test Title 2',
            abstract='Test Abstract 2',
            publication_date=parse_publication_date('2024-10-02'),
            arxiv_id='nucl-th/2345.6789'
        )
