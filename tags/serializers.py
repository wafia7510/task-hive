from rest_framework import serializers
from .models import Tag

class TagSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Tag
        fields = ['id', 'name', 'owner']
