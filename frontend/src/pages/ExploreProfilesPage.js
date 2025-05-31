import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import NavBar from '../components/NavBar';

// ✅ Cloudinary URL builder with cleaning
const getFullImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/100';
  if (path.startsWith('http')) return path;

  const cleanedPath = path.replace(/^image\/upload\//, '');
  return `https://res.cloudinary.com/dotdnopux/image/upload/${cleanedPath}`;
};

const ExploreProfilesPage = () => {
  const [profiles, setProfiles] = useState([]); // All profiles from API
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState(''); // Search input by user

  // ✅ Fetch all user profiles on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Token ${token}` };
        const res = await axiosInstance.get('/profiles/', { headers });
        setProfiles(res.data);
      } catch (error) {
        console.error('Explore fetch failed:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // ✅ Filter profiles by username
  const filteredProfiles = profiles.filter(profile =>
    profile.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Handle loading + no results
  if (!loading && filteredProfiles.length === 0) {
    return (
      <>
        <NavBar />
        <Container className="mt-4 text-center" role="main" aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="mb-4">Explore Users</h2>
          <InputGroup className="mb-4" aria-label="Search users by username">
            <Form.Control
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search input"
            />
          </InputGroup>
          <p>No users found for: <strong>{searchTerm}</strong></p>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container className="mt-4" role="main" aria-labelledby="explore-heading">
        {/* 🔍 Explore heading */}
        <h2 id="explore-heading" className="mb-4 text-center">Explore Users</h2>

        {/* 🔍 Search bar */}
        <InputGroup className="mb-4" aria-label="Search users by username">
          <Form.Control
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search input"
          />
        </InputGroup>

        {/* 🔄 Show loading spinner */}
        {loading ? (
          <div className="text-center" role="status" aria-live="polite">
            <Spinner animation="border" aria-label="Loading profiles..." />
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} className="g-4">
            {/* 🧑 Render filtered profiles */}
            {filteredProfiles.map((profile) => (
              <Col key={profile.id}>
                <Card className="text-center h-100 p-3 shadow-sm" aria-label={`Profile card for ${profile.username}`}>
                  <Card.Img
                    variant="top"
                    src={getFullImageUrl(profile.image)}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      margin: '0 auto',
                    }}
                    alt={`${profile.username}'s avatar`}
                  />
                  <Card.Body>
                    <Card.Title>@{profile.username}</Card.Title>
                    <Link to={`/profiles/${profile.username}`}>
                      <Button variant="primary" size="sm" aria-label={`View ${profile.username}'s profile`}>
                        View Profile
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default ExploreProfilesPage;
