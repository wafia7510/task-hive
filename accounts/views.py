from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer

# ✅ This view forces Django to use your custom serializer
class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        })




