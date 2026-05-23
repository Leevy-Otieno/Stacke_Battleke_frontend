// src/pages/admin/AdminSubmissions.jsx
// View all submissions with:
// - Filter by status, language, challenge title (debounced search)
// - View submitted code in a modal
// - Delete submission (with confirmation)
// - Rejudge submission (re-triggers backend judge)
// - Pagination
import { useState, useCallback, useEffect } from 'react';
import { Search, Eye, Trash2, RefreshCw, X } from 'lucide-react';
import { PageLoader, ErrorMessage } from '../../components/UI';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchAdminSubmissions, adminDeleteSubmission, adminRejudgeSubmission } from '../../services/api';

const STATUS_COLORS = {
  Accepted: { bg: 'rgba(16,185,129,0.1)',  color: '#10B981' },
  Passed:   { bg: 'rgba(16,185,129,0.1)',  color: '#10B981' },
  'Wrong Answer': { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
  Failed:   { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
  'Runtime Error': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
};

const PER_PAGE = 15;

const AdminSubmissions = () => {
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [langFilter, setLang]       = useState('all');
  const [page, setPage]             = useState(1);
  const [toast, setToast]           = useState(null);
  const [codeModal, setCodeModal]   = useState(null); // { code, language, username, challenge }
  const [deleteModal, setDeleteModal] = useState(null);
  const [actionId, setActionId]     = useState(null); // tracks which row is mid-action

  const debSearch = useDebounce(search, 350);

  const loader = useCallback(
    () => fetchAdminSubmissions({
      search: debSearch,
      status: statusFilter === 'all' ? undefined : statusFilter,
      language: langFilter === 'all' ? undefined : langFilter,
      page, perPage: PER_PAGE,
    }),
    [debSearch, statusFilter, langFilter, page]
  );

  const { data, loading, error, refetch } = useAsync(loader, [debSearch, statusFilter, langFilter, page]);

  useEffect(() => { setPage(1); }, [debSearch, statusFilter, langFilter]);

  const subs       = data?.items || data || [];
  const totalPages  = data?.pages || 1;

  const handleDelete = async () => {
    try {
      await adminDeleteSubmission(deleteModal.id);
      setToast({ type: 'success', message: 'Submission deleted.' });
      setDeleteModal(null);
      refetch();
    } catch (e) {
      setToast({ type: 'error', message: e.message });
    }
  };

  const handleRejudge = async (id) => {
    setActionId(id);
    try {
      await adminRejudgeSubmission(id);
      setToast({ type: 'success', message: 'Rejudge queued successfully.' });
      refetch();
    } catch (e) {
      setToast({ type: 'error', message: e.message });
    } finally {
      setActionId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {deleteModal && (
        <ConfirmModal
          title="Delete Submission?"
          message="This submission will be permanently removed. The user will lose associated points."
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
        />
      )}

      {/* Code viewer modal */}
      {codeModal && (
        <div
          onClick={() => setCodeModal(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', padding: '1.5rem', width: '100%', maxWidth: '700px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.15s ease-out' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ color: '#e6edf3', fontWeight: '600', fontSize: '0.95rem' }}>{codeModal.username} → {codeModal.challenge}</h3>
                <span style={{ fontSize: '0.75rem', color: '#8b949e', fontFamily: 'monospace' }}>{codeModal.language}</span>
              </div>
              <button onClick={() => setCodeModal(null)} style={{ background: 'none', color: '#8b949e' }}><X size={18} /></button>
            </div>
            <pre style={{ flex: 1, overflowY: 'auto', backgroundColor: '#161b22', borderRadius: '6px', padding: '1rem', color: '#c9d1d9', fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: '0.875rem', lineHeight: '1.6', border: '1px solid #30363d', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {codeModal.code || '// No code available'}
            </pre>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Submissions</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Review and moderate all code submissions</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text" placeholder="Search user or challenge…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '7px', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', width: '220px' }}
          />
        </div>
        <FilterSelect value={statusFilter} onChange={setStatus} options={[
          { value: 'all', label: 'All Statuses' },
          { value: 'Accepted', label: 'Accepted' },
          { value: 'Wrong Answer', label: 'Wrong Answer' },
          { value: 'Runtime Error', label: 'Runtime Error' },
        ]} />
        <FilterSelect value={langFilter} onChange={setLang} options={[
          { value: 'all', label: 'All Languages' },
          { value: 'python', label: 'Python' },
          { value: 'javascript', label: 'JavaScript' },
        ]} />
      </div>

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {/* Table */}
      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                {['User', 'Challenge', 'Language', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}><PageLoader /></td></tr>
              ) : subs.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No submissions found.</td></tr>
              ) : subs.map((s) => {
                const sc = STATUS_COLORS[s.status] || { bg: 'rgba(148,163,184,0.08)', color: '#94A3B8' };
                const isActing = actionId === s.id;
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                    onMouseOut={(e)  => e.currentTarget.style.backgroundColor = 'transparent'}>

                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: '500' }}>{s.user?.name || s.username || '—'}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.challenge?.title || s.challenge_title || '—'}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {s.language}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '600', backgroundColor: sc.bg, color: sc.color }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {s.created_at ? new Date(s.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) : '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <ActionBtn icon={<Eye size={15} />} title="View Code" color="#60A5FA"
                          onClick={() => setCodeModal({ code: s.code, language: s.language, username: s.user?.name || s.username, challenge: s.challenge?.title || s.challenge_title })}
                        />
                        <ActionBtn icon={<RefreshCw size={15} />} title="Rejudge" color="#10B981" onClick={() => handleRejudge(s.id)} disabled={isActing} />
                        <ActionBtn icon={<Trash2 size={15} />} title="Delete" color="#EF4444" onClick={() => setDeleteModal(s)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={pagerBtn}>←</button>
            Page {page} of {totalPages}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pagerBtn}>→</button>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterSelect = ({ value, onChange, options }) => (
  <select
    value={value} onChange={(e) => onChange(e.target.value)}
    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '7px', color: 'var(--text-primary)', padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none' }}
  >
    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const ActionBtn = ({ icon, title, color, onClick, disabled }) => (
  <button title={title} onClick={onClick} disabled={disabled}
    style={{ padding: '0.4rem', borderRadius: '6px', background: 'none', color, border: '1px solid transparent', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}
    onMouseOver={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = `${color}18`; }}
    onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = 'transparent'; }}
  >{icon}</button>
);

const pagerBtn = { background: 'none', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.25rem 0.6rem', color: 'var(--text-secondary)', cursor: 'pointer' };

export default AdminSubmissions;