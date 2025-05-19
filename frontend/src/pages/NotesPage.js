// NotesPage.js - With Add/Edit Note Modals + Tag Management
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import NavBar from '../components/NavBar';
import CreatableSelect from 'react-select/creatable';
import notesBanner from '../assets/notes_banner.jpg';
import styles from '../styles/NotesPage.module.css';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchNotesAndTags();
  }, [navigate]);

  const fetchNotesAndTags = async () => {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };
    try {
      const [notesRes, tagsRes] = await Promise.all([
        axiosInstance.get('/api/notes/', { headers }),
        axiosInstance.get('/api/tags/', { headers }),
      ]);
      setNotes(notesRes.data);
      setTags(tagsRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error fetching notes or tags');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setSelectedTags([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };
    const tagNames = selectedTags.map(tag => tag.value);
    const existingTagNames = tags.map(tag => tag.name);
    const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));

    try {
      for (const name of newTagNames) {
        await axiosInstance.post('/api/tags/', { name }, { headers });
      }
    } catch (err) {
      console.error('Error creating new tags:', err);
      setError('Error saving new tags');
      return;
    }

    try {
      if (editingId) {
        await axiosInstance.put(`/api/notes/${editingId}/`, {
          ...formData,
          tags: tagNames,
        }, { headers });
        setSuccess('Note updated successfully.');
        setShowEditModal(false);
      } else {
        await axiosInstance.post('/api/notes/', {
          ...formData,
          tags: tagNames,
        }, { headers });
        setSuccess('Note created successfully.');
        setShowAddModal(false);
      }

      resetForm();
      setError('');
      fetchNotesAndTags();
    } catch (err) {
      console.error('Submit error:', err);
      setError('Error saving note.');
      setSuccess('');
    }
  };

  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content });
    setSelectedTags(note.tags.map(tag => ({ value: tag, label: tag })));
    setEditingId(note.id);
    setShowEditModal(true);
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };
    try {
      await axiosInstance.delete(`/api/notes/${id}/`, { headers });
      setSuccess('Note deleted.');
      fetchNotesAndTags();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error deleting note.');
    }
  };

  const handleDeleteTag = async (tagName) => {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };
    const tagInUse = notes.some(note => note.tags.includes(tagName));
    if (tagInUse) {
      alert('Cannot delete a tag that is being used in notes.');
      return;
    }
    try {
      const tag = tags.find(t => t.name === tagName);
      if (tag) {
        await axiosInstance.delete(`/api/tags/${tag.id}/`, { headers });
        setTags(prev => prev.filter(t => t.id !== tag.id));
      }
    } catch (err) {
      console.error('Tag delete error:', err);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesTitle = note.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !filterTag || note.tags.includes(filterTag);
    return matchesTitle && matchesTag;
  });

  return (
    <>
      <NavBar />

      <div className={styles.banner}>
        <img src={notesBanner} alt="Notes Banner" className={styles.bannerImage} />
        <div className={styles.bannerText}>
          <h3>Welcome to Your Notes</h3>
          <p>Use this page to create, tag, edit, delete, and filter your study notes by topic.</p>
        </div>
      </div>

      <Container className="mt-4">
        <h2 className={styles.notesHeading}>Manage Notes</h2>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-flex justify-content-end mb-3 gap-2">
          <Button variant="info" onClick={() => setShowTagModal(true)}>Manage Tags</Button>
          <Button onClick={() => { resetForm(); setShowAddModal(true); }}>+ Add Note</Button>
        </div>

        <Form.Control
          type="text"
          placeholder="Search by title..."
          className="mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {tags.length > 0 && (
          <div className="mb-3">
            <strong>Filter by tag:</strong>{' '}
            {tags.map(tag => (
              <Badge
                key={tag.name}
                bg={filterTag === tag.name ? 'primary' : 'secondary'}
                onClick={() => setFilterTag(tag.name === filterTag ? null : tag.name)}
                style={{ cursor: 'pointer', marginRight: '0.4rem' }}
              >
                {tag.name}
              </Badge>
            ))}
            {filterTag && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setFilterTag(null)}
                className="ms-2"
              >
                Clear Filter
              </Button>
            )}
          </div>
        )}

        {filteredNotes.length === 0 ? (
          <p>No matching notes found.</p>
        ) : (
          <Row>
            {filteredNotes.map(note => (
              <Col md={6} lg={4} key={note.id} className="mb-4">
                <Card className={`shadow-sm h-100 ${styles.cardNote}`}>
                  <Card.Body>
                    <Card.Title className={styles.cardTitle}>{note.title}</Card.Title>
                    <Card.Text className={styles.cardText}>
                      {note.content.length > 100 ? note.content.slice(0, 100) + '...' : note.content}
                    </Card.Text>
                    <div className="mb-2">
                      {note.tags.map(tag => (
                        <Badge
                          key={tag}
                          bg="info"
                          className={styles.tagBadge}
                          onClick={() => setFilterTag(tag)}
                          style={{ cursor: 'pointer' }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(note)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(note.id)}>Delete</Button>
                    </div>
                  </Card.Body>
                  <Card.Footer className={styles.cardFooter}>
                    Created: {new Date(note.created_at).toLocaleDateString()}
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Add Note Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="content" className="mt-2">
              <Form.Label>Content</Form.Label>
              <Form.Control name="content" as="textarea" rows={3} value={formData.content} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="tags" className="mt-2">
              <Form.Label>Tags</Form.Label>
              <CreatableSelect
                isMulti
                options={tags.map(tag => ({ value: tag.name, label: tag.name }))}
                value={selectedTags}
                onChange={setSelectedTags}
              />
            </Form.Group>
            <Button type="submit" className="mt-3">Create Note</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Note Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="content" className="mt-2">
              <Form.Label>Content</Form.Label>
              <Form.Control name="content" as="textarea" rows={3} value={formData.content} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="tags" className="mt-2">
              <Form.Label>Tags</Form.Label>
              <CreatableSelect
                isMulti
                options={tags.map(tag => ({ value: tag.name, label: tag.name }))}
                value={selectedTags}
                onChange={setSelectedTags}
              />
            </Form.Group>
            <Button type="submit" className="mt-3">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Manage Tags Modal */}
      <Modal show={showTagModal} onHide={() => setShowTagModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tags.length === 0 ? (
            <p>No tags available.</p>
          ) : (
            tags.map(tag => (
              <div key={tag.id} className="d-flex justify-content-between align-items-center mb-2">
                <span>{tag.name}</span>
                <Button size="sm" variant="danger" onClick={() => handleDeleteTag(tag.name)}>Delete</Button>
              </div>
            ))
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NotesPage;
