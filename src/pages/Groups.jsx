import React, { useState, useCallback } from 'react';
import { fetchGroups, createGroup, joinGroup, searchGroups } from '../services/api';
import GroupCard from '../components/GroupCard';
import { PageLoader, ErrorMessage, FormError, SuccessBanner } from '../components/UI';
import { useAsync } from '../hooks/useAsync';
import { Search, Users } from 'lucide-react';

const Groups = () => {
  const [activeMenu, setActiveMenu]   = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching]     = useState(false);
  const [joining, setJoining]         = useState(null);
  const [formError, setFormError]     = useState('');
  const [success, setSuccess]         = useState('');
  const [groupName, setGroupName]     = useState('');
  const [groupDesc, setGroupDesc]     = useState('');
  const [creating, setCreating]       = useState(false);

  const fetcher = useCallback(() => fetchGroups(), []);
  const { data: groups, loading, error, refetch } = useAsync(fetcher);

  const toggleMenu = (menu) => {
    setActiveMenu((m) => m === menu ? null : menu);
    setFormError('');
    setSuccess('');
    setSearchResults(null);
    setSearchQuery('');
    setGroupName('');
    setGroupDesc('');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setFormError('');
    try {
      const res = await searchGroups(searchQuery);
      setSearchResults(res);
    } catch (e) { setFormError(e.message); }
    finally { setSearching(false); }
  };

  const handleJoin = async (id) => {
    setJoining(id);
    setFormError('');
    try {
      await joinGroup(id);
      setSuccess('You have joined the group!');
      refetch();
    } catch (e) { setFormError(e.message); }
    finally { setJoining(null); }
  };

  const handleCreate = async () => {
    setCreating(true);
    setFormError('');
    try {
      const newGroup = await createGroup({ name: groupName, description: groupDesc });
      setSuccess(`Group "${newGroup.name}" created!`);
      setActiveMenu(null);
      refetch();
    } catch (e) { setFormError(e.message); }
    finally { setCreating(false); }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Study Groups</h1>
          <p className="page-subtitle">Collaborate and compete together</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => toggleMenu('join')} className="btn-primary" style={{ width: 'auto', background: activeMenu === 'join' ? 'var(--bg-surface-hover)' : 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            → Join group
          </button>
          <button onClick={() => toggleMenu('create')} className="btn-primary" style={{ width: 'auto' }}>
            + Create group
          </button>
        </div>
      </div>

      {success && <SuccessBanner message={success} />}
      {formError && <FormError message={formError} />}

      {activeMenu === 'join' && (
        <div className="card" style={{ marginBottom: '2rem', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem' }}>Find a group</h3>
            <span onClick={() => setActiveMenu(null)} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <Search size={16} />
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="Search by group name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{ margin: 0, paddingLeft: '2.5rem' }}
              />
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1.5rem' }} onClick={handleSearch} disabled={searching}>
              {searching ? 'Searching…' : 'Search'}
            </button>
          </div>
          {searchResults !== null && (
            searchResults.length === 0
              ? <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No groups found for "{searchQuery}".</p>
              : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
                  {searchResults.map((g) => <GroupCard key={g.id} group={g} onJoin={handleJoin} joining={joining} />)}
                </div>
              )
          )}
        </div>
      )}

      {activeMenu === 'create' && (
        <div className="card" style={{ marginBottom: '2rem', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem' }}>Create a new group</h3>
            <span onClick={() => setActiveMenu(null)} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Group name *</label>
            <input type="text" className="input-field" placeholder="Kenya Code Warriors" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Description <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>(optional)</span></label>
            <input type="text" className="input-field" placeholder="About your group…" value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} />
          </div>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1.25rem' }} onClick={handleCreate} disabled={creating}>
            {creating ? 'Creating…' : 'Create group'}
          </button>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {loading && <PageLoader />}
      
      {!loading && !error && groups?.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 2rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <Users size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <p>No groups yet. Be the first to create one!</p>
        </div>
      )}

      {!loading && !error && groups?.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '1.5rem',
          width: '100%'
        }}>
          {groups.map((g) => (
            <GroupCard key={g.id} group={g} onJoin={handleJoin} joining={joining} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;