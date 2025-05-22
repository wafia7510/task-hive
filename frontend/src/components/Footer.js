import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaEnvelope
} from 'react-icons/fa';
import styles from '../styles/Footer.module.css'; // ✅ Import CSS Module

const Footer = () => {
  return (
    <footer className={`${styles.footer} text-light py-4 mt-5`}>
      <Container>
        <Row className="mb-3 text-center text-md-left">
          <Col md={4}>
            <h5 className={styles.footerTitle}>TaskHive</h5>
            <p className={styles.footerText}>
              Manage tasks & notes. Stay productive. Stay inspired.
            </p>
          </Col>

          <Col md={4}>
            <h6 className={styles.footerSubtitle}>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className={styles.footerLink}>Home</Link></li>
              <li><Link to="/dashboard" className={styles.footerLink}>Dashboard</Link></li>
              <li><Link to="/tasks" className={styles.footerLink}>Tasks</Link></li>
              <li><Link to="/notes" className={styles.footerLink}>Notes</Link></li>
              <li><Link to="/explore" className={styles.footerLink}>Explore</Link></li>
            </ul>
          </Col>

          <Col md={4} className="d-flex flex-column align-items-center">
            <h6 className={styles.footerSubtitle}>Connect with us</h6>
            <div className="d-flex justify-content-center flex-wrap">
                <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.footerIcon}>
                <FaGithub size={22} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.footerIcon}>
                <FaLinkedin size={22} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className={styles.footerIcon}>
                <FaTwitter size={22} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.footerIcon}>
                <FaInstagram size={22} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.footerIcon}>
                <FaFacebook size={22} />
                </a>
                <a href="mailto:wafiadr2@gmail.com" className={styles.footerIcon}>
                <FaEnvelope size={22} />
                </a>
            </div>
        </Col>

        </Row>

        <hr className={styles.footerDivider} />
        <p className={`text-center small mb-0 ${styles.footerTextMuted}`}>
          © {new Date().getFullYear()} TaskHive. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
