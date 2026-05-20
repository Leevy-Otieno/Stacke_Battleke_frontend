import React, { useState, useCallback } from 'react';
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
  const handleSubmit = useCallback(async (code, language) => {
    setSubmitting(true);

    try {
      const response = await submitCode(Number(id), code, language);
      setResult(response);
    } catch (err) {
      setResult({
        status: 'Runtime Error',
        passed: 0,
        total: 0,
        points: 0,
        runtime: '—',
      });
    } finally {
      setSubmitting(false);
    }
  }, [id]);
  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} />;
  if (!challenge) return <ErrorMessage message="Challenge not found" />;

  const {
    title,
    difficulty,
    points,
    time,
    description,
    examples = [],
    hiddenTests,
    boilerplate
  } = challenge;

  return (
    <div className="challenge-container">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link">
          ← Challenges
        </Link>

        <h1 className="page-title">{title}</h1>

        <div className="meta-info">
          <span className={`badge ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>

          <span className="points">+{points} pts</span>
          <span className="time"> {time}</span>
        </div>
      </div>

      <div className="challenge-grid">
        <div className="left-panel">
          <div className="card">
            <h3>&lt;/&gt; Problem</h3>
            <p className="description">{description}</p>
          </div>

          <div className="card">
            <h3>Test Cases</h3>

            {examples.map((ex, i) => (
              <div key={i} className="test-case">
                <div className="case-title">Case {i + 1}</div>

                <div>
                  Input: <span>{(ex.input || '').replace(/\n/g, ' / ')}</span>
                </div>

                <div>
                  Expected: <span className="expected">{ex.output}</span>
                </div>

                {ex.explanation && (
                  <div className="explanation">
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}

            {hiddenTests > 0 && (
              <div className="hidden-tests">
                👁 {hiddenTests} hidden test case{hiddenTests > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="right-panel">
          <CodeEditor
            boilerplate={boilerplate}
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
