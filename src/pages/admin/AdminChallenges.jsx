import React, { useState, useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { fetchChallenges, deleteChallenge } from '../../services/api';
import { PageLoader, ErrorMessage, SuccessBanner, FormError } from '../../components/UI';
import { Code2, Trash2, Edit3, Search, Plus } from 'lucide-react';
import { getDifficultyColor } from '../../utils/helpers';

const AdminChallenges = () => {
  const fetcher = useCallback(() => fetchChallenges("all"), []);
  const { data: initialChallenges, loading, error, refetch } = useAsync(fetcher);
  
  const [challenges, setChallenges] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);

  React.useEffect(() => {
    if (initialChallenges) setChallenges(initialChallenges);
  }, [initialChallenges]);

  const handleDelete = async (challenge) => {
    if (!window.confirm(`Are you sure you want to delete "${challenge.title}"? This will hide it from students.`)) {
      return;
    }

    setProcessingId(challenge.id);
    setActionError('');
    setActionSuccess('');

    try {
      await deleteChallenge(challenge.id);
      
      // Optimistically remove from UI
      setChallenges(prev => prev.filter(c => c.id !== challenge.id));
      setActionSuccess(`Challenge "${challenge.title}" deleted successfully.`);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const filteredChallenges = (challenges || []).filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Challenge Management</h1>
          <p className="page-subtitle">Create, edit, and remove coding problems</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '250px' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Search size={16} />
            </div>
            <input
              type="text"
              className="input-field"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ margin: 0, paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> New Challenge
          </button>
        </div>
      </div>

      <FormError message={actionError} />
      <SuccessBanner message={actionSuccess} />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Problem</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Difficulty</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Points</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Hidden Tests</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredChallenges.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem', borderRadius: '6px', color: 'var(--text-secondary)' }}>
                      <Code2 size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.time}</div>
                    </div>
                  </div>
                </td>
                
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span className={`badge ${getDifficultyColor(c.difficulty)}`}>
                    {c.difficulty}
                  </span>
                </td>
                
                <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--primary-green)' }}>
                  +{c.points}
                </td>
                
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  🔒 {c.hiddenTests} cases
                </td>
                
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button 
                      className="btn-primary" 
                      style={{ width: 'auto', padding: '0.4rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                      title="Edit Challenge"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(c)}
                      disabled={processingId === c.id}
                      className="btn-primary" 
                      style={{ width: 'auto', padding: '0.4rem', background: 'transparent', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                      title="Delete Challenge"
                    >
                      {processingId === c.id ? '...' : <Trash2 size={16} />}
                    </button>
                  </div>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredChallenges.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No challenges found. Click "New Challenge" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChallenges;