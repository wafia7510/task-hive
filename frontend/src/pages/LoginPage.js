import React, { useState } from 'react';
import { Form, Button, Container, Alert, Row, Col, Card } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import styles from '../styles/LoginPage.module.css';

const LoginPage = () => {
  // 🔐 Form state: username & password
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth(); // Get login function from auth context
  const navigate = useNavigate();

  // 🔄 Update form state on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🧾 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = await login(formData); // Call login API
    if (result.success) {
      setSuccess('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard
    } else {
      setError(result.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <>
      {/* 🔝 Navigation bar */}
      <NavBar />

      {/* 📦 Login Form Container */}
      <Container className="py-5" role="main" aria-labelledby="login-heading">
        <Row className="justify-content-center">
          <Col md={6}>
            {/* 🟣 Transparent login card */}
            <Card
              className={`shadow-sm ${styles.loginCard}`}
              style={{ backgroundColor: 'rgba(75, 0, 130, 0.4)' }}
              aria-label="Login card"
            >
              <Card.Body>
                {/* 🔑 Heading */}
                <h2 id="login-heading" className="mb-4 text-center text-white">
                  <FaSignInAlt className="me-2" aria-hidden="true" />
                  Login to TaskHive
                </h2>

                {/* 🚫 Error or ✅ Success alerts */}
                {error && <Alert variant="danger" role="alert">{error}</Alert>}
                {success && <Alert variant="success" role="alert">{success}</Alert>}

                {/* 📝 Login Form */}
                <Form onSubmit={handleSubmit} aria-label="Login form">
                  {/* Username Field */}
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
                      aria-label="Username"
                    />
                  </Form.Group>

                  {/* Password Field */}
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
                      aria-label="Password"
                    />
                  </Form.Group>

                  {/* 🔘 Login Button */}
                  <Button
                    variant="light"
                    type="submit"
                    className="w-100 fw-semibold"
                    aria-label="Submit login form"
                  >
                    Login
                  </Button>
                </Form>

                {/* 👤 Register Link */}
                <div className="mt-3 text-center">
                  <span className="text-white">Don&apos;t have an account? </span>
                  <Link
                    to="/register"
                    className="text-white text-decoration-underline"
                    aria-label="Go to registration page"
                  >
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
