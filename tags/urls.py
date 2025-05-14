from django.urls import path
from .views import TagListCreateView, TagDetailView

urlpatterns = [
    path('', TagListCreateView.as_view(), name='tag-list-create'),  # /api/tags/
    path('<int:pk>/', TagDetailView.as_view(), name='tag-detail'),  # /api/tags/<id>/
]
