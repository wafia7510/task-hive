import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Icons for liked/unliked states
import { axiosInstance } from '../api/axiosDefaults';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

const LikesButton = ({ noteId, initialLikesCount = 0, onLikeChange }) => {
  const [liked, setLiked] = useState(false); // Whether current user liked the note
  const [likesCount, setLikesCount] = useState(initialLikesCount); // Total likes
  const { user } = useAuth(); // Authenticated user

  // Check if the current user has already liked the note
  useEffect(() => {
    const fetchUserLike = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Token ${token}` };

        // Fetch likes for the given note
        const res = await axiosInstance.get(`/likes/notes/${noteId}/likes/`, { headers });

        // Check if current user's username is among the likers
        const userLiked = res.data.some((like) => like.user === user?.username);
        setLiked(userLiked);
      } catch (err) {
        console.error('Error checking like status:', err.response?.data || err.message);
      }
    };

    if (user?.username) {
      fetchUserLike();
    }
  }, [noteId, user?.username]);

  // Toggle like/unlike on button click
  const toggleLike = async () => {
    const token = localStorage.getItem('authToken');
    const headers = {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      if (liked) {
        // If already liked, find the like ID and delete it
        const res = await axiosInstance.get(`/likes/notes/${noteId}/likes/`, { headers });
        const userLike = res.data.find((like) => like.user === user?.username);

        if (userLike) {
          await axiosInstance.delete(`/likes/${userLike.id}/`, { headers });
          setLikesCount((prev) => Math.max(0, prev - 1)); // Decrement likes safely
        }
      } else {
        // If not liked yet, add a new like
        await axiosInstance.post(`/likes/notes/${noteId}/likes/`, {}, { headers });
        setLikesCount((prev) => prev + 1);
      }

      setLiked(!liked); // Toggle the like state
      if (onLikeChange) onLikeChange(); // Callback if provided
    } catch (err) {
      console.error('Error toggling like:', err.response?.data || err.message);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline-danger"
      onClick={toggleLike}
      className="d-flex align-items-center gap-1"
      aria-label={liked ? 'Unlike note' : 'Like note'}
    >
      {/* Show filled heart if liked, empty if not */}
      {liked ? <FaHeart /> : <FaRegHeart />} {likesCount}
    </Button>
  );
};

// Prop validation
LikesButton.propTypes = {
  noteId: PropTypes.number.isRequired,             // Note ID for which likes are managed
  initialLikesCount: PropTypes.number.isRequired,  // Initial number of likes
  onLikeChange: PropTypes.func.isRequired,         // Callback on like state change
};

export default LikesButton;
