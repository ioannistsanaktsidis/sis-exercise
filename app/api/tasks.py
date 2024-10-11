from celery import shared_task
import requests
from .models import Literature
from datetime import datetime

@shared_task
def harvest_hep_data():
    print("Running harvest_hep_data task")
    url = "https://inspirehep.net/api/literature"
    params = {
        'size': 40,
        'sort': 'mostrecent'
    }
    response = requests.get(url, params=params, verify=False)

    if response.status_code == 200:
        literature_result = response.json().get('hits', {}).get('hits', [])
        for literature in literature_result:
            literature_data = literature.get('metadata', {})

            title = literature_data.get('titles', [{}])[0].get('title', '')

            abstract = literature_data.get('abstracts', [{}])[0].get('value', '')
            publication_date_str = literature_data.get('imprints', [{}])[0].get('date', '')

            try:
                publication_date = datetime.strptime(publication_date_str, "%Y-%m-%d").date()
            except (ValueError, TypeError):
                publication_date = None  # Set to None if conversion fails

            # Get the arxiv_id if available
            arxiv_id = ''
            if 'arxiv_eprints' in literature_data and literature_data['arxiv_eprints']:
                arxiv_eprint = literature_data['arxiv_eprints'][0]
                categories = arxiv_eprint.get('categories', [])
                value = arxiv_eprint.get('value', '')
                if categories and value:
                    arxiv_id = f"{categories[0]}/{value}"

            # Check conditions to skip ingestion
            if len(title) > 200:
                print(f"Skipping ingestion due to title length: '{title}' exceeds 200 characters.")
                continue

            if len(arxiv_id) > 50:
                print(f"Skipping ingestion of arxiv_id entry: '{arxiv_id}' is more than 50 characters.")
                arxiv_id = ''

            if title and abstract and publication_date:
                Literature.objects.create(
                    title=title,
                    abstract=abstract,
                    publication_date=publication_date,
                    arxiv_id=arxiv_id
                )
            else:
                print("Skipping Literature creation due to missing required fields.")
    else:
        print(f"Failed to fetch papers: {response.status_code}")
