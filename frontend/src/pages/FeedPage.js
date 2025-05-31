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
import { axiosInstance } from '../api/axiosDefaults';
import NavBar from '../components/NavBar';
import { FaUsers, FaSearch } from 'react-icons/fa';
import CommentsModal from '../components/CommentsModal';
import LikesButton from '../components/LikesButton';
import styles from '../styles/FeedPage.module.css';
import feedHeroImage from '../assets/feed.png';

const FeedPage = () => {
  const [feedNotes, setFeedNotes] = useState([]);              // All notes from followed users
  const [filteredNotes, setFilteredNotes] = useState([]);      // Notes after search filtering
  const [loading, setLoading] = useState(true);                // Loading state
  const [error, setError] = useState('');                      // Error message
  const [searchTerm, setSearchTerm] = useState('');            // User's search input
  const [selectedNote, setSelectedNote] = useState(null);      // Note selected for comment modal
  const [showCommentsModal, setShowCommentsModal] = useState(false); // Modal visibility

  // ✅ Fetch public notes from followed users on load
  useEffect(() => {
    const fetchFeedNotes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.get('/notes/feed/', {
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

  // ✅ Filter notes by search keyword
  useEffect(() => {
    const filtered = feedNotes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchTerm, feedNotes]);

  // ✅ Refresh feed after like toggle
  const handleLikeChange = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.get('/notes/feed/', {
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

      <Container className="mt-4" role="main" aria-labelledby="feed-heading">
        {/* 🔹 Page Title */}
        <h3 id="feed-heading" className="mb-4">
          <FaUsers aria-hidden="true" /> Feed – Notes from Your Network
        </h3>

        {/* 🔹 Hero Banner */}
        <div className="text-center mb-4">
          <img
            src={feedHeroImage}
            alt="TaskHive Feed Hero Banner"
            className={`img-fluid ${styles.heroImage}`}
          />
        </div>

        {/* 🔹 Search Notes */}
        <InputGroup className="mb-4" aria-label="Search notes input group">
          <InputGroup.Text aria-hidden="true">
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

        {/* 🔹 Loading Spinner */}
        {loading && (
          <div className="text-center mt-5" role="status" aria-live="polite">
            <Spinner animation="border" aria-label="Loading feed notes..." />
          </div>
        )}

        {/* 🔹 Error Message */}
        {error && (
          <Alert variant="danger" className="text-center" role="alert">
            {error}
          </Alert>
        )}

        {/* 🔹 Notes Grid */}
        {!loading && !error && (
          <Row>
            {/* ❌ No notes */}
            {filteredNotes.length === 0 ? (
              <Col>
                <p className="text-muted" role="status">No public notes from your network yet.</p>
              </Col>
            ) : (
              filteredNotes.map((note) => (
                <Col md={4} key={note.id}>
                  {/* ✅ Individual Note Card */}
                  <Card className={`mb-3 shadow-sm ${styles.fixedCardHeight}`} aria-label={`Note card: ${note.title}`}>
                    <Card.Body className={styles.cardBody}>
                      <Card.Title>{note.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">by {note.owner}</Card.Subtitle>
                      <Card.Text className={styles.cardTextScroll}>
                        {note.content.slice(0, 100)}...
                      </Card.Text>

                      {/* ✅ Comment & Like Actions */}
                      <div className={styles.cardActions}>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => {
                            setSelectedNote(note);
                            setShowCommentsModal(true);
                          }}
                          aria-label={`Open comments for ${note.title}`}
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

      {/* 🔹 Comments Modal */}
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
