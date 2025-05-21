# likes/urls.py

from django.urls import path
from .views import LikeListCreateView, LikeDetailView

urlpatterns = [
    path('notes/<int:note_id>/likes/', LikeListCreateView.as_view(), name='like-list-create'),  # POST/GET
    path('<int:pk>/', LikeDetailView.as_view(), name='like-detail'),  # DELETE/GET
]
