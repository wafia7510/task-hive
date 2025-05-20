
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import NavBar from '../components/NavBar';
import CreatableSelect from 'react-select/creatable';
import CommentsModal from '../components/CommentsModal';
import ManageTagsModal from '../components/ManageTagsModal';
import notesBanner from '../assets/notes_banner.jpg';
import styles from '../styles/NotesPage.module.css';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', is_public: false });
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedNoteForComment, setSelectedNoteForComment] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchNotesAndTags = async () => {
      const headers = { Authorization: `Token ${token}` };
      try {
        const [notesRes, tagsRes] = await Promise.all([
          axiosInstance.get('/api/notes/', { headers }),
          axiosInstance.get('/api/tags/', { headers }),
        ]);
        setNotes(notesRes.data);
        setTags(tagsRes.data);
      } catch (err) {
        setError('Error fetching notes or tags');
      }
    };

    fetchNotesAndTags();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', is_public: false });
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

      if (editingId) {
        await axiosInstance.put(`/api/notes/${editingId}/`, { ...formData, tags: tagNames }, { headers });
        setSuccess('Note updated successfully.');
        setShowEditModal(false);
      } else {
        await axiosInstance.post('/api/notes/', { ...formData, tags: tagNames }, { headers });
        setSuccess('Note created successfully.');
        setShowAddModal(false);
      }

      resetForm();
      const [notesRes, tagsRes] = await Promise.all([
        axiosInstance.get('/api/notes/', { headers }),
        axiosInstance.get('/api/tags/', { headers }),
      ]);
      setNotes(notesRes.data);
      setTags(tagsRes.data);
    } catch (err) {
      setError('Error saving note.');
    }
  };

  const handleEdit = (note) => {
    setFormData({
      title: note.title,
      content: note.content,
      is_public: note.is_public,
    });
    setSelectedTags(note.tags.map(tag => ({ value: tag, label: tag })));
    setEditingId(note.id);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };
    try {
      await axiosInstance.delete(`/api/notes/${id}/`, { headers });
      setSuccess('Note deleted.');
      const res = await axiosInstance.get('/api/notes/', { headers });
      setNotes(res.data);
    } catch (err) {
      setError('Error deleting note.');
    }
  };

  const handleOpenComments = (note) => {
    setSelectedNoteForComment(note);
    setShowCommentModal(true);
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

        <div className="mb-3">
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
        </div>

        <Row>
          {filteredNotes.map(note => (
            <Col md={6} lg={4} key={note.id} className="mb-4">
              <Card className={`shadow-sm h-100 ${styles.cardNote}`}>
                <Card.Body>
                  <Card.Title>{note.title}</Card.Title>
                  <Card.Text>{note.content.length > 100 ? note.content.slice(0, 100) + '...' : note.content}</Card.Text>
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
                  <div className="d-flex justify-content-between gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(note)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(note.id)}>Delete</Button>
                    <Button size="sm" variant="info" onClick={() => handleOpenComments(note)}>Comments</Button>
                  </div>
                </Card.Body>
                <Card.Footer className={styles.cardFooter}>
                  Created: {new Date(note.created_at).toLocaleDateString()}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        <CommentsModal
          note={selectedNoteForComment}
          show={showCommentModal}
          onHide={() => setShowCommentModal(false)}
        />

        <ManageTagsModal
          show={showTagModal}
          onHide={() => setShowTagModal(false)}
          tags={tags}
          setTags={setTags}
          notes={notes}
        />

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
              <Form.Check
                type="checkbox"
                label="Make this note public"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="mt-2"
              />
              <Button type="submit" className="mt-3">Create Note</Button>
            </Form>
          </Modal.Body>
        </Modal>

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
              <Form.Check
                type="checkbox"
                label="Make this note public"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="mt-2"
              />
              <Button type="submit" className="mt-3">Save Changes</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default NotesPage;
