
import React, { useState } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { axiosInstance } from '../api/axiosDefaults';

const ManageTagsModal = ({ show, onHide, tags, setTags, notes }) => {
  const [tagInput, setTagInput] = useState('');
  const [filter, setFilter] = useState('');
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState('');

  const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Token ${token}` };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return;

    try {
      const res = await axiosInstance.post('/api/tags/', { name: tagInput }, { headers });
      setTags(prev => [...prev, res.data]);
      setTagInput('');
    } catch (err) {
      console.error('Failed to add tag:', err.response?.data || err.message);
    }
  };

  const handleDeleteTag = async (tagId, tagName) => {
    const tagInUse = notes.some(note => note.tags.includes(tagName));
    if (tagInUse) {
      alert('Cannot delete tag that is used in notes.');
      return;
    }

    try {
      await axiosInstance.delete(`/api/tags/${tagId}/`, { headers });
      setTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (err) {
      console.error('Failed to delete tag:', err.response?.data || err.message);
    }
  };

  const handleEditTag = (tag) => {
    setEditTagId(tag.id);
    setEditTagName(tag.name);
  };

  const handleSaveEdit = async () => {
    try {
      await axiosInstance.put(`/api/tags/${editTagId}/`, { name: editTagName }, { headers });
      setTags(prev => prev.map(tag => tag.id === editTagId ? { ...tag, name: editTagName } : tag));
      setEditTagId(null);
      setEditTagName('');
    } catch (err) {
      console.error('Failed to edit tag:', err.response?.data || err.message);
    }
  };

  const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Manage Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
              <Button type="submit" variant="primary">Add</Button>
            </InputGroup>
          </Form.Group>
        </Form>

        <hr />

        <Form.Group className="mb-3">
          <Form.Label>Filter Tags</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Form.Group>

        {filteredTags.length === 0 ? (
          <p>No tags found.</p>
        ) : (
          filteredTags.map(tag => (
            <div key={tag.id} className="d-flex justify-content-between align-items-center mb-2">
              {editTagId === tag.id ? (
                <>
                  <Form.Control
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                    className="me-2"
                  />
                  <Button size="sm" variant="success" onClick={handleSaveEdit}>Save</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditTagId(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <span>{tag.name}</span>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-secondary" onClick={() => handleEditTag(tag)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteTag(tag.id, tag.name)}>Delete</Button>
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

export default ManageTagsModal;
