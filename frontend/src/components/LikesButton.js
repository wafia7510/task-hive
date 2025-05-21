import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { axiosInstance } from '../api/axiosDefaults';
import { useAuth } from '../contexts/AuthContext';

const LikesButton = ({ noteId, initialLikesCount = 0, onLikeChange }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserLike = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Token ${token}` };

        const res = await axiosInstance.get(`/api/likes/notes/${noteId}/likes/`, { headers }); // ✅ FIXED
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

  const toggleLike = async () => {
    const token = localStorage.getItem('authToken');
    const headers = {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      if (liked) {
        const res = await axiosInstance.get(`/api/likes/notes/${noteId}/likes/`, { headers }); // ✅ FIXED
        const userLike = res.data.find((like) => like.user === user?.username);
        if (userLike) {
          await axiosInstance.delete(`/api/likes/${userLike.id}/`, { headers });
          setLikesCount((prev) => Math.max(0, prev - 1));
        }
      } else {
        await axiosInstance.post(`/api/likes/notes/${noteId}/likes/`, {}, { headers }); // ✅ FIXED
        setLikesCount((prev) => prev + 1);
      }

      setLiked(!liked);
      if (onLikeChange) onLikeChange();
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
    >
      {liked ? <FaHeart /> : <FaRegHeart />} {likesCount}
    </Button>
  );
};

export default LikesButton;
