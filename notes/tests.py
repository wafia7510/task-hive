# notes/tests.py

from django.test import TestCase
from django.contrib.auth.models import User
from notes.models import Note
from tags.models import Tag

class NoteModelTest(TestCase):
    def setUp(self):
        # ✅ Create a test user and assign it as the owner of the tag
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.tag = Tag.objects.create(name='Python', owner=self.user)  # ✅ Fixed: added owner

    def test_create_note(self):
        # ✅ Create a note with a tag
        note = Note.objects.create(
            owner=self.user,
            title='Test Note',
            content='This is a test note.',
            is_public=True
        )
        note.tags.add(self.tag)

        # ✅ Assert the note fields
        self.assertEqual(note.title, 'Test Note')
        self.assertEqual(note.content, 'This is a test note.')
        self.assertEqual(note.owner, self.user)
        self.assertTrue(note.is_public)
        self.assertIn(self.tag, note.tags.all())

    def test_str_method(self):
        # ✅ Check __str__ returns title
        note = Note.objects.create(
            owner=self.user,
            title='Readable Title',
            content='Some content.'
        )
        self.assertEqual(str(note), 'Readable Title')
