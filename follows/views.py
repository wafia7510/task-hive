from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Follow
from .serializers import FollowUserSerializer

class FollowUserView(APIView):
    """
    POST: Follow a user.
    DELETE: Unfollow a user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        try:
            target_user = User.objects.get(username=username)
            if request.user == target_user:
                return Response({"detail": "You cannot follow yourself."}, status=400)
            Follow.objects.get_or_create(follower=request.user, following=target_user)
            return Response({"detail": f"You are now following {username}."}, status=201)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)

    def delete(self, request, username):
        try:
            target_user = User.objects.get(username=username)
            follow = Follow.objects.filter(follower=request.user, following=target_user)
            if follow.exists():
                follow.delete()
                return Response({"detail": f"You have unfollowed {username}."}, status=204)
            return Response({"detail": "You are not following this user."}, status=400)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)


class FollowerListView(generics.ListAPIView):
    """
    GET: List users who follow the given username.
    """
    serializer_class = FollowUserSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        user = User.objects.get(username=username)
        return User.objects.filter(following__following=user)


class FollowingListView(generics.ListAPIView):
    """
    GET: List users that the given username is following.
    """
    serializer_class = FollowUserSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        user = User.objects.get(username=username)
        return User.objects.filter(followers__follower=user)
