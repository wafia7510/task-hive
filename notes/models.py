from django.db import models
from django.contrib.auth.models import User
from tags.models import Tag  # Import Tag model


class Note(models.Model):
    """Note model stores study-related notes created by users."""
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag, related_name='notes', blank=True)  # Tag relationship
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.title
