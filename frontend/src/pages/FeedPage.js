// src/pages/FeedPage.js

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import NavBar from '../components/NavBar'; // ✅ NavBar included
import { FaUsers } from 'react-icons/fa';

const FeedPage = () => {
  const [feedNotes, setFeedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedNotes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.get('/api/notes/feed/', {
          headers: { Authorization: `Token ${token}` },
        });
        setFeedNotes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load feed.');
        setLoading(false);
      }
    };

    fetchFeedNotes();
  }, []);

  return (
    <>
      <NavBar /> {/* ✅ NavBar displayed at top */}
      <Container className="mt-4">
        <h3 className="mb-4"><FaUsers /> Feed – Notes from Your Network</h3>

        {loading && (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center">{error}</Alert>
        )}

        {!loading && !error && (
          <Row>
            {feedNotes.length === 0 ? (
              <Col>
                <p className="text-muted">No public notes from your network yet.</p>
              </Col>
            ) : (
              feedNotes.map((note) => (
                <Col md={4} key={note.id}>
                  <Card className="mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Title>{note.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">by {note.owner}</Card.Subtitle>
                      <Card.Text>{note.content.slice(0, 100)}...</Card.Text>
                      <Link to={`/notes/${note.id}`} className="btn btn-outline-info btn-sm">View Note</Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}
      </Container>
    </>
  );
};

export default FeedPage;
