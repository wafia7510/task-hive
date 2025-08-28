import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/NotFound.module.css";
import NavBar from "../components/NavBar"; // import your navbar

function NotFound() {
  return (
    <>
      <NavBar /> {/* ✅  navbar for navigation */}
      <div className={styles.container}>
        <h1 className={styles.heading}>404 - Page Not Found</h1>
        <p className={styles.text}>
          Sorry, the page you’re looking for doesn’t exist or may have been moved.
        </p>
        <Link to="/" className={styles.homeLink}>
          Go Back Home
        </Link>
      </div>
    </>
  );
}

export default NotFound;
