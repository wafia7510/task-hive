from rest_framework import generics, permissions
from .models import Comment
from .serializers import CommentSerializer
from .permissions import IsCommentOwnerOrReadOnly

class CommentListCreateView(generics.ListCreateAPIView):
    """List all comments for a note or create a new comment."""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        note_id = self.kwargs['note_id']
        return Comment.objects.filter(note__id=note_id).order_by('created_at')

    def perform_create(self, serializer):
        note_id = self.kwargs['note_id']
        serializer.save(commenter=self.request.user, note_id=note_id)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific comment."""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCommentOwnerOrReadOnly]

    def get_queryset(self):
        return Comment.objects.all()