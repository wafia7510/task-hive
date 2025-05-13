from django.urls import path
from .views import HomePageView, DashboardView, CurrentUserView

urlpatterns = [
    path('home/', HomePageView.as_view(), name='home'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]
