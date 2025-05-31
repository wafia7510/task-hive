import React, { useEffect, useState } from 'react';
import {
  Container, Card, Image, Modal,
  Spinner, Alert, Button, Form
} from 'react-bootstrap';
import { axiosInstance } from '../api/axiosDefaults';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import FollowingListModal from '../components/FollowingListModal';
import FollowersListModal from '../components/FollowersListModal';
import AccountModal from '../components/AccountModal';
import styles from '../styles/ProfilePage.module.css';

const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_BASE_URL || 'https://res.cloudinary.com/dotdnopux/image/upload/';

const ProfilePage = () => {
  const { username } = useParams(); // Extract username from URL
  const [profile, setProfile] = useState(null); // Profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [saving, setSaving] = useState(false); // Profile update state
  const [error, setError] = useState(''); // Error message
  const [toast, setToast] = useState(null); // Toast notification
  const [showFollowersModal, setShowFollowersModal] = useState(false); // Followers modal toggle
  const [showFollowingModal, setShowFollowingModal] = useState(false); // Following modal toggle
  const [showEditModal, setShowEditModal] = useState(false); // Edit modal toggle
  const [showAccountModal, setShowAccountModal] = useState(false); // Account modal toggle
  const [editForm, setEditForm] = useState({ bio: '', image: '' }); // Edit form data
  const [imagePreview, setImagePreview] = useState(null); // Image preview for profile image
  const isOwnProfile = !username; // Check if viewing own profile

  useEffect(() => {
    const fetchProfile = async () => {
      // Reset profile and loading state to avoid showing stale data
      setProfile(null);
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Token ${token}` };
        const response = username
          ? await axiosInstance.get(`/profiles/username/${username}/`, { headers })
          : await axiosInstance.get('/profiles/me/', { headers });

        setProfile(response.data);
        setEditForm({ bio: response.data.bio || '', image: '' });
        setImagePreview(null);
      } catch (err) {
        console.error(err);
        setError('Could not fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  // Handle changes in the edit form inputs
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setEditForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Cancel editing profile and reset form
  const handleCancelEdit = () => {
    setEditForm({ bio: profile?.bio || '', image: '' });
    setImagePreview(null);
    setShowEditModal(false);
  };

  // Submit the updated profile info to the server
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };
    const formData = new FormData();
    formData.append('bio', editForm.bio);
    if (editForm.image) {
      formData.append('image', editForm.image);
    }

    try {
      await axiosInstance.put('/profiles/me/', formData, { headers });
      setToast({ type: 'success', message: 'Profile updated successfully!' });
      setShowEditModal(false);
      const res = await axiosInstance.get('/profiles/me/', { headers });
      setProfile(res.data);
    } catch (err) {
      console.error('❌ Failed to update profile:', err);
      setToast({ type: 'danger', message: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  // Follow or unfollow the current profile user
  const handleFollowToggle = async () => {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    try {
      const method = profile.is_following ? 'delete' : 'post';
      await axiosInstance({
        method: method,
        url: `/follows/${profile.username}/`,
        headers: headers,
      });

      setProfile(prev => ({
        ...prev,
        is_following: !prev.is_following,
        followers_count: prev.is_following
          ? prev.followers_count - 1
          : prev.followers_count + 1,
      }));
    } catch (err) {
      console.error('Follow/Unfollow failed:', err);
      setToast({ type: 'danger', message: 'Follow action failed.' });
    }
  };

  // Resolve full image URL whether it's a Cloudinary path or a media path
  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (typeof path === 'string' && (path.startsWith('http') || path.startsWith('https'))) {
      return path;
    }
    if (path.includes('image/upload/')) {
      return `https://res.cloudinary.com/dotdnopux/${path}`;
    }
    if (path.includes('media/')) {
      return `${CLOUDINARY_BASE_URL}${path.split('media/')[1]}`;
    }
    return `${CLOUDINARY_BASE_URL}${path.replace(/^image\/upload\//, '')}`;
  };

  // If profile not found
  if (!loading && !profile) {
    return (
      <>
        <NavBar aria-label="Main navigation" />
        <Alert variant="danger" className="text-center mt-5" role="alert">
          Profile not found or failed to load.
        </Alert>
      </>
    );
  }

  return (
    <>
      <NavBar aria-label="Main navigation" />
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="mt-3 text-center" role="alert">{error}</Alert>
      ) : (
        <Container className="mt-4 d-flex justify-content-center">
          <Card className="shadow p-4 w-100" style={{ maxWidth: '500px' }}>
            <div className="text-center">
              {/* Profile image */}
              <Image
                src={
                  profile.image
                    ? `${getFullImageUrl(profile.image)}?${new Date().getTime()}`
                    : 'https://via.placeholder.com/150'
                }
                roundedCircle
                width={130}
                height={130}
                alt={`Profile picture of @${profile.username}`}
                className={styles.profileImage}
              />

              <h4 className={`mt-3 ${styles.username}`}>@{profile.username}</h4>
              <p className={styles.bioText}>{profile.bio || 'No bio added.'}</p>

              {/* Followers and Following counts with modal triggers */}
              <p className={styles.stats}>
                <strong>Followers:</strong>{' '}
                <span style={{ cursor: 'pointer' }} onClick={() => setShowFollowersModal(true)}>{profile.followers_count}</span>
              </p>
              <p className={styles.stats}>
                <strong>Following:</strong>{' '}
                <span style={{ cursor: 'pointer' }} onClick={() => setShowFollowingModal(true)}>{profile.following_count}</span>
              </p>

              {/* Conditional buttons for own profile or follow/unfollow */}
              {isOwnProfile ? (
                <>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className={styles.editBtn}
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className={`${styles.editBtn} ms-2`}
                    onClick={() => setShowAccountModal(true)}
                  >
                    View Account
                  </Button>
                </>
              ) : (
                <Button
                  variant={profile.is_following ? 'danger' : 'success'}
                  size="sm"
                  className="mt-3"
                  onClick={handleFollowToggle}
                >
                  {profile.is_following ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
          </Card>
        </Container>
      )}

      {/* Toast message if present */}
      {toast && (
        <Alert
          variant={toast.type}
          className="position-fixed top-0 end-0 m-3 shadow"
          onClose={() => setToast(null)}
          dismissible
          role="alert"
        >
          {toast.message}
        </Alert>
      )}

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit}>
        <Modal.Header closeButton aria-label="Close edit profile modal">
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
            <Form.Group controlId="image" className="mt-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleEditChange}
              />
              {imagePreview && (
                <div className="text-center mt-3">
                  <Image src={imagePreview} alt="Preview" roundedCircle width={100} height={100} />
                  <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>Preview</p>
                </div>
              )}
            </Form.Group>
            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" /> Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modals for followers, following, and account */}
      <FollowersListModal
        username={profile?.username}
        show={showFollowersModal}
        onHide={() => setShowFollowersModal(false)}
        onFollowBack={() => {
          setProfile(prev => ({
            ...prev,
            followers_count: prev.followers_count + 1
          }));
        }}
      />

      <FollowingListModal
        username={profile?.username}
        show={showFollowingModal}
        onHide={() => setShowFollowingModal(false)}
        onUnfollow={() => {
          setProfile(prev => ({
            ...prev,
            following_count: prev.following_count - 1
          }));
        }}
      />

      <AccountModal
        show={showAccountModal}
        onHide={() => setShowAccountModal(false)}
      />
    </>
  );
};

export default ProfilePage;
