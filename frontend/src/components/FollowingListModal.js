import React, { useEffect, useState } from 'react';
import { Modal, ListGroup, Button, Spinner, Image, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';

const FollowingListModal = ({ username, show, onHide, onUnfollow }) => {
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      axiosInstance.get(`/api/follows/${username}/following/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then(response => {
          setFollowingList(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load following list.');
          setLoading(false);
        });
    }
  }, [show, username]);

  const handleUnfollow = async (targetUsername) => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.delete(`/api/follows/${targetUsername}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      setFollowingList(prev => prev.filter(user => user.username !== targetUsername));

      if (onUnfollow) onUnfollow(targetUsername);
    } catch {
      setError('Failed to unfollow. Try again.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Following</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : followingList.length === 0 ? (
          <p>You are not following anyone yet.</p>
        ) : (
          <ListGroup>
            {followingList.map(user => {
              const displayUsername = user.username || user.user?.username || 'undefined';
              return (
                <ListGroup.Item key={user.id} className="d-flex align-items-center justify-content-between">
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
                  {displayUsername !== 'undefined' && (
                    <Button variant="outline-danger" size="sm" onClick={() => handleUnfollow(displayUsername)}>
                      Unfollow
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

export default FollowingListModal;
