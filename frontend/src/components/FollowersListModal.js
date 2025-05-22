import React, { useEffect, useState } from 'react';
import { Modal, ListGroup, Button, Spinner, Image, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';

const FollowersListModal = ({ username, show, onHide, onFollowBack }) => {
  const [followersList, setFollowersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      axiosInstance.get(`/api/follows/${username}/followers/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then(res => {
          setFollowersList(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load followers.');
          setLoading(false);
        });
    }
  }, [show, username]);

  const handleFollowBack = async (targetUsername) => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.post(`/api/follows/${targetUsername}/`, null, {
        headers: { Authorization: `Token ${token}` },
      });

      setFollowersList(prev =>
        prev.map(user =>
          user.username === targetUsername ? { ...user, followed_back: true } : user
        )
      );

      if (onFollowBack) onFollowBack();
    } catch {
      setError('Could not follow back.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Followers</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : followersList.length === 0 ? (
          <p>No followers yet.</p>
        ) : (
          <ListGroup>
            {followersList.map(user => {
              const displayUsername = user.username || user.user?.username || 'undefined';
              return (
                <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                  <Link to={`/profiles/${displayUsername}`} className="d-flex align-items-center text-decoration-none" onClick={onHide}>
                    <Image
                      src={user.image || 'https://ui-avatars.com/api/?name=User'}
                      alt={displayUsername}
                      roundedCircle
                      width={40}
                      height={40}
                      className="me-2"
                    />
                    @{displayUsername}
                  </Link>
                  {!user.followed_back && displayUsername !== 'undefined' && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleFollowBack(displayUsername)}
                    >
                      Follow Back
                    </Button>
                  )}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FollowersListModal;
