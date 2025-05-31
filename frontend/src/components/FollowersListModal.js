import React, { useEffect, useState } from 'react';
import { Modal, ListGroup, Button, Spinner, Image, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

const FollowersListModal = ({ username, show, onHide, onFollowBack }) => {
  const [followersList, setFollowersList] = useState([]); // Stores followers
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const { user } = useAuth(); // Authenticated user context
  const currentUsername = user?.username;

  // Fetch followers when modal is shown
  useEffect(() => {
    if (show) {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      axiosInstance
        .get(`/follows/${username}/followers/`, {
          headers: { Authorization: `Token ${token}` },
        })
        .then(res => {
          setFollowersList(res.data); // Set follower list
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load followers.'); // Handle API failure
          setLoading(false);
        });
    }
  }, [show, username]);

  // Handle follow-back logic
  const handleFollowBack = async (targetUsername) => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.post(`/follows/${targetUsername}/`, null, {
        headers: { Authorization: `Token ${token}` },
      });

      // Update followed_back status in UI
      setFollowersList(prev =>
        prev.map(user =>
          user.username === targetUsername ? { ...user, followed_back: true } : user
        )
      );

      // Optional external callback
      if (onFollowBack) onFollowBack();
    } catch {
      setError('Could not follow back.');
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="followers-modal-title"
      aria-describedby="followers-modal-body"
    >
      {/* Modal Header */}
      <Modal.Header closeButton aria-label="Close followers modal">
        <Modal.Title id="followers-modal-title">Followers</Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body id="followers-modal-body">
        {loading ? (
          // Show spinner while loading
          <Spinner animation="border" aria-label="Loading followers" />
        ) : error ? (
          // Display error if fetching fails
          <Alert variant="danger">{error}</Alert>
        ) : followersList.length === 0 ? (
          // Empty state
          <p>No followers yet.</p>
        ) : (
          // Render followers
          <ListGroup>
            {followersList.map(user => {
              const displayUsername = user.username || user.user?.username || 'undefined';

              return (
                <ListGroup.Item
                  key={user.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  {/* Follower profile link */}
                  <Link
                    to={`/profiles/${displayUsername}`}
                    className="d-flex align-items-center text-decoration-none"
                    onClick={onHide}
                    aria-label={`View profile of ${displayUsername}`}
                  >
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

                  {/* Follow Back button shown only when viewing own profile */}
                  {username === currentUsername &&
                    !user.followed_back &&
                    displayUsername !== 'undefined' && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleFollowBack(displayUsername)}
                        aria-label={`Follow back ${displayUsername}`}
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

// Prop validation for type safety
FollowersListModal.propTypes = {
  username: PropTypes.string.isRequired,     // The profile being viewed
  show: PropTypes.bool.isRequired,           // Whether modal is visible
  onHide: PropTypes.func.isRequired,         // Function to close modal
  onFollowBack: PropTypes.func.isRequired,   // Callback after following
};

export default FollowersListModal;
