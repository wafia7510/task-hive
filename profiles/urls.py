from django.urls import path
from .views import ProfileListView, ProfileDetailView, MyProfileView

urlpatterns = [
    path('', ProfileListView.as_view(), name='profile-list'),
    path('<int:id>/', ProfileDetailView.as_view(), name='profile-detail'),
    path('me/', MyProfileView.as_view(), name='profile-me'),
]
