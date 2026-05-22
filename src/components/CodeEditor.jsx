import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Spinner } from './UI';

const DEFAULT_BOILERPLATE = {
  python: `# Write your solution here\npass`,
  javascript: `// Write your solution here`,
};

const CodeEditor = ({ challengeId, boilerplate = DEFAULT_BOILERPLATE, onSubmit, submitting = false }) => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(boilerplate.python || DEFAULT_BOILERPLATE.python);

  // Load draft from local storage or fallback to boilerplate
  useEffect(() => {
    if (challengeId) {
      const savedCode = localStorage.getItem(`draft_code_${challengeId}_${language}`);
      if (savedCode) {
        setCode(savedCode);
      } else {
        setCode(boilerplate[language] || DEFAULT_BOILERPLATE[language]);
      }
    } else {
      setCode(boilerplate[language] || DEFAULT_BOILERPLATE[language]);
    }
  }, [challengeId, language, boilerplate]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (challengeId) {
      localStorage.setItem(`draft_code_${challengeId}_${language}`, newCode);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Keyboard Shortcut (Cmd+Enter / Ctrl+Enter) to submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!submitting) onSubmit(code, language);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language, submitting, onSubmit]);

  return (
    <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <select
            value={language}
            onChange={handleLanguageChange}
            style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.3rem 0.6rem', fontWeight: '500', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript</option>
          </select>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Auto-saved to browser</span>
        </div>

        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '0.4rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: submitting ? 0.7 : 1 }}
          onClick={() => !submitting && onSubmit(code, language)}
          disabled={submitting}
          title="Cmd + Enter to submit"
        >
          {submitting ? <><Spinner size={14} /> Judging…</> : <>▷ Submit</>}
        </button>
      </div>

      {/* Monaco */}
      <div style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(v) => handleCodeChange(v ?? '')}
          loading={<div style={{ padding: '2rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Spinner />Loading editor…</div>}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code','JetBrains Mono','Courier New',monospace",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            padding: { top: 16 },
            overviewRulerLanes: 0,
            wordWrap: 'on',
            lineHeight: 1.6,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;