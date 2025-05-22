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
from .models import Note
from follows.models import Follow
from .serializers import NoteSerializer


class FeedNotesView(APIView):
    """
    Get public notes from users the current user follows or is followed by.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        following_ids = Follow.objects.filter(follower=user).values_list('following_id', flat=True)
        follower_ids = Follow.objects.filter(following=user).values_list('follower_id', flat=True)
        related_user_ids = set(following_ids).union(set(follower_ids))

        public_notes = Note.objects.filter(owner__id__in=related_user_ids, is_public=True).order_by('-created_at')

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
        user = self.request.user
        return Note.objects.filter(Q(owner=user) | Q(is_public=True)).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a note. Only the owner can modify it."""
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)