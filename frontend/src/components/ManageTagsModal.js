import React, { useState } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { axiosInstance } from '../api/axiosDefaults';
import PropTypes from 'prop-types';

const ManageTagsModal = ({ show, onHide, tags, setTags, notes, setNotes }) => {
  // States for tag management
  const [tagInput, setTagInput] = useState('');
  const [filter, setFilter] = useState('');
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Token ${token}` };

  // Add a new tag
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return;

    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/tags/', { name: tagInput }, { headers });
      setTags(prev => [...prev, res.data]);
      setTagInput('');
    } catch (err) {
      console.error('Failed to add tag:', err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a tag
  const handleDeleteTag = async (tagId, tagName) => {
    const tagInUse = notes.some(note => note.tags.includes(tagName));
    if (tagInUse) {
      alert('Cannot delete tag that is used in notes.');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the tag "${tagName}"?`);
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/tags/${tagId}/`, { headers });
      setTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (err) {
      console.error('Failed to delete tag:', err.response?.data || err.message);
    }
  };

  // Start editing
  const handleEditTag = (tag) => {
    setEditTagId(tag.id);
    setEditTagName(tag.name);
  };

  // Save edited tag and update notes
  const handleSaveEdit = async () => {
    if (!editTagName.trim()) return;

    setSubmittingEdit(true);
    try {
      // Find the original tag name
      const originalTag = tags.find(tag => tag.id === editTagId);
      const oldName = originalTag?.name;

      // Update the tag on the backend
      const response = await axiosInstance.put(`/tags/${editTagId}/`, { name: editTagName }, { headers });

      // Update tags state
      setTags(prev => prev.map(tag => tag.id === editTagId ? response.data : tag));

      // ✅ Update notes using the old tag name
      setNotes(prevNotes =>
        prevNotes.map(note => ({
          ...note,
          tags: note.tags.map(t => (t === oldName ? editTagName : t))
        }))
      );

      // Reset UI
      setEditTagId(null);
      setEditTagName('');
    } catch (err) {
      console.error('Failed to edit tag:', err.response?.data || err.message);
    } finally {
      setSubmittingEdit(false);
    }
};


  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Manage Tags</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Add New Tag */}
        <Form onSubmit={handleAddTag}>
          <Form.Group>
            <Form.Label>Add New Tag</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter tag name"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  'Add'
                )}
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>

        <hr />

        {/* Filter/Search Tags */}
        <Form.Group className="mb-3">
          <Form.Label>Filter Tags</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Form.Group>

        {/* Display Tags */}
        {filteredTags.length === 0 ? (
          <p>No tags found.</p>
        ) : (
          filteredTags.map(tag => (
            <div
              key={tag.id}
              className="d-flex justify-content-between align-items-center mb-2"
            >
              {editTagId === tag.id ? (
                <>
                  <Form.Control
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                    className="me-2"
                  />
                  <Button
                    size="sm"
                    variant="success"
                    onClick={handleSaveEdit}
                    disabled={submittingEdit}
                  >
                    {submittingEdit ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditTagId(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span>{tag.name}</span>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => handleEditTag(tag)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteTag(tag.id, tag.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </Modal.Body>
    </Modal>
  );
};

// ✅ Prop Types
ManageTagsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  setTags: PropTypes.func.isRequired,
  notes: PropTypes.array.isRequired,
  setNotes: PropTypes.func.isRequired, // ✅ added
};

export default ManageTagsModal;
