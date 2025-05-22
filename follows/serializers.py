from rest_framework import serializers
from django.contrib.auth.models import User
from profiles.models import Profile  # Adjust import if necessary

class FollowUserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(source='profile.image', read_only=True)
    followed_back = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'image', 'followed_back']  # username is native, don't use source='user.username'

    def get_followed_back(self, obj):
        request_user = self.context.get('request').user
        if request_user and request_user.is_authenticated:
            return obj.followers.filter(follower=request_user).exists()
        return False
