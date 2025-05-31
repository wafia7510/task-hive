# comments/tests.py

from django.test import TestCase
from django.contrib.auth.models import User
from notes.models import Note
from comments.models import Comment

class CommentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.note = Note.objects.create(owner=self.user, title='Test Note', content='Note content.')

    def test_create_comment(self):
        comment = Comment.objects.create(
            note=self.note,
            commenter=self.user,
            content='A comment on the note.'
        )
        self.assertEqual(comment.content, 'A comment on the note.')
        self.assertEqual(comment.commenter, self.user)
        self.assertEqual(comment.note, self.note)

    def test_comment_str_method(self):
        long_content = 'A detailed comment on a note from testuser.'
        comment = Comment.objects.create(
            note=self.note,
            commenter=self.user,
            content=long_content
        )
        expected_str = f"{self.user.username} - {long_content[:30]}"
        self.assertEqual(str(comment), expected_str)
