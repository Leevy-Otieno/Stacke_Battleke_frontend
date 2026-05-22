import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Zap, CheckCircle, Code } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [weekly, setWeekly] = useState(null);
  const [loadingWeekly, setLoadingWeekly] = useState(true);
  
  useEffect(() => {
    const loadWeekly = async () => {
      try {
        setLoadingWeekly(true);
        const res = await apiClient.get('/challenges/weekly');
        // FIX: The backend returns it nested inside 'challenge'
        setWeekly(res.data?.data?.challenge || null);
      } catch (err) {
        console.log('No weekly challenge found');
        setWeekly(null);
      } finally {
        setLoadingWeekly(false);
      }
    };

    loadWeekly();
  }, []);

  const stats = [
    {
      label: 'TOTAL POINTS',
      value: user?.points ?? 0,
      icon: <Trophy size={20} color="#F59E0B" />,
    },
    {
      label: 'RANK TIER',
      value: user?.role || user?.rank_tier || 'Beginner',
      icon: <Zap size={20} color="var(--primary-green)" />,
    },
    {
      label: 'SOLVED',
      value: '0',
      icon: <CheckCircle size={20} color="var(--primary-green)" />,
    },
    {
      label: 'SUBMISSIONS',
      value: '1',
      icon: <Code size={20} color="#3B82F6" />,
    },
  ];

  const RANK_THRESHOLDS = {
    Beginner: 200,
    Intermediate: 500,
    Advanced: 1000,
    Elite: Infinity,
  };

  const pts = user?.points ?? 0;
  const currentRank = user?.role || user?.rank_tier || 'Beginner';
  const nextThreshold = RANK_THRESHOLDS[currentRank] ?? 200;

  const progress = Math.min(
    100,
    Math.round((pts / nextThreshold) * 100)
  );

  const handleWeeklyClick = () => {
    if (weekly?.id) {
      navigate(`/challenges/${weekly.id}`);
    } else {
      navigate('/challenges');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.name?.split(' ')[0] || 'Coder'}
        </h1>
        <p className="page-subtitle">
          Here's how you're doing
        </p>
      </div>

      {/* STATS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {stats.map((s, i) => (
          <div key={i} className="card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              <span>{s.label}</span>
              {s.icon}
            </div>
            <div style={{ fontSize: '1.5rem' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
        }}
      >
        {/* WEEKLY CHALLENGE */}
        <div
          className="card"
          style={{
            backgroundColor: '#0B1A15',
            border: '1px solid #064E3B',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {/* FIX: Conditional Rendering for Loading, Active, and Empty States */}
          {loadingWeekly ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Loading...</h3>
              <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Fetching the weekly challenge</p>
            </div>
          ) : weekly ? (
            <>
              {/* ACTIVE STATE */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.75rem' }}>
                  WEEKLY CHALLENGE
                  <span
                    style={{
                      marginLeft: '8px',
                      background: 'var(--primary-green)',
                      color: '#000',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Active
                  </span>
                </div>

                <span className="badge badge-medium" style={{
                  backgroundColor: weekly.difficulty === 'Easy' ? '#064E3B' : weekly.difficulty === 'Hard' ? '#7F1D1D' : '#78350F',
                  color: weekly.difficulty === 'Easy' ? '#34D399' : weekly.difficulty === 'Hard' ? '#F87171' : '#FBBF24'
                }}>
                  {weekly.difficulty}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                {weekly.title}
              </h3>

              <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {weekly.desc || weekly.description}
              </p>

              <button
                className="btn-primary"
                style={{ alignSelf: 'flex-start' }}
                onClick={handleWeeklyClick}
              >
                Solve Now →
              </button>
            </>
          ) : (
            <>
              {/* EMPTY STATE */}
              <div style={{ fontSize: '0.75rem', marginBottom: '1rem', color: '#666' }}>
                WEEKLY CHALLENGE
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#888', marginBottom: '0.5rem' }}>
                No Weekly Challenge Yet
              </h3>
              <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Check back later for updates
              </p>
              <button
                className="btn-primary"
                style={{ alignSelf: 'flex-start', opacity: 0.5, cursor: 'not-allowed' }}
                disabled
              >
                Solve Now →
              </button>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div>
          {/* Rank Progress */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Rank Progress</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span>{pts} pts</span>
              <span>
                {nextThreshold === Infinity ? 'MAX' : `${nextThreshold} pts`}
              </span>
            </div>

            <div
              style={{
                height: '6px',
                background: '#222',
                borderRadius: '4px',
                marginTop: '0.5rem',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'var(--primary-green)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-out'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
