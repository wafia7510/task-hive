from rest_framework import serializers
from django.contrib.auth.models import User
from profiles.models import Profile  # Update if your profile app name is different

class FollowUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    image = serializers.ImageField(source='profile.image', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'image']
