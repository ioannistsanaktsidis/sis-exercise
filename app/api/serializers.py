from rest_framework import serializers

from api.models import Literature
from datetime import datetime


class DateWithoutTimezoneField(serializers.DateField):
    def to_representation(self, value):
        if isinstance(value, datetime):
            value = value.date()
        return super().to_representation(value)

class LiteratureSerializer(serializers.Serializer):

    title = serializers.CharField()
    abstract = serializers.CharField()
    publication_date = DateWithoutTimezoneField(read_only=True)

    class Meta:
        fields = (
            "title",
            "abstract",
            "publication_date",
        )
