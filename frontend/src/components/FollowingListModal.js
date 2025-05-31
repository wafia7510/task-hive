import React, { useEffect, useState } from 'react';
import { Modal, ListGroup, Button, Spinner, Image, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

const FollowingListModal = ({ username, show, onHide, onUnfollow }) => {
  // State to hold the list of users the profile is following
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true); // Show spinner while loading
  const [error, setError] = useState(''); // Handle fetch errors
  const { user } = useAuth();
  const currentUsername = user?.username;

  // Fetch the list of users the current profile is following when modal opens
  useEffect(() => {
    if (show) {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      axiosInstance.get(`/follows/${username}/following/`, {
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

  // Unfollow a user from the list
  const handleUnfollow = async (targetUsername) => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.delete(`/follows/${targetUsername}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      // Update list after unfollowing
      setFollowingList(prev => prev.filter(user => user.username !== targetUsername));

      // Callback to parent to sync count or UI
      if (onUnfollow) onUnfollow(targetUsername);
    } catch {
      setError('Failed to unfollow. Try again.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered aria-labelledby="following-modal-title">
      {/* Modal Header */}
      <Modal.Header closeButton aria-label="Close following modal">
        <Modal.Title id="following-modal-title">Following</Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body>
        {loading ? (
          // Spinner while loading list
          <Spinner animation="border" aria-label="Loading following list" />
        ) : error ? (
          // Show error alert if fetch fails
          <Alert variant="danger" role="alert">{error}</Alert>
        ) : followingList.length === 0 ? (
          // Empty state
          <p>You are not following anyone yet.</p>
        ) : (
          // Render list of following users
          <ListGroup>
            {followingList.map(user => {
              const displayUsername = user.username || user.user?.username || 'undefined';

              return (
                <ListGroup.Item
                  key={user.id}
                  className="d-flex align-items-center justify-content-between"
                >
                  {/* Link to user profile */}
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

                  {/* Unfollow button (only visible when viewing your own profile) */}
                  {username === currentUsername && displayUsername !== 'undefined' && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleUnfollow(displayUsername)}
                      aria-label={`Unfollow ${displayUsername}`}
                    >
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

// Validate props passed to this component
FollowingListModal.propTypes = {
  username: PropTypes.string.isRequired,     // Profile username to fetch following for
  show: PropTypes.bool.isRequired,           // Modal visibility state
  onHide: PropTypes.func.isRequired,         // Function to close the modal
  onUnfollow: PropTypes.func.isRequired,     // Callback after unfollowing a user
};

export default FollowingListModal;
