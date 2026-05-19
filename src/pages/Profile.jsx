import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, CheckCircle, Code, Save, X } from 'lucide-react';
import { FormError, SuccessBanner } from '../components/UI';

const INSTITUTIONS = [
  'Moringa School', 'ALX Africa', 'Andela', 'University of Nairobi',
  'Strathmore University', 'JKUAT', 'Other',
];

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName]             = useState(user?.name || '');
  const [email, setEmail]           = useState(user?.email || '');
  const [institution, setInstitution] = useState(user?.institution || 'Moringa School');
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');
  const [success, setSuccess]       = useState('');

  const handleSave = async () => {
    setSaving(true);
    setFormError('');
    setSuccess('');
    try {
      await updateProfile({ name, email, institution });
      setSuccess('Profile updated successfully.');
      setIsEditing(false);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setInstitution(user?.institution || 'Moringa School');
    setFormError('');
    setIsEditing(false);
  };

  const displayName = user?.name || name;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => { setIsEditing(true); setSuccess(''); }}
            className="btn-primary"
            style={{ width: 'auto', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            ✎ Edit
          </button>
        )}
      </div>

      {success && <SuccessBanner message={success} />}

      <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Avatar */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '16px', flexShrink: 0,
          backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-green)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', fontWeight: '700',
        }}>
          {displayName.charAt(0).toUpperCase()}
        </div>

        {isEditing ? (
          <div style={{ flex: 1, animation: 'fadeIn 0.2s ease-out' }}>
            <FormError message={formError} />
            {[
              { label: 'Full Name', value: name, set: setName, type: 'text' },
              { label: 'Email',     value: email, set: setEmail, type: 'email' },
            ].map(({ label, value, set, type }) => (
              <div key={label} style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</label>
                <input
                  type={type} value={value}
                  onChange={(e) => set(e.target.value)}
                  className="input-field"
                  style={{ margin: 0, padding: '0.5rem 1rem' }}
                />
              </div>
            ))}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Institution</label>
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="input-field"
                style={{ margin: 0, padding: '0.5rem 1rem' }}
              >
                {INSTITUTIONS.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button onClick={handleCancel} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{displayName}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ backgroundColor: 'var(--bg-main)' }}>{user?.role || 'Beginner'}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{user?.institution || institution}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { label: 'Points',      value: user?.points ?? 0,  icon: <Trophy size={24} color="#F59E0B" /> },
          { label: 'Solved',      value: '0',                icon: <CheckCircle size={24} color="var(--primary-green)" /> },
          { label: 'Submissions', value: '1',                icon: <Code size={24} color="#3B82F6" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>{icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
