from rest_framework import generics, permissions
from .models import Tag
from .serializers import TagSerializer

class TagListCreateView(generics.ListCreateAPIView):
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TagDetailView(generics.RetrieveDestroyAPIView):  # Allow delete
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(owner=self.request.user)
