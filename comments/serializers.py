from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    commenter = serializers.ReadOnlyField(source='commenter.username')

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['commenter', 'created_at', 'note']  # ✅ Ensure 'note' is read-only
