from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Like
from .serializers import LikeSerializer
from .permissions import IsLikeOwnerOrReadOnly
from notes.models import Note


class LikeListCreateView(generics.ListCreateAPIView):
    """
    List all likes for a note or create a new like.
    Endpoint: /api/notes/<note_id>/likes/
    """
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        note_id = self.kwargs['note_id']
        return Like.objects.filter(note_id=note_id)

    def perform_create(self, serializer):
        note_id = self.kwargs['note_id']
        user = self.request.user
        print("Incoming Like Request:", self.request.data)
        print("User:", self.request.user.username)
        print("Note ID:", self.kwargs.get("note_id"))
        print("Incoming Like Request:", self.request.data)
        if Like.objects.filter(note_id=note_id, user=user).exists():
            raise ValidationError("You have already liked this note.")
        note = Note.objects.get(pk=note_id) 
        serializer.save(user=user, note=note)
    

class LikeDetailView(generics.RetrieveDestroyAPIView):
    """
    Retrieve or delete a specific like.
    Only the user who liked it can delete it.
    Endpoint: /api/likes/<pk>/
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated, IsLikeOwnerOrReadOnly]
