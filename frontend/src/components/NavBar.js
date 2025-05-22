import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <Navbar expand="lg" className={`${styles.navbarCustom} shadow-sm`} variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className={styles.brandWhite}>TaskHive</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className={styles.navLink}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/tasks" className={styles.navLink}>Tasks</Nav.Link>
                <Nav.Link as={Link} to="/notes" className={styles.navLink}>Notes</Nav.Link>
                <Nav.Link as={Link} to="/feed" className={styles.navLink}>Feed</Nav.Link> {/* ✅ Feed link added */}
                <Nav.Link as={Link} to="/explore" className={styles.navLink}>Explore</Nav.Link>
                <Nav.Link as={Link} to="/profile" className={styles.navLink}>Profile</Nav.Link>
                <Button
                  onClick={handleLogout}
                  variant="outline-light"
                  size="sm"
                  className={`${styles.logoutButton} ms-3`}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className={styles.navLink}>Home</Nav.Link>
                <Nav.Link as={Link} to="/login" className={styles.navLink}>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className={styles.navLink}>Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
