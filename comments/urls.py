from django.urls import path
from .views import CommentListCreateView, CommentDetailView

urlpatterns = [
    # GET to list & POST to create comments for a specific note
    path('notes/<int:note_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),

    # DELETE (or GET if needed) a specific comment by ID
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
]
