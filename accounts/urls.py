from django.urls import path
from .views import (
    HomePageView,
    DashboardView,
    CurrentUserView,
    CustomRegisterView,
    CustomLoginView,
    ChangePasswordView,
)

urlpatterns = [
    path('home/', HomePageView.as_view(), name='home'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('register/', CustomRegisterView.as_view(), name='custom-register'),
    path('login/', CustomLoginView.as_view(), name='custom-login'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
