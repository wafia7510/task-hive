from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password

# Import task/note models and serializers
from tasks.models import Task
from notes.models import Note
from tasks.serializers import TaskSerializer
from notes.serializers import NoteSerializer


class HomePageView(APIView):
    def get(self, request):
        return Response({"message": "Welcome to TaskHive!"})


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get the 5 most recent tasks and notes
        tasks = Task.objects.filter(owner=user).order_by('-created_at')[:5]
        notes = Note.objects.filter(owner=user).order_by('-created_at')[:5]

        task_data = TaskSerializer(tasks, many=True).data
        note_data = NoteSerializer(notes, many=True).data

        return Response({
            "message": f"Welcome to your dashboard, {user.first_name}!",
            "recent_tasks": task_data if task_data else "No tasks yet. Start by adding one!",
            "recent_notes": note_data if note_data else "No notes yet. Start capturing ideas!"
        })


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


class CustomRegisterView(APIView):
    """
    Custom registration view that accepts:
    - username, email, password, first_name, last_name
    Returns success message and token on registration.
    """
    def get(self, request):
        return Response({
            "message": "Send a POST request with username, email, password, first_name, and last_name to register."
        }, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if field not in data:
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=data['username']).exists():
            return Response({"error": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=data['username'],
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            password=make_password(data['password'])
        )
        Token.objects.create(user=user)
        return Response({"message": "Successfully registered! Please log in."}, status=status.HTTP_201_CREATED)


class CustomLoginView(APIView):
    """
    Custom login view:
    - GET: Informs user to send POST request
    - POST: Authenticates user and returns token
    """

    def get(self, request):
        return Response({
            "message": "Send a POST request with username and password to log in."
        }, status=status.HTTP_200_OK)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "message": f"Welcome, {user.first_name}!",
                "token": token.key,
                "username": user.username
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    Authenticated users can change their password using old and new password.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)


