import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react';
import { FormError } from '../components/UI';

const INSTITUTIONS = [
  '', 'Moringa School', 'ALX Africa', 'Andela',
  'University of Nairobi', 'Strathmore University', 'JKUAT', 'Other',
];

const Signup = () => {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  
  // FIX 1: Destructure 'register' from context instead of 'signup'
  const { register } = useAuth(); 
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // FIX 2: Call register() and pass the state variables as a single object
      await register({ name, email, password, institution });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <div style={{ backgroundColor: 'var(--primary-green)', padding: '0.25rem', borderRadius: '6px', color: '#000' }}>
              <Zap size={24} fill="currentColor" />
            </div>
            StackBattle
          </div>
          <h1 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Join the arena</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <FormError message={error} />
          {[
            { label: 'Full name', value: name,     set: setName,     type: 'text',     placeholder: 'Jane Wangari',    required: true  },
            { label: 'Email',     value: email,    set: setEmail,    type: 'email',    placeholder: 'jane@example.com', required: true  },
            { label: 'Password',  value: password, set: setPassword, type: 'password', placeholder: '••••••••',         required: true  },
          ].map(({ label, value, set, type, placeholder, required }) => (
            <div key={label} style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem' }}>{label}</label>
              <input type={type} required={required} className="input-field" placeholder={placeholder} value={value} onChange={(e) => set(e.target.value)} />
            </div>
          ))}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.875rem' }}>
              Institution <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>(optional)</span>
            </label>
            <select className="input-field" value={institution} onChange={(e) => setInstitution(e.target.value)}>
              {INSTITUTIONS.map((i) => <option key={i} value={i}>{i || 'Select your institution'}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-green)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;