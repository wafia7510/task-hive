from django.urls import path
from .views import FollowUserView, FollowerListView, FollowingListView

urlpatterns = [
    path('<str:username>/', FollowUserView.as_view(), name='follow-user'),
    path('<str:username>/followers/', FollowerListView.as_view(), name='follower-list'),
    path('<str:username>/following/', FollowingListView.as_view(), name='following-list'),
]
