import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import styles from '../styles/DashboardPage.module.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [tasksRes, notesRes] = await Promise.all([
          axiosInstance.get('/api/tasks/', {
            headers: { Authorization: `Token ${token}` },
          }),
          axiosInstance.get('/api/notes/', {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);
        setTasks(tasksRes.data);
        setNotes(notesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = () => {
    // basic search filtering
    const lowerSearch = searchTerm.toLowerCase();
    if (filterType === 'task') {
      setTasks((prev) => prev.filter((task) => task.title.toLowerCase().includes(lowerSearch)));
    } else if (filterType === 'note') {
      setNotes((prev) => prev.filter((note) => note.title.toLowerCase().includes(lowerSearch)));
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <Alert variant="danger" className="mt-4 text-center">{error}</Alert>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container className={styles.dashboardContainer}>
        <h2 className="text-center mb-4">👋 Welcome back, {user?.username}</h2>

        {/* Dashboard Image Placeholder */}
        <div className={styles.imageBox}>Dashboard</div>

        {/* Search and Filter Section */}
        <Row className="align-items-center mb-4">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md="auto">
            <Form.Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Filter By</option>
              <option value="task">Task</option>
              <option value="note">Note</option>
            </Form.Select>
          </Col>
          <Col md="auto">
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
          </Col>
        </Row>

        {/* Recent Tasks */}
        <h4>🗂 Recent Tasks</h4>
        <Row className="mb-3">
          {tasks.length === 0 ? (
            <Col>
              <p className="text-muted">You have no tasks yet. Start by creating one!</p>
            </Col>
          ) : (
            tasks.slice(0, 3).map((task) => (
              <Col md={4} key={task.id}>
                <Card className="mb-3 shadow-sm">
                  <Card.Body>
                    <Card.Title>{task.title}</Card.Title>
                    <Card.Text>Status: {task.status}<br />Priority: {task.priority}</Card.Text>
                    <Link to={`/tasks/${task.id}`} className="btn btn-outline-primary btn-sm">View Task</Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
        {tasks.length > 3 && (
          <div className="text-end mb-4">
            <Link to="/tasks" className="btn btn-sm btn-primary">View More Tasks</Link>
          </div>
        )}

        {/* Recent Notes */}
        <h4>📝 Recent Notes</h4>
        <Row>
          {notes.length === 0 ? (
            <Col>
              <p className="text-muted">You haven’t added any notes yet.</p>
            </Col>
          ) : (
            notes.slice(0, 3).map((note) => (
              <Col md={4} key={note.id}>
                <Card className="mb-3 shadow-sm">
                  <Card.Body>
                    <Card.Title>{note.title}</Card.Title>
                    <Card.Text>{note.content.slice(0, 50)}...</Card.Text>
                    <Link to={`/notes/${note.id}`} className="btn btn-outline-success btn-sm">View Note</Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
        {notes.length > 3 && (
          <div className="text-end mb-4">
            <Link to="/notes" className="btn btn-sm btn-success">View More Notes</Link>
          </div>
        )}
      </Container>
    </>
  );
};

export default DashboardPage;
