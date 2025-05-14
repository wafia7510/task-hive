from django.db import models
from django.contrib.auth.models import User
from notes.models import Note

class Like(models.Model):
    """Model representing a like on a note by a user."""
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('note', 'user')  # Prevent duplicate likes from the same user

    def __str__(self):
        return f"{self.user.username} likes {self.note.title}"