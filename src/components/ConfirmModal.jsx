
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) => (
  // Backdrop
  <div
    onClick={onCancel}
    style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '420px',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={22} color={danger ? '#EF4444' : '#F59E0B'} />
          <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{title}</h3>
        </div>
        <button onClick={onCancel} style={{ background: 'none', color: 'var(--text-secondary)' }}>
          <X size={18} />
        </button>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
        {message}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '0.5rem 1.25rem', borderRadius: '6px',
            background: 'transparent', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.875rem',
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: '0.5rem 1.25rem', borderRadius: '6px',
            backgroundColor: danger ? '#EF4444' : 'var(--primary-green)',
            color: '#fff', fontWeight: '600', fontSize: '0.875rem',
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;