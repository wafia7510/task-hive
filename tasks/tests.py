"""from django.test import TestCase"""

from datetime import timedelta

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Task


class TaskAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass123")
        self.other_user = User.objects.create_user(
            username="otheruser", password="pass456"
        )
        self.client.login(username="testuser", password="pass123")

    def test_create_task(self):
        """✅ Test task creation by authenticated user"""
        response = self.client.post(
            "/api/tasks/",
            {
                "title": "Test Task",
                "description": "Testing...",
                "priority": "high",
                "status": "todo",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.get().title, "Test Task")

    def test_list_tasks(self):
        """✅ Test listing tasks returns only user's tasks"""
        Task.objects.create(owner=self.user, title="My Task")
        Task.objects.create(owner=self.other_user, title="Other Task")
        response = self.client.get("/api/tasks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "My Task")

    def test_update_task(self):
        """✅ Test that a user can update their own task"""
        task = Task.objects.create(owner=self.user, title="Original", status="todo")
        response = self.client.put(
            f"/api/tasks/{task.id}/",
            {
                "title": "Updated",
                "description": "",
                "status": "done",
                "priority": "medium",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertEqual(task.title, "Updated")
        self.assertEqual(task.status, "done")

    def test_delete_task(self):
        """✅ Test that a user can delete their own task"""
        task = Task.objects.create(owner=self.user, title="To delete")
        response = self.client.delete(f"/api/tasks/{task.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=task.id).exists())

    def test_cannot_edit_others_task(self):
        """🚫 Test that a user cannot edit someone else’s task"""
        task = Task.objects.create(owner=self.other_user, title="Other Task")
        response = self.client.put(
            f"/api/tasks/{task.id}/",
            {
                "title": "Hacked",
                "description": "",
                "status": "done",
                "priority": "high",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_is_overdue_method(self):
        """✅ Test is_overdue logic"""
        today = timezone.now().date()
        overdue_task = Task.objects.create(
            owner=self.user, title="Late", due_date=today - timedelta(days=1)
        )
        upcoming_task = Task.objects.create(
            owner=self.user, title="Upcoming", due_date=today + timedelta(days=1)
        )
        self.assertTrue(overdue_task.is_overdue())
        self.assertFalse(upcoming_task.is_overdue())
