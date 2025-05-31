import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { axiosInstance } from '../api/axiosDefaults';
import PropTypes from 'prop-types';

const CommentsModal = ({ note, show, onHide }) => {
  // State to manage list of comments
  const [comments, setComments] = useState([]);
  // State for new comment input
  const [newComment, setNewComment] = useState('');
  // State to track which comment is being edited
  const [editingCommentId, setEditingCommentId] = useState(null);
  // State for content of the comment being edited
  const [editedCommentContent, setEditedCommentContent] = useState('');
  // Submission state for new comment
  const [submitting, setSubmitting] = useState(false);
  // Submission state for edited comment
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Fetch comments when modal is shown
  useEffect(() => {
    if (!note || !show) return;

    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Token ${token}` };
        const res = await axiosInstance.get(`/comments/note/${note.id}/`, { headers });
        setComments(res.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [note, show]);

  // Add a new comment
  const handleAddComment = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Token ${token}` };
      await axiosInstance.post(`/comments/note/${note.id}/`, { content: newComment }, { headers });
      setNewComment('');
      const res = await axiosInstance.get(`/comments/note/${note.id}/`, { headers });
      setComments(res.data);
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing a comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  // Save the edited comment
  const handleSaveCommentEdit = async () => {
    setSubmittingEdit(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Token ${token}` };
      await axiosInstance.put(`/comments/${editingCommentId}/`, { content: editedCommentContent }, { headers });
      const res = await axiosInstance.get(`/comments/note/${note.id}/`, { headers });
      setComments(res.data);
      setEditingCommentId(null);
      setEditedCommentContent('');
    } catch (err) {
      console.error('Error editing comment:', err);
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Delete a comment after confirmation
  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Token ${token}` };
      await axiosInstance.delete(`/comments/${commentId}/`, { headers });
      const res = await axiosInstance.get(`/comments/note/${note.id}/`, { headers });
      setComments(res.data);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  // Determine if current user can edit the comment
  const canEditComment = (comment) => {
    const username = localStorage.getItem('username');
    return comment.commenter === username;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="comments-modal-title"
      aria-describedby="comments-modal-body"
    >
      {/* Modal Header */}
      <Modal.Header closeButton aria-label="Close comments modal">
        <Modal.Title id="comments-modal-title">
          Comments on &quot;{note?.title}&quot;
        </Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body id="comments-modal-body">
        {/* Show note content */}
        <p><strong>Content:</strong> {note?.content}</p>
        <hr />

        {/* List of comments */}
        {comments.map((comment) => (
          <div key={comment.id} className="mb-2">
            <strong>{comment.commenter}</strong>{' '}
            <small className="text-muted">
              ({new Date(comment.created_at).toLocaleString()})
            </small>

            {/* Editing input for a comment */}
            {editingCommentId === comment.id ? (
              <>
                <Form.Control
                  type="text"
                  className="mt-2"
                  value={editedCommentContent}
                  onChange={(e) => setEditedCommentContent(e.target.value)}
                  aria-label="Edit comment input"
                />
                <Button
                  size="sm"
                  className="mt-1 me-2"
                  onClick={handleSaveCommentEdit}
                  disabled={submittingEdit}
                  aria-label="Save edited comment"
                >
                  {submittingEdit ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
                <Button
                  size="sm"
                  className="mt-1"
                  variant="secondary"
                  onClick={() => setEditingCommentId(null)}
                  aria-label="Cancel editing comment"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <p className="mb-1">{comment.content}</p>
            )}

            {/* Edit/Delete buttons for authorized user */}
            {canEditComment(comment) && editingCommentId !== comment.id && (
              <div className="d-flex gap-2 mt-1">
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => handleEditComment(comment)}
                  aria-label="Edit comment"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleDeleteComment(comment.id)}
                  aria-label="Delete comment"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}

        {/* Form to add a new comment */}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddComment();
          }}
        >
          <Form.Group className="mt-2">
            <Form.Label htmlFor="new-comment-input">Add a Comment</Form.Label>
            <Form.Control
              id="new-comment-input"
              type="text"
              placeholder="Type your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              aria-label="New comment input"
            />
          </Form.Group>
          <Button type="submit" className="mt-2" disabled={submitting} aria-label="Post comment">
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

CommentsModal.propTypes = {
  note: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default CommentsModal;
