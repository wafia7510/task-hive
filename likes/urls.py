from django.urls import path
from .views import LikeListCreateView, LikeDetailView

urlpatterns = [
    path('note/<int:note_id>/', LikeListCreateView.as_view(), name='like-list-create'),
    path('<int:pk>/', LikeDetailView.as_view(), name='like-detail'),
]
