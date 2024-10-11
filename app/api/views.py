from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.http import HttpResponse

from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import (
    OrderingFilterBackend,
    DefaultOrderingFilterBackend,
    SearchFilterBackend,
)
from elasticsearch_dsl import Q

from api.serializers import LiteratureSerializer
from api.documents import LiteratureDocument
from api.models import Literature
from api.tasks import harvest_hep_data
from sis_exercise.exceptions import InvalidInputError, InternalServerError
from sis_exercise.views import ElasticSearchAPIView


def mock_openai_summarize(text):
    return "This is a summary of the provided search results."

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

class SearchView(ElasticSearchAPIView):
    serializer_class = LiteratureSerializer
    document_class = LiteratureDocument


    def _generate_summary(self, results):
        if not results:
            return ""

        concatenated_text = " ".join(
            f"{result['title']}{result['abstract']}" for result in results
        )

        return mock_openai_summarize(concatenated_text)

    def elasticsearch_query_expression(self, query):
        return Q("multi_match", query=query, fields=["title"])

    def get(self, request, *args, **kwargs):
        try:
            response = super().get(request, *args, **kwargs)

            if response.status_code == status.HTTP_200_OK:
                data = response.data
                summary = self._generate_summary(data["results"])

                return Response({
                    "total": data["total"],
                    "results": data["results"],
                    "summary": summary,
                }, status=status.HTTP_200_OK)
            elif response.status_code == status.HTTP_400_BAD_REQUEST:
                raise InvalidInputError(f"Error during fetching data: {response.data}")
            else:
                raise InternalServerError(f"Error during fetching data: {response.data}")
        except InvalidInputError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except InternalServerError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {"error": f"Error during fetching data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# View to trigger the task manually
@api_view(['GET'])
def trigger_task(request):
    harvest_hep_data.delay()
    return Response({'status': 'Task triggered'}, status=status.HTTP_200_OK)
