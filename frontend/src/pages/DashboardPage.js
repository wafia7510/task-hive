import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import styles from '../styles/DashboardPage.module.css';
import { FaUsers } from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [feedNotes, setFeedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [tasksRes, notesRes, feedRes] = await Promise.all([
          axiosInstance.get('/api/tasks/', {
            headers: { Authorization: `Token ${token}` },
          }),
          axiosInstance.get('/api/notes/', {
            headers: { Authorization: `Token ${token}` },
          }),
          axiosInstance.get('/api/notes/feed/', {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);
        setTasks(tasksRes.data);
        setNotes(notesRes.data);
        setFeedNotes(feedRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
                    <Card.Text>
                      Status: {task.status}<br />
                      Priority: {task.priority}
                    </Card.Text>
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

        {/* Feed Notes from Followers/Following */}
        <div className="mt-5">
          <h4><FaUsers /> Feed – Notes from Your Network</h4>
          <Row>
            {feedNotes.length === 0 ? (
              <Col>
                <p className="text-muted">No public notes from your network yet.</p>
              </Col>
            ) : (
              feedNotes.slice(0, 3).map((note) => (
                <Col md={4} key={note.id}>
                  <Card className="mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Title>{note.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">by {note.owner}</Card.Subtitle>
                      <Card.Text>{note.content.slice(0, 50)}...</Card.Text>
                      <Link to={`/notes/${note.id}`} className="btn btn-outline-info btn-sm">View Note</Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
          {feedNotes.length > 3 && (
            <Row className="mt-2">
              <Col className="text-end">
                <Link to="/feed" className="btn btn-sm btn-info">View More Feed</Link>
              </Col>
            </Row>
          )}
        </div>
      </Container>
    </>
  );
};

export default DashboardPage;
