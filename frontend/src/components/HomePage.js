import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faStickyNote, faUserFriends, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import NavBar from './NavBar';
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
  return (
    <>
      {/* Top Navigation Bar */}
      <NavBar />

      {/* 🟨 Hero Section */}
      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6}>
            <h2><strong>Organize Your Study Life with Ease</strong></h2>
            <p className="text-muted">
              TaskHive helps you stay on top of assignments, collaborate with peers, and take meaningful notes — all in one place.
            </p>
            <Button variant="primary" href="/register">Join Us</Button>
          </Col>

          {/* 🔗 Hero image with Cloudinary */}
          <Col md={6}>
            <img
              src="https://res.cloudinary.com/dotdnopux/image/upload/v1747318759/MyHero_qzvy3k.jpg"
              alt="TaskHive Hero"
              className={styles.heroImage}
            />
          </Col>
        </Row>
      </Container>

      {/* 🟩 How It Works Section */}
      <section className={styles.howItWorks}>
        <Container>
          <h3 className={`text-center ${styles.sectionTitle}`}>How It Works</h3>
          <Row className="text-center">
            {[
              {
                icon: faTasks,
                title: 'Create Tasks',
                desc: 'Stay focused with smart task management. Prioritize what matters.',
                link: '/tasks',
              },
              {
                icon: faStickyNote,
                title: 'Make Notes',
                desc: 'Write and organize notes connected to your goals or tasks.',
                link: '/notes',
              },
              {
                icon: faUserFriends,
                title: 'Follow Friends',
                desc: 'See what your friends are working on and stay motivated.',
                link: '/explore',
              },
              {
                icon: faCommentDots,
                title: 'Engage with Peers',
                desc: 'Like and comment on shared notes to build a learning network.',
                link: '/feed',
              },
            ].map((item, idx) => (
              <Col md={3} sm={6} xs={12} key={idx} className="mb-4">
                {/* 🔗 Entire card is a link to the section */}
                <a href={item.link} className="text-decoration-none text-dark">
                  <Card className={`${styles.cardBox} shadow-sm h-100`}>
                    <Card.Body>
                      <FontAwesomeIcon icon={item.icon} size="2x" className="mb-3" />
                      <h5><strong>{item.title}</strong></h5>
                      <p className="text-muted">{item.desc}</p>
                    </Card.Body>
                  </Card>
                </a>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 🟪 Call to Action Section */}
      <section
        className="text-white text-center py-5"
        style={{
          backgroundColor: 'transparent',
          boxShadow: '0 0 20px rgba(75, 0, 130, 0.5)' // Indigo shadow
        }}
      >
        <Container>
          <h2 style={{ color: 'indigo' }}>
            <strong>Ready to boost your productivity?</strong>
          </h2>
          <p className="mb-4" style={{ color: 'black' }}>
            Join TaskHive today and take control of your tasks, notes, and learning journey.
          </p>
          <Button href="/register" className="btn-indigo-filled me-3">Get Started</Button>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
