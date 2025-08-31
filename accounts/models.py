from cloudinary.models import CloudinaryField
from django.db import models


class TestUpload(models.Model):
    name = models.CharField(max_length=100)
    image = CloudinaryField("image")

    def __str__(self):
        return self.name
