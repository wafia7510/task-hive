import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { axiosInstance } from '../api/axiosDefaults';

const AccountModal = ({ show, onHide }) => {
  // Local state for storing account details
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for spinner
  const [error, setError] = useState(''); // Error state for fetching issues

  // Fetch account details only when modal is shown
  useEffect(() => {
    if (show) {
      const fetchAccount = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('authToken');
          const headers = { Authorization: `Token ${token}` };
          const response = await axiosInstance.get('/accounts/me/', { headers });
          setAccount(response.data); // Store retrieved account info
        } catch (err) {
          console.error(err);
          setError('Failed to load account details.'); // Handle API errors
        } finally {
          setLoading(false); // Stop spinner in all cases
        }
      };

      fetchAccount();
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="account-modal-title"
      aria-describedby="account-modal-body"
    >
      {/* Modal Header */}
      <Modal.Header closeButton aria-label="Close account modal">
        <Modal.Title id="account-modal-title">Account Details</Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body id="account-modal-body">
        {loading ? (
          // Spinner shown while loading data
          <div className="text-center my-4" aria-label="Loading account details">
            <Spinner animation="border" role="status" aria-hidden="true" />
          </div>
        ) : error ? (
          // Show error message if fetch fails
          <Alert variant="danger" aria-live="polite">{error}</Alert>
        ) : (
          // Render account data
          <div>
            <p><strong>ID:</strong> {account.id}</p>
            <p><strong>Username:</strong> {account.username}</p>
            <p><strong>First Name:</strong> {account.first_name || 'N/A'}</p>
            <p><strong>Last Name:</strong> {account.last_name || 'N/A'}</p>
            <p><strong>Email:</strong> {account.email}</p>
          </div>
        )}
      </Modal.Body>

      {/* Modal Footer */}
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} aria-label="Close account details modal">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Prop validation for component
AccountModal.propTypes = {
  show: PropTypes.bool.isRequired,      // Whether modal is visible
  onHide: PropTypes.func.isRequired,    // Function to close modal
};

export default AccountModal;
