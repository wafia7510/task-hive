from django.urls import path
from .views import CommentListCreateView, CommentDetailView

urlpatterns = [
    # GET to list & POST to create comments for a specific note
    path('note/<int:note_id>/', CommentListCreateView.as_view(), name='comment-list-create'),

    # Retrieve/update/delete individual comment
    path('<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
]
