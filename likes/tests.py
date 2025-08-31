from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.test import TestCase

from likes.models import Like
from notes.models import Note


class LikeModelTest(TestCase):
    def setUp(self):
        # Create a test user and a note
        self.user = User.objects.create_user(username="testuser",
                                             password="pass123")
        self.note = Note.objects.create(
            owner=self.user, title="Test Note", content="Sample content"
        )

    def test_create_like(self):
        """✅ Test that a like is created successfully."""
        like = Like.objects.create(user=self.user, note=self.note)
        self.assertEqual(like.user, self.user)
        self.assertEqual(like.note, self.note)

    def test_unique_like(self):
        """✅ Test that the same user cannot like the same note twice."""
        Like.objects.create(user=self.user, note=self.note)
        with self.assertRaises(IntegrityError):
            Like.objects.create(user=self.user, note=self.note)

    def test_str_method(self):
        """✅ Test the __str__ method of Like model."""
        like = Like.objects.create(user=self.user, note=self.note)
        expected_str = f"{self.user.username} likes {self.note.title}"
        self.assertEqual(str(like), expected_str)
