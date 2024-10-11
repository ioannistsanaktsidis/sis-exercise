from celery import shared_task
import requests
from .models import Literature
from datetime import datetime

THRESHOLD = 40

@shared_task
def harvest_hep_data():
    print("Running harvest_hep_data task")
    url = "https://inspirehep.net/api/literature"
    params = {
        'size': 10,
        'fields': 'titles,abstracts,imprints,arxiv_eprints',
    }
    literature_results = []
    next_url = url

    while next_url and len(literature_results) < THRESHOLD:
        try:
            print(f"Fetching data from: {next_url}")
            response = requests.get(next_url, params=params, verify=False)
            response.raise_for_status()

            data = response.json()
            literature_result = data.get('hits', {}).get('hits', [])
            literature_results.extend(literature_result)

            next_url = data.get('links', {}).get('next')
            params = {}

        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch data: {e}")
            # return Response({"error": "Failed to fetch data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValueError as e:
            print(f"Failed to fetch data: {e}")
            # return Response({"error": "Invalid JSON response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    for literature in literature_results:
            literature_data = literature.get('metadata', {})

            title = literature_data.get('titles', [{}])[0].get('title', '')
            abstract = literature_data.get('abstracts', [{}])[0].get('value', '')
            publication_date_str = literature_data.get('imprints', [{}])[0].get('date', '')
            print(f"Processing paper: {title} , {publication_date_str} , {abstract.strip()[:50]}...")
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
