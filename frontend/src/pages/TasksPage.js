import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Alert, Badge, Modal,
} from 'react-bootstrap';
import { axiosInstance } from '../api/axiosDefaults';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import styles from '../styles/TasksPage.module.css';
import taskBanner from '../assets/task_banner.jpg'; // 🔁 Add your image in public/assets or src/assets

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '' });
  const [editTaskId, setEditTaskId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const params = { search, priority: filterPriority, status: filterStatus };
      const response = await axiosInstance.get('/api/tasks/', {
        headers: { Authorization: `Token ${token}` },
        params,
      });
      setTasks(response.data);
    } catch (error) {
      setErrorMsg('Failed to fetch tasks.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filterPriority, filterStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      if (editTaskId) {
        await axiosInstance.put(`/api/tasks/${editTaskId}/`, form, {
          headers: { Authorization: `Token ${token}` },
        });
        setSuccessMsg('Task updated!');
      } else {
        await axiosInstance.post('/api/tasks/', form, {
          headers: { Authorization: `Token ${token}` },
        });
        setSuccessMsg('Task created!');
      }
      setForm({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '' });
      setEditTaskId(null);
      setModalOpen(false);
      fetchTasks();
    } catch {
      setErrorMsg('Something went wrong.');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.delete(`/api/tasks/${taskId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setSuccessMsg('Task deleted.');
      fetchTasks();
    } catch {
      setErrorMsg('Failed to delete task.');
    }
  };

  const openEditModal = (task) => {
    setForm({ ...task });
    setEditTaskId(task.id);
    setModalOpen(true);
  };

  const isOverdue = (dueDate) => dueDate && new Date(dueDate) < new Date();

  return (
    <>
      <NavBar />
      <div className={styles.banner} style={{ backgroundImage: `url(${taskBanner})` }}>
        <h2 className={styles.bannerText}>📋 Manage You Task </h2>
      </div>

      <Container className="my-4">
        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        {/* Filters */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Control placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </Col>
          <Col md={3}>
            <Form.Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button onClick={() => setModalOpen(true)} className="w-100">+ New Task</Button>
          </Col>
        </Row>

        {/* Task Cards */}
        <Row>
          {tasks.length === 0 ? (
            <p className="text-muted">No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <Col md={4} key={task.id}>
                <Card className="mb-3 shadow-sm">
                  <Card.Body>
                    <Card.Title>
                      {task.title}
                      {isOverdue(task.due_date) && <Badge bg="danger" className="ms-2">Overdue</Badge>}
                    </Card.Title>
                    <Card.Text>
                        <strong>Priority:</strong> {task.priority}<br />
                        <strong>Status:</strong> {task.status}<br />
                        <strong>Due:</strong> {task.due_date || 'N/A'}<br />
                        <strong>Created:</strong> {new Date(task.created_at).toLocaleString()}<br />
                        <strong>Updated:</strong> {new Date(task.updated_at).toLocaleString()}
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button size="sm" variant="outline-primary" onClick={() => openEditModal(task)}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(task.id)}>Delete</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>

      {/* Modal for Create/Edit */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editTaskId ? 'Edit Task' : 'Create Task'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={form.title}
                required
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Form.Group>
            <Row className="mt-2">
              <Col>
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </Form.Select>
              </Col>
            </Row>
            <Form.Group className="mt-2">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={form.due_date || ''}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{editTaskId ? 'Save Changes' : 'Create Task'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default TasksPage;
