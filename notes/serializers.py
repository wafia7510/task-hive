from rest_framework import serializers
from .models import Note
from tags.models import Tag

class NoteSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Tag.objects.all()
    )
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = '__all__'

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_comment_count(self, obj):
        return obj.comments.count()