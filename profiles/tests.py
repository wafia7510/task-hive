# profiles/tests.py

from django.test import TestCase
from django.contrib.auth.models import User
from profiles.models import Profile

class ProfileModelTest(TestCase):
    def test_profile_created_on_user_creation(self):
        # ✅ Create user and check profile is auto-created
        user = User.objects.create_user(username='testuser', password='testpass')
        profile = Profile.objects.get(user=user)

        self.assertIsNotNone(profile)
        self.assertEqual(profile.user, user)
        self.assertEqual(str(profile), "testuser's profile")

    def test_profile_fields_defaults(self):
        # ✅ Check default values on profile fields
        user = User.objects.create_user(username='john', password='doe1234')
        profile = Profile.objects.get(user=user)

        self.assertEqual(profile.bio, '')
        self.assertIsNone(profile.image.public_id if profile.image else None)
        self.assertIsNotNone(profile.created_at)
        self.assertIsNotNone(profile.updated_at)
