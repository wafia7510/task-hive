from django.db import models
from django.contrib.auth.models import User
from notes.models import Note

class Comment(models.Model):
    """Model representing a comment made by a user on a note."""
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='comments')
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.commenter.username} - {self.content[:30]}"