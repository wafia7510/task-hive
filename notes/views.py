from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Note
from .serializers import NoteSerializer
from .permissions import IsOwnerOrReadOnly
from django.db.models import Q

# views_feed.py or in views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from follows.models import Follow


class FeedNotesView(APIView):
    """
    Get public notes from users who are mutual connections (follow each other).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Users you follow
        following_ids = Follow.objects.filter(follower=user).values_list('following_id', flat=True)

        # Users who follow you
        follower_ids = Follow.objects.filter(following=user).values_list('follower_id', flat=True)

        # Mutual followers: intersection of both sets
        mutual_ids = set(following_ids).intersection(set(follower_ids))

        # Get only public notes from mutual connections
        public_notes = Note.objects.filter(owner__id__in=mutual_ids, is_public=True).order_by('-created_at')

        serializer = NoteSerializer(public_notes, many=True, context={'request': request})
        return Response(serializer.data)


class NoteListCreateView(generics.ListCreateAPIView):
    """List all notes or create a new note. Filter and search by title and tag."""
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title']
    filterset_fields = ['tags']

    def get_queryset(self):
        #  Only return notes created by the logged-in user
        return Note.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a note. Only the owner can modify it."""
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)