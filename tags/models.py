from django.db import models
from django.contrib.auth.models import User

class Tag(models.Model):
    """
    Each tag is owned by a specific user.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tags')
    name = models.CharField(max_length=50)

    class Meta:
        unique_together = ('owner', 'name')  # Same name can exist for different users

    def __str__(self):
        return self.name
