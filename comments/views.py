from rest_framework import generics, permissions
from .models import Comment
from .serializers import CommentSerializer
from .permissions import IsCommentOwnerOrReadOnly


class CommentListCreateView(generics.ListCreateAPIView):
    """
    List all comments for a note or create a new comment.
    - Endpoint: /api/notes/<note_id>/comments/
    - Authenticated users can post comments.
    - Comments are sorted by creation date (oldest first).
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        note_id = self.kwargs['note_id']
        return Comment.objects.filter(note__id=note_id).order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(
            commenter=self.request.user,
            note_id=self.kwargs['note_id']
        )


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve or delete a comment.
    - Only the comment owner can delete.
    - No update/edit functionality to keep discussions consistent.
    - Endpoint: /api/comments/<pk>/
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCommentOwnerOrReadOnly]
