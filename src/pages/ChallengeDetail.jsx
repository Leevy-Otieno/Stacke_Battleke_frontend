import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Send, ChevronLeft, Terminal } from 'lucide-react';
import { PageLoader, ErrorMessage } from '../components/UI';
import { useAsync } from '../hooks/useAsync';
import { fetchChallenge, submitCode } from '../services/api';

const ChallengeWorkspace = () => {
  const { id } = useParams();

  const { data: challenge, loading, error } = useAsync(
    () => fetchChallenge(id),
    [id]
  );

  // Defaulting to JavaScript as the primary environment
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Sync boilerplate when challenge loads
  useEffect(() => {
    if (challenge && challenge.boilerplate) {
      setCode(challenge.boilerplate[language] || '// Write your solution here\n');
    }
  }, [challenge, language]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null); // Clear previous console logs
    
    try {
      // Hits the /api/submissions/submit-code route in your Flask backend
      const res = await submitCode(Number(id), code, language);
      setResult(res); 
    } catch (e) {
      setResult({
        status: 'Server Error',
        stderr: e.message || 'Failed to connect to execution engine.',
        passed_tests: 0,
        total_tests: 0
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} />;
  if (!challenge) return <ErrorMessage message="Challenge not found" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0d1117', color: '#c9d1d9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* TOP NAVIGATION BAR */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem', backgroundColor: '#161b22', borderBottom: '1px solid #30363d' }}>
        <Link to="/challenges" style={{ color: '#8b949e', display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: '1.5rem', fontSize: '0.875rem' }}>
          <ChevronLeft size={16} style={{ marginRight: '0.25rem' }} /> Back
        </Link>
        <h1 style={{ fontSize: '1rem', fontWeight: '600', margin: 0, color: '#e6edf3' }}>{challenge.title}</h1>
      </div>

      {/* THREE-PANE WORKSPACE */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* PANE 1: PROBLEM DESCRIPTION (Left) */}
        <div style={{ width: '30%', minWidth: '300px', padding: '1.5rem', overflowY: 'auto', borderRight: '1px solid #30363d', backgroundColor: '#0d1117' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: '600' }}>
            <span style={{ color: '#3fb950', backgroundColor: 'rgba(63, 185, 80, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
              {challenge.difficulty}
            </span>
            <span style={{ color: '#d2a8ff', backgroundColor: 'rgba(210, 168, 255, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
              +{challenge.points} pts
            </span>
          </div>

          <div style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: '#c9d1d9', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
            {challenge.description}
          </div>

          <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: '#8b949e', letterSpacing: '0.05em', marginBottom: '1rem' }}>Examples</h3>
          {(challenge.examples || []).map((ex, i) => (
            <div key={i} style={{ backgroundColor: '#161b22', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #30363d', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              <div style={{ color: '#8b949e', marginBottom: '0.5rem' }}>Input: <span style={{ color: '#e6edf3' }}>{(ex.input || '').replace('\n', ' / ')}</span></div>
              <div style={{ color: '#8b949e' }}>Output: <span style={{ color: '#3fb950' }}>{ex.output}</span></div>
            </div>
          ))}
        </div>

        {/* PANE 2: CODE EDITOR (Center) */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#0d1117' }}>
          {/* Editor Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', borderBottom: '1px solid #30363d', backgroundColor: '#161b22' }}>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', outline: 'none' }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
            <div style={{ fontSize: '0.75rem', color: '#8b949e', display: 'flex', alignItems: 'center' }}>
              Auto-save enabled
            </div>
          </div>

          {/* Actual Editor Component goes here (Monaco/CodeMirror) */}
          <div style={{ flex: 1, padding: '1rem' }}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', color: '#e6edf3', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontSize: '0.9375rem', outline: 'none', resize: 'none' }}
              spellCheck="false"
            />
          </div>
        </div>

        {/* PANE 3: TERMINAL & ACTIONS (Right) */}
        <div style={{ width: '30%', minWidth: '350px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #30363d', backgroundColor: '#0d1117' }}>
          
          {/* Terminal Action Bar */}
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderBottom: '1px solid #30363d', backgroundColor: '#161b22' }}>
            <button 
              disabled={submitting}
              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: '#21262d', color: '#c9d1d9', border: '1px solid #363b42', padding: '0.5rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              <Play size={14} /> Run Tests
            </button>
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: '#238636', color: '#ffffff', border: '1px solid rgba(240,246,252,0.1)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? <PageLoader size={14} /> : <Send size={14} />} Submit
            </button>
          </div>

          {/* Terminal Output Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              <Terminal size={14} /> Output Console
            </div>

            {!result && !submitting && (
              <div style={{ color: '#484f58', fontStyle: 'italic' }}>
                Run your code to see the output logs here...
              </div>
            )}

            {submitting && (
              <div style={{ color: '#58a6ff' }}>Executing code on Piston sandbox...</div>
            )}

            {/* Render Backend API Results */}
            {result && !submitting && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Final Status */}
                <div>
                  Status: <span style={{ 
                    fontWeight: 'bold', 
                    color: result.status === 'Accepted' ? '#3fb950' : '#f85149' 
                  }}>
                    {result.status}
                  </span>
                </div>
                
                {/* Tests Passed / Score */}
                <div style={{ color: '#c9d1d9' }}>
                  Tests Passed: {result.passed_tests} / {result.total_tests}
                  {result.score !== undefined && ` | Score: +${result.score}`}
                </div>

                {/* Standard Output (stdout) */}
                {result.stdout && (
                  <div>
                    <div style={{ color: '#8b949e', fontSize: '0.75rem', marginBottom: '0.25rem' }}>STDOUT:</div>
                    <div style={{ backgroundColor: '#161b22', padding: '0.75rem', borderRadius: '4px', color: '#e6edf3', whiteSpace: 'pre-wrap', border: '1px solid #30363d' }}>
                      {result.stdout}
                    </div>
                  </div>
                )}

                {/* Standard Error (stderr) */}
                {result.stderr && (
                  <div>
                    <div style={{ color: '#8b949e', fontSize: '0.75rem', marginBottom: '0.25rem' }}>STDERR:</div>
                    <div style={{ backgroundColor: 'rgba(248, 81, 73, 0.1)', padding: '0.75rem', borderRadius: '4px', color: '#f85149', whiteSpace: 'pre-wrap', border: '1px solid rgba(248, 81, 73, 0.4)' }}>
                      {result.stderr}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ChallengeWorkspace;
