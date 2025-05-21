import React, { useEffect, useState } from 'react';
import {
  Container, Card, Image, Modal, ListGroup,
  Spinner, Alert, Button, Form,
} from 'react-bootstrap';
import { axiosInstance } from '../api/axiosDefaults';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import styles from '../styles/ProfilePage.module.css';

const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_BASE_URL || 'https://res.cloudinary.com/dotdnopux/image/upload/';

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', image: '' });
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const isOwnProfile = !id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Token ${token}` };
        const response = id
          ? await axiosInstance.get(`/api/profiles/${id}/`, { headers })
          : await axiosInstance.get('/api/profiles/me/', { headers });

        setProfile(response.data);
        setEditForm({ bio: response.data.bio || '', image: '' });

        console.log("✅ Profile image path:", response.data.image);
        console.log("✅ Base URL from env:", CLOUDINARY_BASE_URL);
        console.log("✅ Final image URL:", getFullImageUrl(response.data.image));

        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        setError('Could not fetch profile.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const fetchFollowers = async () => {
    setFollowers([{ username: 'alice' }, { username: 'bob' }]); // placeholder
    setShowFollowersModal(true);
  };

  const fetchFollowing = async () => {
    setFollowing([{ username: 'charlie' }, { username: 'diana' }]); // placeholder
    setShowFollowingModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };
    const formData = new FormData();
    formData.append('bio', editForm.bio);
    if (editForm.image) {
      formData.append('image', editForm.image);
    }

    try {
      const res = await axiosInstance.put('/api/profiles/me/', formData, { headers });
      setProfile(res.data);
      setShowEditModal(false);
    } catch (err) {
      console.error('❌ Failed to update profile:', err);
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${CLOUDINARY_BASE_URL}${path.replace(/^image\/upload\//, '')}`;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-3 text-center">{error}</Alert>;
  }

  return (
    <>
      <NavBar />
      <Container className="mt-4 d-flex justify-content-center">
        <Card className="shadow p-4 w-100" style={{ maxWidth: '500px' }}>
          <div className="text-center">
            <Image
              src={
                profile.image
                  ? `${getFullImageUrl(profile.image)}?${new Date().getTime()}`
                  : 'https://via.placeholder.com/150'
              }
              roundedCircle
              width={130}
              height={130}
              alt="Profile"
              className={styles.profileImage}
            />
            <h4 className={`mt-3 ${styles.username}`}>@{profile.username}</h4>
            <p className={styles.bioText}>{profile.bio || 'No bio added.'}</p>
            <p className={styles.stats}>
              <strong>Followers:</strong>{' '}
              <span style={{ cursor: 'pointer' }} onClick={fetchFollowers}>{profile.followers_count}</span>
            </p>
            <p className={styles.stats}>
              <strong>Following:</strong>{' '}
              <span style={{ cursor: 'pointer' }} onClick={fetchFollowing}>{profile.following_count}</span>
            </p>
            {isOwnProfile && (
              <Button
                variant="outline-primary"
                size="sm"
                className={styles.editBtn}
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </Card>
      </Container>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="image" className="mt-2">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleEditChange}
              />
            </Form.Group>
            <Button type="submit" className="mt-3">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Followers Modal */}
      <Modal show={showFollowersModal} onHide={() => setShowFollowersModal(false)}>
        <Modal.Header closeButton><Modal.Title>Followers</Modal.Title></Modal.Header>
        <Modal.Body>
          <ListGroup>
            {followers.map((f, idx) => (
              <ListGroup.Item key={idx}>@{f.username}</ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>

      {/* Following Modal */}
      <Modal show={showFollowingModal} onHide={() => setShowFollowingModal(false)}>
        <Modal.Header closeButton><Modal.Title>Following</Modal.Title></Modal.Header>
        <Modal.Body>
          <ListGroup>
            {following.map((f, idx) => (
              <ListGroup.Item key={idx}>@{f.username}</ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfilePage;
