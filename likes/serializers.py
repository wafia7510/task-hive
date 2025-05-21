from rest_framework import serializers
from .models import Like


class LikeSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    note = serializers.ReadOnlyField(source='note.id')  # ✅ Add this line

    class Meta:
        model = Like
        fields = '__all__'
        read_only_fields = ['user', 'note', 'created_at']  # ✅ note added here