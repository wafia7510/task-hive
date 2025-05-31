import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const { user, logout } = useAuth(); // Get authenticated user and logout method
  const navigate = useNavigate();
  const location = useLocation(); // Current path for active link styling

  // Handle logout and navigate to login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar
      expand="lg"
      className={`${styles.navbarCustom} shadow-sm fixed-top`}
      variant="dark"
      aria-label="Main navigation"
    >
      <Container>
        {/* Brand link to homepage */}
        <Navbar.Brand as={Link} to="/" className={styles.brandWhite}>
          TaskHive
        </Navbar.Brand>

        {/* Toggler for collapsed navigation on mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {user ? (
              <>
                {/* Navigation for authenticated users */}
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`${styles.navLink} ${location.pathname === '/' ? styles.activeLink : ''}`}
                  aria-label="Go to Home"
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.activeLink : ''}`}
                  aria-label="Go to Dashboard"
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/tasks"
                  className={`${styles.navLink} ${location.pathname === '/tasks' ? styles.activeLink : ''}`}
                  aria-label="Go to Tasks"
                >
                  Tasks
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/notes"
                  className={`${styles.navLink} ${location.pathname === '/notes' ? styles.activeLink : ''}`}
                  aria-label="Go to Notes"
                >
                  Notes
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/feed"
                  className={`${styles.navLink} ${location.pathname === '/feed' ? styles.activeLink : ''}`}
                  aria-label="Go to Feed"
                >
                  Feed
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/explore"
                  className={`${styles.navLink} ${location.pathname === '/explore' ? styles.activeLink : ''}`}
                  aria-label="Go to Explore"
                >
                  Explore
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className={`${styles.navLink} ${location.pathname === '/profile' ? styles.activeLink : ''}`}
                  aria-label="Go to Profile"
                >
                  Profile
                </Nav.Link>

                {/* Logout button for authenticated users */}
                <Button
                  onClick={handleLogout}
                  variant="outline-light"
                  size="sm"
                  className={`${styles.logoutButton} ms-3`}
                  aria-label="Log out of your account"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Navigation for guests (unauthenticated users) */}
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`${styles.navLink} ${location.pathname === '/' ? styles.activeLink : ''}`}
                  aria-label="Go to Home"
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`${styles.navLink} ${location.pathname === '/login' ? styles.activeLink : ''}`}
                  aria-label="Go to Login"
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  className={`${styles.navLink} ${location.pathname === '/register' ? styles.activeLink : ''}`}
                  aria-label="Go to Signup"
                >
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
