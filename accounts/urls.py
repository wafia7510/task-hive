from django.urls import path
from .views import CurrentUserView, CustomRegisterView
    
urlpatterns = [
    
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('register/', CustomRegisterView.as_view(), name='rest_register')
    
]
