import React, { useState } from 'react';
import { Form, Button, Container, Alert, Row, Col, Card } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import styles from '../styles/LoginPage.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔄 Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔐 Submit login credentials
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await login(formData);
      setSuccess('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <>
      {/* 🔝 Navigation bar */}
      <NavBar />

      {/* 🧾 Login Form Container */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            {/* 💠 Transparent indigo card */}
            <Card
              className={`shadow-sm ${styles.loginCard}`}
              style={{ backgroundColor: 'rgba(75, 0, 130, 0.4)' }}
            >
              <Card.Body>
                <h2 className="mb-4 text-center text-white">
                  <FaSignInAlt className="me-2" />
                  Login to TaskHive
                </h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {/* 📝 Login Form */}
                <Form onSubmit={handleSubmit} aria-label="Login Form">
                  <Form.Group controlId="username" className="mb-3">
                    <Form.Label className="text-white">Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                      aria-required="true"
                    />
                  </Form.Group>

                  <Form.Group controlId="password" className="mb-4">
                    <Form.Label className="text-white">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      aria-required="true"
                    />
                  </Form.Group>

                  <Button variant="light" type="submit" className="w-100 fw-semibold">
                    Login
                  </Button>
                </Form>

                {/* 👤 Register link */}
                <div className="mt-3 text-center">
                  <span className="text-white">Don't have an account? </span>
                  <Link to="/register" className="text-white text-decoration-underline">
                    Create Account
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;
