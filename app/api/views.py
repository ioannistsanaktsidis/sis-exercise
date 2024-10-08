from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import HttpResponse
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    OrderingFilterBackend,
    DefaultOrderingFilterBackend,
    SearchFilterBackend,
)

from api.serializers import LiteratureSerializer
from api.documents import LiteratureDocument
from api.models import Literature
# from api.tasks import fetch_inspirehep_data

class LiteratureDocumentViewSet(DocumentViewSet):
    document = LiteratureDocument
    serializer_class = LiteratureSerializer
    lookup_field = "id"
    filter_backends = []
    ordering = ("_score",)
    filter_backends = [
        OrderingFilterBackend,
        DefaultOrderingFilterBackend,
        SearchFilterBackend,
    ]
    search_fields = ("title",)

    ordering_fields = {
        "id": "id",
        "title": "title.raw",
        "publication_date": "publication_date",
    }


# def clean_html_tags(text):
#     """Remove HTML tags from a string."""
#     clean = re.compile('<.*?>')  # Regular expression to match any HTML tags
#     return re.sub(clean, '', text)  # Replace HTML tags with an empty string

# def trigger_task(request):
#     url = "https://inspirehep.net/api/literature"
#     params = {
#         'size': 40,
#         'sort': 'mostrecent'
#     }
#     response = requests.get(url, params=params, verify=False)

#     if response.status_code == 200:
#         literature_result = response.json().get('hits', {}).get('hits', [])
#         for literature in literature_result:
#             literature_data = literature.get('metadata', {})

#             title = literature_data.get('titles', [{}])[0].get('title', '')
#             # title = clean_html_tags(title)  # Clean HTML tags from title

#             abstract = literature_data.get('abstracts', [{}])[0].get('value', '')
#             publication_date_str = literature_data.get('imprints', [{}])[0].get('date', '')

#             try:
#                 publication_date = datetime.strptime(publication_date_str, "%Y-%m-%d").date()
#             except (ValueError, TypeError):
#                 publication_date = None  # Set to None if conversion fails

#             # Get the arxiv_id if available
#             arxiv_id = ''
#             if 'arxiv_eprints' in literature_data and literature_data['arxiv_eprints']:
#                 arxiv_eprint = literature_data['arxiv_eprints'][0]
#                 categories = arxiv_eprint.get('categories', [])
#                 value = arxiv_eprint.get('value', '')
#                 if categories and value:
#                     arxiv_id = f"{categories[0]}/{value}"

#             # Check conditions to skip ingestion
#             if len(title) > 200:
#                 print(f"Skipping ingestion due to title length: '{title}' exceeds 200 characters.")
#                 continue

#             if len(arxiv_id) > 50:
#                 print(f"Skipping ingestion due to arxiv_id length: '{arxiv_id}' is more than 50 characters.")
#                 arxiv_id = ''

#             if title and abstract and publication_date:
#                 Literature.objects.create(
#                     title=title,
#                     abstract=abstract,
#                     publication_date=publication_date,
#                     arxiv_id=arxiv_id
#                 )
#             else:
#                 print("Skipping Literature creation due to missing required fields.")
#     else:
#         # Handle error
#         print(f"Failed to fetch papers: {response.status_code}")

#     return HttpResponse('Task triggered successfully!', status=200)
