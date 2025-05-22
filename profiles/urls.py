from django.urls import path
from .views import ProfileListView, ProfileDetailView, MyProfileView, ProfileByUsernameView

urlpatterns = [
    path('', ProfileListView.as_view(), name='profile-list'),
    path('me/', MyProfileView.as_view(), name='profile-me'),
    path('username/<str:username>/', ProfileByUsernameView.as_view(), name='profile-by-username'),  # ✅ New route
    path('<int:id>/', ProfileDetailView.as_view(), name='profile-detail'),
]
