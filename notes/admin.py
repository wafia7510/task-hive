from django.contrib import admin
from .models import Note

# Register the Note model in the admin panel for testing and management
admin.site.register(Note)
