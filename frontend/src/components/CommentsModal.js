
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { axiosInstance } from '../api/axiosDefaults';

const CommentsModal = ({ note, show, onHide }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');

  useEffect(() => {
    if (!note || !show) return;

    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Token ${token}` };
        const res = await axiosInstance.get(`/api/notes/${note.id}/comments/`, { headers });
        setComments(res.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [note, show]);

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Token ${token}` };
      await axiosInstance.post(`/api/notes/${note.id}/comments/`, { content: newComment }, { headers });
      setNewComment('');
      const res = await axiosInstance.get(`/api/notes/${note.id}/comments/`, { headers });
      setComments(res.data);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  const handleSaveCommentEdit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Token ${token}` };
      await axiosInstance.put(`/api/comments/${editingCommentId}/`, { content: editedCommentContent }, { headers });
      const res = await axiosInstance.get(`/api/notes/${note.id}/comments/`, { headers });
      setComments(res.data);
      setEditingCommentId(null);
      setEditedCommentContent('');
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Token ${token}` };
      await axiosInstance.delete(`/api/comments/${commentId}/`, { headers });
      const res = await axiosInstance.get(`/api/notes/${note.id}/comments/`, { headers });
      setComments(res.data);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const canEditComment = (comment) => {
    const username = localStorage.getItem('username');
    return comment.commenter === username || note.owner === username;
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Comments on "{note?.title}"</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Content:</strong> {note?.content}</p>
        <hr />
        {comments.map((comment) => (
          <div key={comment.id} className="mb-2">
            <strong>{comment.commenter}</strong>{' '}
            <small className="text-muted">({new Date(comment.created_at).toLocaleString()})</small>
            {editingCommentId === comment.id ? (
              <>
                <Form.Control
                  type="text"
                  className="mt-2"
                  value={editedCommentContent}
                  onChange={(e) => setEditedCommentContent(e.target.value)}
                />
                <Button size="sm" className="mt-1 me-2" onClick={handleSaveCommentEdit}>Save</Button>
                <Button size="sm" className="mt-1" variant="secondary" onClick={() => setEditingCommentId(null)}>Cancel</Button>
              </>
            ) : (
              <p className="mb-1">{comment.content}</p>
            )}
            {canEditComment(comment) && editingCommentId !== comment.id && (
              <div className="d-flex gap-2 mt-1">
                <Button size="sm" variant="outline-secondary" onClick={() => handleEditComment(comment)}>Edit</Button>
                <Button size="sm" variant="outline-danger" onClick={() => handleDeleteComment(comment.id)}>Delete</Button>
              </div>
            )}
          </div>
        ))}

        <Form onSubmit={(e) => { e.preventDefault(); handleAddComment(); }}>
          <Form.Group className="mt-2">
            <Form.Label>Add a Comment</Form.Label>
            <Form.Control
              type="text"
              placeholder="Type your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="mt-2">Post</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CommentsModal;
