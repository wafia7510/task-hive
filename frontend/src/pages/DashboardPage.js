import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import styles from '../styles/DashboardPage.module.css';
import { FaUsers } from 'react-icons/fa';
import dashboardBanner from '../assets/dash.png';

const DashboardPage = () => {
  const { user } = useAuth(); // Get the current logged-in user
  const [tasks, setTasks] = useState([]); // All tasks for the user
  const [notes, setNotes] = useState([]); // All notes for the user
  const [feedNotes, setFeedNotes] = useState([]); // Public notes from followed users
  const [loading, setLoading] = useState(true); // Data loading state
  const [error, setError] = useState(''); // Error state

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [tasksRes, notesRes, feedRes] = await Promise.all([
          axiosInstance.get('/tasks/', { headers: { Authorization: `Token ${token}` } }),
          axiosInstance.get('/notes/', { headers: { Authorization: `Token ${token}` } }),
          axiosInstance.get('/notes/feed/', { headers: { Authorization: `Token ${token}` } }),
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

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <>
        <NavBar />
        <div className="text-center mt-5" role="status" aria-live="polite">
          <Spinner animation="border" aria-label="Loading content" />
        </div>
      </>
    );
  }

  // Show error message if data failed to load
  if (error) {
    return (
      <>
        <NavBar />
        <Alert variant="danger" className="mt-4 text-center" role="alert">
          {error}
        </Alert>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container className={styles.dashboardContainer} aria-labelledby="dashboard-heading">
        {/* Welcome header */}
        <h2 id="dashboard-heading" className="text-center mb-4">
          👋 Welcome back, {user?.username}
        </h2>

        {/* Dashboard banner image */}
        <img
          src={dashboardBanner}
          alt="TaskHive dashboard banner"
          className={styles.bannerImage}
          aria-hidden="true"
        />

        {/* ======== RECENT TASKS SECTION ======== */}
        <section className={styles.sectionBox} aria-labelledby="tasks-heading">
          <h3 id="tasks-heading" className={styles.sectionTitle}>
            <Link to="/tasks" className="text-decoration-none text-dark" aria-label="Go to all tasks">
              🗂 Recent Tasks
            </Link>
          </h3>
          <Row className="mb-3">
            {tasks.length === 0 ? (
              <Col>
                <p className="text-muted" role="status">You have no tasks yet.</p>
              </Col>
            ) : (
              tasks.slice(0, 3).map((task) => (
                <Col md={4} className={styles.equalHeightCol} key={task.id}>
                  <Link to="/tasks" className="text-decoration-none text-reset" aria-label={`View task titled ${task.title}`}>
                    <Card className={`mb-3 ${styles.indigoCard} ${styles.fixedCardHeight}`}>
                      <Card.Body className={styles.cardFixed}>
                        <Card.Title>{task.title}</Card.Title>
                        <Card.Text className={styles.scrollableContent}>
                          Status: {task.status}<br />
                          Priority: {task.priority}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))
            )}
          </Row>
          <div className="text-end mb-2">
            <Link to="/tasks" className="btn btn-sm btn-primary" aria-label="View all tasks">
              View All Tasks
            </Link>
          </div>
        </section>

        {/* ======== RECENT NOTES SECTION ======== */}
        <section className={styles.sectionBox} aria-labelledby="notes-heading">
          <h3 id="notes-heading" className={styles.sectionTitle}>
            <Link to="/notes" className="text-decoration-none text-dark" aria-label="Go to all notes">
              📝 Recent Notes
            </Link>
          </h3>
          <Row>
            {notes.length === 0 ? (
              <Col>
                <p className="text-muted" role="status">You haven’t added any notes yet.</p>
              </Col>
            ) : (
              notes.slice(0, 3).map((note) => (
                <Col md={4} className={styles.equalHeightCol} key={note.id}>
                  <Link to="/notes" className="text-decoration-none text-reset" aria-label={`View note titled ${note.title}`}>
                    <Card className={`mb-3 ${styles.indigoCard} ${styles.fixedCardHeight}`}>
                      <Card.Body className={styles.cardFixed}>
                        <Card.Title>{note.title}</Card.Title>
                        <Card.Text className={styles.scrollableContent}>
                          {note.content}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))
            )}
          </Row>
          <div className="text-end mb-2">
            <Link to="/notes" className="btn btn-sm btn-success" aria-label="View all notes">
              View All Notes
            </Link>
          </div>
        </section>

        {/* ======== FEED SECTION ======== */}
        <section className={styles.sectionBox} aria-labelledby="feed-heading">
          <h3 id="feed-heading" className={styles.sectionTitle}>
            <Link to="/feed" className="text-decoration-none text-dark" aria-label="Go to feed page">
              <FaUsers className="me-1" /> Feed – Notes from Your Network
            </Link>
          </h3>
          <Row>
            {feedNotes.length === 0 ? (
              <Col>
                <p className="text-muted" role="status">No public notes from your network yet.</p>
              </Col>
            ) : (
              feedNotes.slice(0, 3).map((note) => (
                <Col md={4} className={styles.equalHeightCol} key={note.id}>
                  <Link to="/feed" className="text-decoration-none text-reset" aria-label={`View feed note titled ${note.title}`}>
                    <Card className={`mb-3 ${styles.indigoCard} ${styles.fixedCardHeight}`}>
                      <Card.Body className={styles.cardFixed}>
                        <Card.Title>{note.title}</Card.Title>
                        <Card.Subtitle className={styles.ownerText}>by {note.owner}</Card.Subtitle>
                        <Card.Text className={styles.scrollableContent}>
                          {note.content}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))
            )}
          </Row>
          <Row className="mt-2">
            <Col className="text-end">
              <Link to="/feed" className="btn btn-sm btn-info" aria-label="View all feed notes">
                View All Feed
              </Link>
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
};

export default DashboardPage;
