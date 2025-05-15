import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
//import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import styles from '../styles/Signup.module.css';

const Signup = () => {
  const { signup } = useAuth();
  //const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      await signup(formData); // Connect to your AuthContext method
      alert("Successful")
      //navigate('/dashboard'); // Redirect after successful signup
    } 
    catch (err) {
       console.error("Signup failed:", err.response?.data || err.message);
       setError('Failed to create an account')}
   finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className={`shadow-sm ${styles.card}`}>
              <Card.Body>
                <h3 className="text-center mb-4">Sign Up</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button
                    disabled={loading}
                    variant="primary"
                    type="submit"
                    className="w-100"
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signup;
