import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
    <div style={{ fontSize: '5rem', fontWeight: '800', color: 'var(--primary-green)', lineHeight: 1, marginBottom: '1rem' }}>404</div>
    <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Page not found</h1>
    <p style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '0.75rem 2rem', textDecoration: 'none' }}>
      Go home
    </Link>
  </div>
);

export default NotFound;
