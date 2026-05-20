import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import CodeEditor from '../components/CodeEditor';
import SubmissionResult from '../components/SubmissionResult';
import { PageLoader, ErrorMessage } from '../components/UI';

import { useAsync } from '../hooks/useAsync';
import { fetchChallenge, submitCode } from '../services/api';
import { getDifficultyColor } from '../utils/helpers';

const ChallengeDetail = () => {
  const { id } = useParams();

  const { data: challenge, loading, error } = useAsync(
    () => fetchChallenge(id),
    [id]
  );

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (code, language) => {
    setSubmitting(true);

    try {
      const res = await submitCode(Number(id), code, language);
      setResult(res);
    } catch (e) {
      setResult({
        status: 'Runtime Error',
        passed: 0,
        total: 3,
        points: 0,
        runtime: '—',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} />;
  if (!challenge) return <ErrorMessage message="Challenge not found" />;

  return (
    <div style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/challenges"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            display: 'inline-block',
            marginBottom: '1rem',
          }}
        >
          ← Challenges
        </Link>

        <h1 className="page-title">{challenge.title}</h1>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>

          <span style={{ color: 'var(--primary-green)' }}>
            +{challenge.points} pts
          </span>

          <span>⏱ {challenge.time}</span>
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          flex: 1,
          overflow: 'hidden',
        }}
      >

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>

          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              &lt;/&gt; Problem
            </h3>

            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                lineHeight: '1.7',
                whiteSpace: 'pre-line',
              }}
            >
              {challenge.description}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              Test Cases
            </h3>

            {(challenge.examples || []).map((ex, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--bg-main)',
                  padding: '1rem',
                  borderRadius: '6px',
                  marginBottom: '0.75rem',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                }}
              >
                <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Case {i + 1}
                </div>

                <div>
                  Input:{' '}
                  <span style={{ color: 'var(--text-primary)' }}>
                    {(ex.input || '').replace(/\n/g, ' / ')}
                  </span>
                </div>

                <div>
                  Expected:{' '}
                  <span style={{ color: 'var(--primary-green)' }}>
                    {ex.output}
                  </span>
                </div>

                {ex.explanation && (
                  <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}

            {challenge.hiddenTests > 0 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                👁 {challenge.hiddenTests} hidden test case
                {challenge.hiddenTests > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <CodeEditor
            boilerplate={challenge.boilerplate}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      </div>

      <SubmissionResult
        result={result}
        onClose={() => setResult(null)}
        onResubmit={() => setResult(null)}
      />
    </div>
  );
};

export default ChallengeDetail;
