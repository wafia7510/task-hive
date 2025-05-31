# accounts/tests.py

from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User


class AuthTests(APITestCase):
    def test_user_registration(self):
        """✅ Test user can register via dj-rest-auth"""
        url = reverse('rest_register')  # usually resolves to /dj-rest-auth/registration/
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password1': 'strongpassword123',
            'password2': 'strongpassword123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_user_login(self):
        """✅ Test login returns auth token (Token Auth)"""
        User.objects.create_user(username='testuser', password='pass123')
        url = reverse('rest_login')  # usually /dj-rest-auth/login/
        data = {
            'username': 'testuser',
            'password': 'pass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('key', response.data)  # Token Auth returns 'key'


    def test_user_logout(self):
        """✅ Test logout with token authentication"""
        User.objects.create_user(username='testuser', password='pass123')
        login_url = reverse('rest_login')
        logout_url = reverse('rest_logout')

        # Login to get token
        response = self.client.post(login_url, {
            'username': 'testuser',
            'password': 'pass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Get token key
        token = response.data.get('access') or response.data.get('key')  # JWT or Token

        # Add token to Authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Logout
        response = self.client.post(logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
