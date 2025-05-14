from rest_framework import generics, permissions
from .models import Like
from .serializers import LikeSerializer
from .permissions import IsLikeOwnerOrReadOnly

class LikeListCreateView(generics.ListCreateAPIView):
    """List likes for a note or create a new like."""
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        note_id = self.kwargs['note_id']
        return Like.objects.filter(note_id=note_id)

    def perform_create(self, serializer):
        note_id = self.kwargs['note_id']
        serializer.save(user=self.request.user, note_id=note_id)

class LikeDetailView(generics.RetrieveDestroyAPIView):
    """Retrieve or delete a specific like."""
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated, IsLikeOwnerOrReadOnly]

    def get_queryset(self):
        return Like.objects.all()