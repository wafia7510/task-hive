import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className={`${styles.navbarCustom} shadow-sm`} variant="dark">
      <Container>
        <Navbar.Brand href="/" className={styles.brandWhite}>TaskHive</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {user ? (
              <>
                <Nav.Link href="/dashboard" className={styles.navLink}>Dashboard</Nav.Link>
                <Nav.Link href="/tasks" className={styles.navLink}>Tasks</Nav.Link>
                <Nav.Link href="/notes" className={styles.navLink}>Notes</Nav.Link>
                <Nav.Link href="/profile" className={styles.navLink}>Profile</Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className={`${styles.logoutButton}`}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link href="/" className={styles.navLink}>Home</Nav.Link>
                <Nav.Link href="/login" className={styles.navLink}>Login</Nav.Link>
                <Nav.Link href="/register" className={styles.navLink}>Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
