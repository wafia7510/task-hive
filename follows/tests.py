from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.test import TestCase

from follows.models import Follow


class FollowModelTest(TestCase):
    def setUp(self):
        # Create two users
        self.user1 = User.objects.create_user(username="user1",
                                              password="pass123")
        self.user2 = User.objects.create_user(username="user2",
                                              password="pass123")

    def test_create_follow(self):
        """✅ Test that a follow relationship is created successfully."""
        follow = Follow.objects.create(follower=self.user1,
                                       following=self.user2)
        self.assertEqual(follow.follower, self.user1)
        self.assertEqual(follow.following, self.user2)

    def test_unique_follow_relationship(self):
        """✅ Test that duplicate follow relationships are not allowed."""
        Follow.objects.create(follower=self.user1, following=self.user2)
        with self.assertRaises(IntegrityError):
            Follow.objects.create(follower=self.user1, following=self.user2)

    def test_str_method(self):
        """✅ Test the __str__ output of the Follow model."""
        follow = Follow.objects.create(follower=self.user1,
                                       following=self.user2)
        expected_str = f"{self.user1.username} follows {self.user2.username}"
        self.assertEqual(str(follow), expected_str)
