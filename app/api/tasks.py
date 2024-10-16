import requests
from celery import shared_task
from datetime import datetime
from .models import Literature

URL = "https://inspirehep.net/api/literature"
THRESHOLD = 40

def calculate_arxiv_id(literature_data):
    arxiv_id = ''
    if 'arxiv_eprints' in literature_data and literature_data['arxiv_eprints']:
        arxiv_eprint = literature_data['arxiv_eprints'][0]
        categories = arxiv_eprint.get('categories', [])
        value = arxiv_eprint.get('value', '')
        if categories and value:
            arxiv_id = f"{categories[0]}/{value}"
    return arxiv_id

def parse_publication_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None

@shared_task
def harvest_hep_data():
    print("Starting HEP data harvesting task...")
    literature_results = []
    next_url = URL
    params = {
        'sort': 'mostrecent',
        'size': 10,
        'fields': 'titles,abstracts,imprints,arxiv_eprints',
    }

    while next_url and len(literature_results) < THRESHOLD:
        try:
            response = requests.get(next_url, params=params, verify=False)
            response.raise_for_status()

            data = response.json()
            literature_result = data.get('hits', {}).get('hits', [])
            literature_results.extend(literature_result)

            next_url = data.get('links', {}).get('next')
            params = {}
        except Exception as e:
            print(f"Failed to fetch data: {e}")
            break

    for literature in literature_results:
            literature_data = literature.get('metadata', {})
            control_number = literature_data.get('control_number', '')
            abstract = literature_data.get('abstracts', [{}])[0].get('value', '')
            title = literature_data.get('titles', [{}])[0].get('title', '')
            publication_date_str = literature_data.get('imprints', [{}])[0].get('date', '')

            publication_date = parse_publication_date(publication_date_str)
            arxiv_id = calculate_arxiv_id(literature_data)

            if len(title) > 200:
                print(f"Skipping ingestion of {control_number} due to title length: '{title}' exceeds 200 characters.")
                continue

            if len(arxiv_id) > 50:
                arxiv_id = ''

            if title and abstract and publication_date:
                Literature.objects.create(
                    title=title,
                    abstract=abstract,
                    publication_date=publication_date,
                    arxiv_id=arxiv_id
                )
            else:
                print(f"Skipping Literature creation for {control_number} due to missing required fields.")
