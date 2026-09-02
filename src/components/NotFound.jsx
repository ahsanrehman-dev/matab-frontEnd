import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  // Inline styles object
  const styles = {
    notFoundPage: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
    },
    notFoundContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '3rem',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      width: '100%',
    },
    errorCode: {
      fontSize: '8rem',
      fontWeight: '900',
      color: '#3b82f6',
      lineHeight: 1,
      marginBottom: '1rem',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    notFoundContentH1: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1rem',
    },
    notFoundContentP: {
      fontSize: '1.2rem',
      color: '#64748b',
      marginBottom: '2rem',
      lineHeight: 1.6,
    },
    notFoundActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginBottom: '3rem',
    },
    btnPrimary: {
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '50px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      textDecoration: 'none',
      background: '#3b82f6',
      color: 'white',
    },
    btnSecondary: {
      padding: '1rem 2rem',
      border: '1px solid #e5e7eb',
      borderRadius: '50px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      textDecoration: 'none',
      background: '#f3f4f6',
      color: '#374151',
    },
    suggestions: {
      borderTop: '1px solid #e2e8f0',
      paddingTop: '2rem',
    },
    suggestionsH3: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '1rem',
    },
    suggestionLinks: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'center',
    },
    suggestionLink: {
      padding: '0.75rem 1.5rem',
      background: '#f8fafc',
      color: '#3b82f6',
      textDecoration: 'none',
      borderRadius: '25px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      border: '1px solid #e2e8f0',
    },
  };

  return (
    <div style={styles.notFoundPage}>
      <div style={styles.notFoundContent}>
        <div style={styles.errorCode}>404</div>
        <h1 style={styles.notFoundContentH1}>Page Not Found</h1>
        <p style={styles.notFoundContentP}>The page you're looking for doesn't exist or has been moved.</p>
        
        <div style={styles.notFoundActions}>
          <Link to="/" style={styles.btnPrimary}>
            <FiHome /> Go to Home
          </Link>
          <button onClick={() => window.history.back()} style={styles.btnSecondary}>
            <FiArrowLeft /> Go Back
          </button>
        </div>
        
        <div style={styles.suggestions}>
          <h3 style={styles.suggestionsH3}>You might be looking for:</h3>
          <div style={styles.suggestionLinks}>
            <Link to="/new-arrivals" style={styles.suggestionLink}>New Arrivals</Link>
            <Link to="/todays-deal" style={styles.suggestionLink}>Today's Deals</Link>
            <Link to="/category/all-products" style={styles.suggestionLink}>All Products</Link>
            <Link to="/products" style={styles.suggestionLink}>All Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 