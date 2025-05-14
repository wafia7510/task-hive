from django.db import models


class Tag(models.Model):
    """
    Tag model stores keywords or labels for organizing notes.
    Tags can be reused across multiple notes.
    """
    name = models.CharField(max_length=50, unique=True)  # Tag name must be unique

    def __str__(self):
        return self.name
