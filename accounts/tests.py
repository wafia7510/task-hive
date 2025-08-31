from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthTests(APITestCase):
    def test_user_registration(self):
        """✅ Test user can register via custom register view"""
        url = reverse("rest_register")
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password1": "strongpassword123",
            "password2": "strongpassword123",
        }
        response = self.client.post(url, data)
        print("RESPONSE DATA:", response.data)  # Optional debug
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_user_login(self):
        """✅ Test login returns auth token (Token or JWT)"""
        User.objects.create_user(username="testuser", password="pass123")
        url = reverse("rest_login")  # usually /dj-rest-auth/login/
        data = {"username": "testuser", "password": "pass123"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            "access" in response.data or "key" in response.data,
            msg=f"Expected 'access' or 'key' in response, got: {response.data}"
        )

    def test_user_logout(self):
        """✅ Test logout with token authentication"""
        User.objects.create_user(username="testuser", password="pass123")
        login_url = reverse("rest_login")
        logout_url = reverse("rest_logout")

        response = self.client.post(
            login_url, {"username": "testuser", "password": "pass123"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        token = response.data.get("access") or response.data.get("key")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.post(logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
