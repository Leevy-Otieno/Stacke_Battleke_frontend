import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

const STATUS_CONFIG = {
  Accepted:      { icon: <CheckCircle size={32} />, color: 'var(--primary-green)', label: 'Accepted' },
  'Wrong Answer':{ icon: <XCircle size={32} />,     color: '#EF4444',               label: 'Wrong Answer' },
  'Runtime Error':{ icon: <AlertTriangle size={32} />, color: '#F59E0B',            label: 'Runtime Error' },
};

const SubmissionResult = ({ result, onClose, onResubmit }) => {
  if (!result) return null;
  const cfg = STATUS_CONFIG[result.status] || STATUS_CONFIG['Runtime Error'];

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: '420px', animation: 'fadeIn 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-secondary)' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem' }}>
          <div style={{ color: cfg.color, display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            {cfg.icon}
          </div>
          <h2 style={{ fontSize: '1.25rem', color: cfg.color, marginBottom: '0.5rem' }}>{cfg.label}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {result.passed}/{result.total} test cases passed
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Points Earned', value: `+${result.points} pts`, color: result.points > 0 ? 'var(--primary-green)' : 'var(--text-secondary)' },
            { label: 'Runtime',       value: result.runtime,          color: 'var(--text-primary)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ backgroundColor: 'var(--bg-main)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{label}</div>
              <div style={{ fontWeight: '600', color }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onResubmit} className="btn-primary" style={{ flex: 1 }}>Try Again</button>
          <button onClick={onClose} className="btn-primary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;
