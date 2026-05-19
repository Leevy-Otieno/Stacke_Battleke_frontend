import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Zap, CheckCircle, Code } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'TOTAL POINTS', value: user?.points ?? 0, icon: <Trophy size={20} color="#F59E0B" /> },
    { label: 'RANK TIER',    value: user?.role || 'Beginner', icon: <Zap size={20} color="var(--primary-green)" /> },
    { label: 'SOLVED',       value: '0',  icon: <CheckCircle size={20} color="var(--primary-green)" /> },
    { label: 'SUBMISSIONS',  value: '1',  icon: <Code size={20} color="#3B82F6" /> },
  ];

  const RANK_THRESHOLDS = { Beginner: 200, Intermediate: 500, Advanced: 1000, Elite: Infinity };
  const nextThreshold = RANK_THRESHOLDS[user?.role] ?? 200;
  const pts = user?.points ?? 0;
  const progress = Math.min(100, Math.round((pts / nextThreshold) * 100));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0] || 'Coder'}</h1>
        <p className="page-subtitle">Here's how you're doing</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              <span>{s.label}</span>{s.icon}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Weekly challenge */}
          <div className="card" style={{ backgroundColor: '#0B1A15', border: '1px solid #064E3B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--primary-green)', fontWeight: 'bold' }}>
                📅 WEEK 20 CHALLENGE
                <span style={{ backgroundColor: 'var(--primary-green)', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>• Active</span>
              </div>
              <span className="badge badge-medium">Medium</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Longest Common Subsequence</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>2026-05-12 – 2026-05-18</p>
            <button
              className="btn-primary"
              style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => navigate('/challenges/3')}
            >
              Solve now →
            </button>
          </div>

          {/* Recent submissions */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Recent Submissions</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>Two Sum</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>javascript · 0/3 tests</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>+0 pts</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>May 13</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Rank progress */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600' }}>Rank Progress</h3>
              <span className="badge" style={{ backgroundColor: 'var(--bg-main)' }}>{user?.role || 'Beginner'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>{pts} pts</span>
              <span>{nextThreshold === Infinity ? '∞' : nextThreshold} pts</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '3px', marginBottom: '0.5rem' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary-green)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {nextThreshold === Infinity ? 'Max rank reached!' : `${nextThreshold - pts} pts to next rank`}
            </div>
          </div>

          {/* Quick start */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Quick Start</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: <Code size={16} color="var(--primary-green)" />, label: 'Practice challenges', path: '/challenges' },
                { icon: <Trophy size={16} color="#F59E0B" />,            label: 'View leaderboard',   path: '/leaderboard' },
                { icon: <Zap size={16} color="#3B82F6" />,               label: 'My groups',          path: '/groups' },
              ].map(({ icon, label, path }) => (
                <li
                  key={path}
                  onClick={() => navigate(path)}
                  style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  {icon} {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
