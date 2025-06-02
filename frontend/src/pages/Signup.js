import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import styles from '../styles/Signup.module.css';

const Signup = () => {
  const { signup } = useAuth(); // 🔐 Access signup method from auth context
  const navigate = useNavigate(); // 🚀 Navigation hook

  // 🧾 Signup form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔄 Update form field values
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      const result = await signup(formData);

      if (result.success) {
        alert("Successfully registered!");
        navigate('/login');
      } else {
        setError(result.message || 'Failed to create an account');
      }

    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      setError('Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔝 Top Navigation Bar */}
      <NavBar />

      {/* 🧾 Signup Form Container */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            {/* 🟣 Transparent indigo card */}
            <Card
              className={`shadow-sm ${styles.card}`}
              style={{ backgroundColor: 'rgba(75, 0, 130, 0.4)' }}
              aria-label="Signup Card"
            >
              <Card.Body>
                <h3 className="text-center mb-4 text-white">Sign Up</h3>

                {/* 🔴 Error Message */}
                {error && <Alert variant="danger" aria-live="assertive">{error}</Alert>}

                {/* 📝 Registration Form */}
                <Form onSubmit={handleSubmit} aria-label="Signup Form">
                  <Row>
                    <Col>
                      <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label className="text-white">First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          required
                          aria-required="true"
                          aria-label="First Name"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label className="text-white">Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          required
                          aria-required="true"
                          aria-label="Last Name"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="text-white">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                      aria-required="true"
                      aria-label="Email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="text-white">Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      required
                      aria-required="true"
                      aria-label="Username"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="text-white">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                      aria-required="true"
                      aria-label="Password"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label className="text-white">Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      required
                      aria-required="true"
                      aria-label="Confirm Password"
                    />
                  </Form.Group>

                  {/* 🚀 Submit Button */}
                  <Button
                    disabled={loading}
                    variant="primary"
                    type="submit"
                    className="w-100"
                    aria-label="Submit registration form"
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </Form>

                {/* 🔁 Already have an account link */}
                <div className="mt-3 text-center">
                  <span className="text-white">Already a user? </span>
                  <Link to="/login" className="text-white text-decoration-underline" aria-label="Go to Login Page">
                    Sign In
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

export default Signup;
