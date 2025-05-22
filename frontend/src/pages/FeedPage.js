// src/pages/FeedPage.js

import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import NavBar from '../components/NavBar';
import { FaUsers, FaSearch } from 'react-icons/fa';
import CommentsModal from '../components/CommentsModal';
import LikesButton from '../components/LikesButton';
import styles from '../styles/FeedPage.module.css'; // ✅ Import styles
import feedHeroImage from '../assets/feed.png';
const FeedPage = () => {
  const [feedNotes, setFeedNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  // Fetch public notes from followed users
  useEffect(() => {
    const fetchFeedNotes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.get('/api/notes/feed/', {
          headers: { Authorization: `Token ${token}` },
        });
        setFeedNotes(response.data);
        setFilteredNotes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load feed.');
        setLoading(false);
      }
    };

    fetchFeedNotes();
  }, []);

  // Filter notes by search term
  useEffect(() => {
    const filtered = feedNotes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchTerm, feedNotes]);

  // Handle updating like count locally
  const handleLikeChange = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.get('/api/notes/feed/', {
        headers: { Authorization: `Token ${token}` },
        });
        setFeedNotes(response.data);
        setFilteredNotes(response.data);
    } catch (err) {
        console.error('Failed to refresh likes:', err);
    }
};


  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h3 className="mb-4">
          <FaUsers aria-label="Feed Icon" /> Feed – Notes from Your Network
        </h3>

        {/* Hero Image */}
        <div className="text-center mb-4">
          <img
                src={feedHeroImage}
                alt="TaskHive Feed Hero"
                className={`img-fluid ${styles.heroImage}`}
          />
        </div>

        {/* Search Bar */}
        <InputGroup className="mb-4">
          <InputGroup.Text aria-label="Search Icon">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search notes by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search notes"
            className={styles.searchInput}
          />
        </InputGroup>

        {/* Feed Notes */}
        {loading && (
          <div className="text-center mt-5">
            <Spinner animation="border" aria-label="Loading feed" />
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Row>
            {filteredNotes.length === 0 ? (
              <Col>
                <p className="text-muted">No public notes from your network yet.</p>
              </Col>
            ) : (
              filteredNotes.map((note) => (
                <Col md={4} key={note.id}>
                  <Card className="mb-3 shadow-sm">
                    <Card.Body className={styles.cardBody}>
                      <Card.Title>{note.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        by {note.owner}
                      </Card.Subtitle>
                      <Card.Text>{note.content.slice(0, 100)}...</Card.Text>

                      {/* Like & Comment Buttons */}
                      <div className={styles.cardActions}>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => {
                            setSelectedNote(note);
                            setShowCommentsModal(true);
                          }}
                          aria-label={`Comment on ${note.title}`}
                        >
                          Comment
                        </Button>
                        <LikesButton
                            noteId={note.id}
                            initialLikesCount={note.like_count || 0}
                            onLikeChange={handleLikeChange}
                        />

                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}
      </Container>

      {/* Comments Modal */}
      {selectedNote && (
        <CommentsModal
          note={selectedNote}
          show={showCommentsModal}
          onHide={() => setShowCommentsModal(false)}
        />
      )}
    </>
  );
};

export default FeedPage;
