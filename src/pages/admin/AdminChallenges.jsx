
import { useState, useCallback, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Code } from 'lucide-react';
import { PageLoader, ErrorMessage } from '../../components/UI';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import ChallengeForm from './ChallengeForm';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import {
  fetchAdminChallenges, adminCreateChallenge, adminUpdateChallenge, deleteChallenge,
} from '../../services/api';

const DIFF_COLORS = {
  Easy:   { bg: 'rgba(16,185,129,0.1)',  color: '#10B981' },
  Medium: { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B' },
  Hard:   { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
};

const PER_PAGE = 12;

const AdminChallenges = () => {
  const [search, setSearch]       = useState('');
  const [diffFilter, setDiff]     = useState('all');
  const [page, setPage]           = useState(1);
  const [toast, setToast]         = useState(null);
  const [modal, setModal]         = useState(null);
  const [saving, setSaving]       = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const loader = useCallback(
    () => fetchAdminChallenges({ search: debouncedSearch, difficulty: diffFilter === 'all' ? undefined : diffFilter, page, perPage: PER_PAGE }),
    [debouncedSearch, diffFilter, page]
  );

  const { data, loading, error, refetch } = useAsync(loader, [debouncedSearch, diffFilter, page]);

  useEffect(() => { setPage(1); }, [debouncedSearch, diffFilter]);

  const challenges = data?.items || data || [];
  const totalPages  = data?.pages || 1;

  // ---- Handlers ----

  const openCreate = () => setModal({ type: 'create' });
  const openEdit   = (c)  => setModal({ type: 'edit', challenge: c });
  const openDelete = (c)  => setModal({ type: 'delete', challenge: c });

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (modal.type === 'create') {
        await adminCreateChallenge(formData);
        setToast({ type: 'success', message: 'Challenge created successfully.' });
      } else {
        await adminUpdateChallenge(modal.challenge.id, formData);
        setToast({ type: 'success', message: 'Challenge updated.' });
      }
      setModal(null);
      refetch();
    } catch (e) {
      setToast({ type: 'error', message: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteChallenge(modal.challenge.id);
      setToast({ type: 'success', message: 'Challenge deleted.' });
      setModal(null);
      refetch();
    } catch (e) {
      setToast({ type: 'error', message: e.message });
    }
  };

  const handlePublishToggle = async (c) => {
    try {
      await adminUpdateChallenge(c.id, { is_published: !c.is_published });
      setToast({ type: 'success', message: c.is_published ? 'Challenge unpublished.' : 'Challenge published.' });
      refetch();
    } catch (e) {
      setToast({ type: 'error', message: e.message });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Delete confirm modal */}
      {modal?.type === 'delete' && (
        <ConfirmModal
          title="Delete Challenge?"
          message={`"${modal.challenge.title}" and all its test cases will be permanently deleted. Submissions will remain but may lose context.`}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}

      {/* Create / Edit modal overlay */}
      {(modal?.type === 'create' || modal?.type === 'edit') && (
        <div
          onClick={() => setModal(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', animation: 'fadeIn 0.15s ease-out' }}
          >
            <h2 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              {modal.type === 'create' ? '+ New Challenge' : `Edit: ${modal.challenge.title}`}
            </h2>
            <ChallengeForm
              initialData={modal.challenge ? {
                ...modal.challenge,
                testCases: modal.challenge.test_cases || modal.challenge.testCases || [{ input: '', expected_output: '', is_hidden: false }],
              } : undefined}
              onSubmit={handleSave}
              onCancel={() => setModal(null)}
              loading={saving}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Challenges</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Create and manage coding challenges</p>
        </div>
        <button
          onClick={openCreate}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '7px', backgroundColor: '#10B981', color: '#fff', fontWeight: '600', fontSize: '0.875rem' }}
        >
          <Plus size={16} /> New Challenge
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text" placeholder="Search challenges…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '7px', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', width: '220px' }}
          />
        </div>
        <select
          value={diffFilter} onChange={(e) => setDiff(e.target.value)}
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '7px', color: 'var(--text-primary)', padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none' }}
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {/* Table */}
      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                {['Challenge', 'Difficulty', 'Points', 'Submissions', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}><PageLoader /></td></tr>
              ) : challenges.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No challenges found.</td></tr>
              ) : challenges.map((c) => {
                const dc = DIFF_COLORS[c.difficulty] || DIFF_COLORS.Easy;
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                    onMouseOut={(e)  => e.currentTarget.style.backgroundColor = 'transparent'}>

                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.4rem', backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: '6px', color: '#10B981' }}>
                          <Code size={15} />
                        </div>
                        <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{c.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '600', backgroundColor: dc.bg, color: dc.color }}>
                        {c.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#10B981', fontWeight: '600' }}>+{c.points_reward ?? c.points} pts</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{c.submission_count ?? 0}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <button
                        onClick={() => handlePublishToggle(c)}
                        title={c.is_published ? 'Unpublish' : 'Publish'}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', fontSize: '0.72rem', fontWeight: '600', borderRadius: '999px', padding: '0.2rem 0.6rem', border: '1px solid transparent',
                          color: c.is_published ? '#10B981' : '#94A3B8',
                          backgroundColor: c.is_published ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.08)',
                        }}
                      >
                        {c.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {c.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <ActionBtn icon={<Edit size={15} />} title="Edit" color="#60A5FA" onClick={() => openEdit(c)} />
                        <ActionBtn icon={<Trash2 size={15} />} title="Delete" color="#EF4444" onClick={() => openDelete(c)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

const ActionBtn = ({ icon, title, color, onClick }) => (
  <button title={title} onClick={onClick}
    style={{ padding: '0.4rem', borderRadius: '6px', background: 'none', color, border: '1px solid transparent', cursor: 'pointer' }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = `${color}18`}
    onMouseOut={(e)  => e.currentTarget.style.backgroundColor = 'transparent'}
  >{icon}</button>
);

const pagerBtn = { background: 'none', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.25rem 0.6rem', color: 'var(--text-secondary)', cursor: 'pointer' };

export default AdminChallenges;