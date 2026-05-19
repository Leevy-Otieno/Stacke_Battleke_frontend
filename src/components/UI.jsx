import React from 'react';

export const Spinner = ({ size = 24, style = {} }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid var(--border-color)`,
    borderTop: `2px solid var(--primary-green)`,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    ...style,
  }} />
);

export const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
    <Spinner size={32} />
  </div>
);

export const ErrorMessage = ({ message, onRetry }) => (
  <div style={{
    backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px', padding: '1rem 1.25rem', color: '#EF4444',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
  }}>
    <span style={{ fontSize: '0.875rem' }}>⚠ {message}</span>
    {onRetry && (
      <button onClick={onRetry} style={{ background: 'none', color: '#EF4444', fontSize: '0.75rem', textDecoration: 'underline' }}>
        Retry
      </button>
    )}
  </div>
);

export const EmptyState = ({ icon, title, subtitle }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', padding: '3rem 2rem' }}>
    <div style={{ marginBottom: '1rem', opacity: 0.4 }}>{icon}</div>
    <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h3>
    {subtitle && <p style={{ fontSize: '0.875rem', textAlign: 'center', maxWidth: '300px' }}>{subtitle}</p>}
  </div>
);

// Inline form-level error banner (red pill above a form)
export const FormError = ({ message }) =>
  message ? (
    <div style={{
      backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: '6px', padding: '0.6rem 1rem', color: '#EF4444',
      fontSize: '0.875rem', marginBottom: '1rem',
    }}>
      {message}
    </div>
  ) : null;

// Inline success banner
export const SuccessBanner = ({ message }) =>
  message ? (
    <div style={{
      backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
      borderRadius: '6px', padding: '0.6rem 1rem', color: 'var(--primary-green)',
      fontSize: '0.875rem', marginBottom: '1rem',
    }}>
      ✓ {message}
    </div>
  ) : null;
