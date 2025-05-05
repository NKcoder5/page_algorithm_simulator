import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import PageReplacementSimulator from './components/PageReplacementSimulator';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/simulator" className="nav-link">Page Replacement Simulator</Link>
          </motion.div>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/simulator" element={<PageReplacementSimulator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
