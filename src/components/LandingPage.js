import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <motion.div 
      className="landing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hero-section">
        <h1>Page Replacement Algorithm Simulator</h1>
        <p className="subtitle">Visualize and understand different page replacement algorithms in action</p>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h2>What are Page Replacement Algorithms?</h2>
          <p>
            Page replacement algorithms are used in operating systems to manage memory efficiently.
            They determine which pages to remove from memory when new pages need to be loaded.
          </p>
        </div>

        <div className="feature-card">
          <h2>Available Algorithms</h2>
          <ul>
            <li>First In First Out (FIFO)</li>
            <li>Least Recently Used (LRU)</li>
            <li>Optimal Page Replacement</li>
          </ul>
        </div>

        <div className="feature-card">
          <h2>Try it Now!</h2>
          <p>Experience the simulation with different algorithms and see how they perform.</p>
          <Link to="/simulator" className="cta-button">
            Launch Simulator
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage; 