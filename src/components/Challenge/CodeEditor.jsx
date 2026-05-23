/**
 * CodeEditor.jsx
 *
 * Lightweight code editor built on a <textarea> with syntax-aware line numbers.
 * Drop-in Monaco replacement that works without any build-tool config.
 *
 * Props:
 *   code         string  — current code value
 *   onChange     fn(code)
 *   language     "python" | "javascript"
 *   onLanguageChange  fn(lang)
 *   starterCode  { python: string, javascript: string }
 *   readOnly     bool
 */

import { useRef, useState, useCallback } from "react";

const LANGUAGES = ["python", "javascript"];

const PLACEHOLDERS = {
  python: `# Write your Python solution here\ndef solution(n):\n    pass\n`,
  javascript: `// Write your JavaScript solution here\nfunction solution(n) {\n  \n}\n`,
};

export default function CodeEditor({
  code,
  onChange,
  language = "python",
  onLanguageChange,
  starterCode = {},
  readOnly = false,
}) {
  const textareaRef = useRef(null);
  const [copied, setCopied]   = useState(false);

  // Tab key inserts 2 spaces instead of losing focus
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.target;
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const newVal = code.substring(0, start) + "  " + code.substring(end);
      onChange(newVal);
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  }, [code, onChange]);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleReset() {
    const starter = starterCode[language] || PLACEHOLDERS[language];
    onChange(starter);
  }

  const lineCount  = (code || "").split("\n").length;
  const lineNums   = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div style={styles.root}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        {/* Language tabs */}
        <div style={styles.langTabs}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange?.(lang)}
              disabled={readOnly}
              style={styles.langTab(lang === language)}
            >
              {lang === "python" ? "🐍 Python" : "⚡ JavaScript"}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={styles.actions}>
          <button onClick={handleCopy}  style={styles.actionBtn}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button onClick={handleReset} style={styles.actionBtn} disabled={readOnly}>
            Reset
          </button>
        </div>
      </div>

      {/* Editor area: line numbers + textarea */}
      <div style={styles.editorBody}>
        <div style={styles.lineNums} aria-hidden>
          {lineNums.map((n) => (
            <div key={n} style={styles.lineNum}>{n}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          readOnly={readOnly}
          placeholder={PLACEHOLDERS[language]}
          style={styles.textarea}
        />
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    background: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "10px",
    overflow: "hidden",
    height: "100%",
    minHeight: "320px",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 12px",
    background: "#161b22",
    borderBottom: "1px solid #30363d",
    flexShrink: 0,
    flexWrap: "wrap",
    gap: "6px",
  },
  langTabs: {
    display: "flex",
    gap: "4px",
  },
  langTab: (active) => ({
    padding: "4px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: "inherit",
    background: active ? "#1f6feb" : "transparent",
    color:  active ? "#fff"    : "#8b949e",
    transition: "background 0.15s",
  }),
  actions: {
    display: "flex",
    gap: "6px",
  },
  actionBtn: {
    padding: "4px 10px",
    borderRadius: "6px",
    border: "1px solid #30363d",
    background: "transparent",
    color: "#8b949e",
    fontSize: "11px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "color 0.15s, border-color 0.15s",
  },
  editorBody: {
    display: "flex",
    flex: 1,
    overflow: "auto",
  },
  lineNums: {
    padding: "12px 0",
    minWidth: "42px",
    background: "#0d1117",
    borderRight: "1px solid #21262d",
    textAlign: "right",
    userSelect: "none",
    flexShrink: 0,
  },
  lineNum: {
    padding: "0 8px",
    color: "#3d444d",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  textarea: {
    flex: 1,
    padding: "12px 14px",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e6edf3",
    fontSize: "13px",
    lineHeight: "1.6",
    resize: "none",
    fontFamily: "inherit",
    whiteSpace: "pre",
    overflowWrap: "normal",
    overflowX: "auto",
  },
};