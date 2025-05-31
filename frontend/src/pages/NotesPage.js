import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Form, Button, Card,
  Alert, Badge, Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import NavBar from '../components/NavBar';
import CreatableSelect from 'react-select/creatable';
import CommentsModal from '../components/CommentsModal';
import ManageTagsModal from '../components/ManageTagsModal';
import LikesButton from '../components/LikesButton';
import notesBanner from '../assets/notes_banner.jpg';
import styles from '../styles/NotesPage.module.css';

const NotesPage = () => {
  // 🔁 States to manage notes, tags, form data, modals, feedback, etc.
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // ⏳ Clear feedback messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // 📦 Fetch notes and tags on load if authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchNotesAndTags = async () => {
      const headers = { Authorization: `Token ${token}` };
      setLoading(true);
      try {
        const [notesRes, tagsRes] = await Promise.all([
          axiosInstance.get('/notes/', { headers }),
          axiosInstance.get('/tags/', { headers }),
        ]);
        setNotes(notesRes.data);
        setTags(tagsRes.data);
      } catch (err) {
        setError('Error fetching notes or tags');
      } finally {
        setLoading(false);
      }
    };
    fetchNotesAndTags();
  }, [navigate]);

  // ✍️ Handle input field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 🔄 Reset form fields and tag selections
  const resetForm = () => {
    setFormData({ title: '', content: '', is_public: false });
    setSelectedTags([]);
    setEditingId(null);
  };

  // ✅ Submit handler for creating or editing notes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };
    const tagNames = selectedTags.map(tag => tag.value);
    const existingTagNames = tags.map(tag => tag.name);
    const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));

    try {
      for (const name of newTagNames) {
        try {
          await axiosInstance.post('/tags/', { name }, { headers });
        } catch (err) {
          if (err.response?.status !== 400) throw err;
        }
      }

      if (editingId) {
        await axiosInstance.put(`/notes/${editingId}/`, { ...formData, tags: tagNames }, { headers });
        setSuccess('Note updated successfully.');
        setShowEditModal(false);
      } else {
        await axiosInstance.post('/notes/', { ...formData, tags: tagNames }, { headers });
        setSuccess('Note created successfully.');
        setShowAddModal(false);
      }

      resetForm();
      const [notesRes, tagsRes] = await Promise.all([
        axiosInstance.get('/notes/', { headers }),
        axiosInstance.get('/tags/', { headers }),
      ]);
      setNotes(notesRes.data);
      setTags(tagsRes.data);
    } catch (err) {
      setError('Error saving note.');
    } finally {
      setSubmitting(false);
    }
  };

  // ✏️ Set form for editing
  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content, is_public: note.is_public });
    setSelectedTags(note.tags.map(tag => ({ value: tag, label: tag })));
    setEditingId(note.id);
    setShowEditModal(true);
  };

  // ❌ Delete a note
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };
    try {
      await axiosInstance.delete(`/notes/${id}/`, { headers });
      setSuccess('Note deleted.');
      const res = await axiosInstance.get('/notes/', { headers });
      setNotes(res.data);
    } catch (err) {
      setError('Error deleting note.');
    }
  };

  // 💬 Open comments modal
  const handleOpenComments = (note) => {
    setSelectedNoteForComment(note);
    setShowCommentModal(true);
  };

  // 🔍 Filter notes by title and selected tag
  const filteredNotes = notes.filter(note => {
    const matchesTitle = note.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !filterTag || note.tags.includes(filterTag);
    return matchesTitle && matchesTag;
  });

  return (
    <>
      <NavBar />

      {/* 🖼️ Banner */}
      <div className={styles.banner} aria-label="Notes banner">
        <img src={notesBanner} alt="Notes Banner" className={styles.bannerImage} />
        <div className={styles.bannerText}>
          <h3>Welcome to Your Notes</h3>
          <p>Use this page to create, tag, edit, delete, and filter your study notes by topic.</p>
        </div>
      </div>

      {/* 🔄 Conditional Rendering */}
      {loading ? (
        <div className="text-center mt-5" aria-label="Loading notes">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Container className="mt-4" aria-label="Notes container">
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* ➕ Note and Tag Buttons */}
          <div className="d-flex justify-content-end mb-3 gap-2">
            <Button variant="info" onClick={() => setShowTagModal(true)}>Manage Tags</Button>
            <Button onClick={() => { resetForm(); setShowAddModal(true); }}>+ Add Note</Button>
          </div>

          {/* 🔍 Search Input */}
          <h4 className="mb-3">Search Your Notes</h4>
          <Form.Control
            type="text"
            placeholder="Search by title..."
            className="mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search notes"
          />

          {/* 🔘 Tag Filters */}
          <h5 className="mb-2">Filter by Tag</h5>
          <div className="mb-4">
            {tags.map(tag => (
              <Badge
                key={tag.name}
                bg={filterTag === tag.name ? 'primary' : 'secondary'}
                onClick={() => setFilterTag(tag.name === filterTag ? null : tag.name)}
                style={{ cursor: 'pointer', marginRight: '0.4rem' }}
                aria-label={`Filter tag ${tag.name}`}
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* 🗒️ Notes Grid */}
          <Row>
            {filteredNotes.map(note => (
              <Col md={6} lg={4} key={note.id} className="mb-4">
                <Card className={`shadow-sm h-100 ${styles.cardNote}`} aria-label={`Note titled ${note.title}`}>
                  <Card.Body className={styles.cardBody}>
                    <Card.Title>
                      <strong>Title:</strong> {note.title}{' '}
                      {note.is_public ? <span title="Public Note">🌍</span> : <span title="Private Note">🔒</span>}
                    </Card.Title>

                    <div className={styles.cardText}>
                      <strong>Content:</strong><br />
                      {note.content}
                    </div>

                    <div className={styles.tagArea}>
                      {note.tags.length > 0 ? (
                        note.tags.map(tag => (
                          <Badge
                            key={tag}
                            bg="info"
                            className={styles.tagBadge}
                            onClick={() => setFilterTag(tag)}
                            style={{ cursor: 'pointer' }}
                            aria-label={`Tag ${tag}`}
                          >
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted">No tags</span>
                      )}
                    </div>

                    {/* 🧰 Note Actions */}
                    <div className={styles.cardActions}>
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(note)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(note.id)}>Delete</Button>
                      <Button size="sm" variant="info" onClick={() => handleOpenComments(note)}>Comments</Button>
                      <LikesButton noteId={note.id} initialLikesCount={note.like_count} />
                    </div>
                  </Card.Body>

                  <Card.Footer className={`d-flex justify-content-between ${styles.cardFooter}`}>
                    <small className="text-muted">Updated: {new Date(note.updated_at).toLocaleDateString()}</small>
                    <small className="text-muted">Created: {new Date(note.created_at).toLocaleDateString()}</small>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 💬 Comments Modal */}
          <CommentsModal
            note={selectedNoteForComment}
            show={showCommentModal}
            onHide={() => setShowCommentModal(false)}
          />

          {/* 🏷️ Tags Modal */}
          <ManageTagsModal
            show={showTagModal}
            onHide={() => setShowTagModal(false)}
            tags={tags}
            setTags={setTags}
            notes={notes}
          />
        </Container>
      )}

      {/* ➕ Add Note Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} aria-label="Add Note Modal">
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
            <Form.Group controlId="is_public" className="mt-2">
              <Form.Check type="checkbox" label="Make Note Public" name="is_public" checked={formData.is_public} onChange={handleChange} />
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
            <Button type="submit" className="mt-3" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating...
                </>
              ) : (
                'Create Note'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ✏️ Edit Note Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} aria-label="Edit Note Modal">
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
            <Form.Group controlId="is_public" className="mt-2">
              <Form.Check type="checkbox" label="Make Note Public" name="is_public" checked={formData.is_public} onChange={handleChange} />
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
            <Button type="submit" className="mt-3" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NotesPage;
