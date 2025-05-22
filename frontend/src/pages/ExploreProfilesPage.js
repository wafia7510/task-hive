import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import NavBar from '../components/NavBar';

const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_BASE_URL || 'https://res.cloudinary.com/dotdnopux/image/upload/';

const ExploreProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Token ${token}` };

        const res = await axiosInstance.get('/api/profiles/', { headers });
        setProfiles(res.data);
      } catch (error) {
        console.error('Explore fetch failed:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (!loading && profiles.length === 0) {
    return (
      <>
        <NavBar />
        <Container className="mt-4 text-center">
          <h2 className="mb-4">Explore Users</h2>
          <p>No other profiles found.</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h2 className="mb-4 text-center">Explore Users</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} className="g-4">
            {profiles.map(profile => (
              <Col key={profile.id}>
                <Card className="text-center h-100 p-3 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      profile.image
                        ? profile.image.startsWith('http')
                          ? profile.image
                          : `${CLOUDINARY_BASE_URL}${profile.image.replace(/^image\/upload\//, '')}`
                        : 'https://via.placeholder.com/100'
                    }
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
                      <Button variant="primary" size="sm">View Profile</Button>
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
