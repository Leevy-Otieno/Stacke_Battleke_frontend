import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        backgroundColor: isSuccess ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
        border: `1px solid ${isSuccess ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
        borderRadius: '8px', padding: '0.75rem 1rem',
        color: isSuccess ? '#10B981' : '#EF4444',
        fontSize: '0.875rem', fontWeight: '500',
        zIndex: 3000, maxWidth: '360px',
        animation: 'fadeIn 0.2s ease-out',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {isSuccess ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span style={{ flex: 1, color: 'var(--text-primary)' }}>{toast.message}</span>
      <button onClick={onClose} style={{ background: 'none', color: 'var(--text-secondary)' }}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;