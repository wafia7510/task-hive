from django.db.models import Count
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Profile
from .serializers import ProfileSerializer
from .permissions import IsOwnerOrReadOnly
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User


class ProfileListView(generics.ListAPIView):
    """
    List all profiles. Only authenticated users can see.
    """
    queryset = Profile.objects.all().order_by('-created_at')
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        return Profile.objects.exclude(user=self.request.user)
    
    def get_serializer_context(self):
        return {'request': self.request}


class ProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    GET: View a specific profile by ID.
    PUT: Update the profile (only if you are the owner).
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = 'id'  # e.g., /api/profiles/3/

    def get_serializer_context(self):
        return {'request': self.request}  # ✅ Add this


class MyProfileView(APIView):
    """
    GET: View your own profile.
    PUT: Update your own profile (bio, image).
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})  # ✅ fixed
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class ProfileByUsernameView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        username = self.kwargs['username']
        return get_object_or_404(Profile, user__username=username)

    def get_serializer_context(self):
        return {'request': self.request}
