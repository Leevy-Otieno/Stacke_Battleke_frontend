
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FormError } from '../components/UI';

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email.trim().toLowerCase(), password);
      // Redirect based on role
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (e) {
      console.error("FULL LOGIN ERROR:", e);
      setError(String(e.message || 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <div style={{ backgroundColor: 'var(--primary-green)', padding: '0.25rem', borderRadius: '6px', color: '#000' }}>
              <Zap size={24} fill="currentColor" />
            </div>
            StackBattle
          </div>
          <h1 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Sign in</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Welcome back, coder</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <FormError message={error} />

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem' }}>Email</label>
            <input
              type="email" required className="input-field"
              placeholder="jane@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.875rem' }}>Password</label>
            <input
              type="password" required className="input-field"
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary-green)' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;