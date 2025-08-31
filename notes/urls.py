from django.urls import path

from .views import FeedNotesView  # if placed separately
from .views import NoteDetailView, NoteListCreateView

urlpatterns = [
    path("", NoteListCreateView.as_view(), name="note-list-create"),
    path("<int:pk>/", NoteDetailView.as_view(), name="note-detail"),
    path("feed/", FeedNotesView.as_view(), name="note-feed"),  # 🔥 Add this
]
