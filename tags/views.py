from rest_framework import generics, permissions
from .models import Tag
from .serializers import TagSerializer


class TagListCreateView(generics.ListCreateAPIView):
    """
    List all tags or create a new one.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TagDetailView(generics.RetrieveAPIView):
    """
    Retrieve details of a specific tag by ID.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
