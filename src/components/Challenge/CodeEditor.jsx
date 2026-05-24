import { useRef, useState, useCallback } from "react";

const LANGUAGES = ["python", "javascript"];

const PLACEHOLDERS = {
  python: `# Write your Python solution here\ndef solution(n):\n    pass\n`,
  javascript: `// Write your JavaScript solution here\nfunction solution(n) {\n  \n}\n`,
};

function highlightCode(code) {
  if (!code) return "";
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("[^"]*"|'[^']*'|`[^`]*`|\b(function|def|class|return|if|else|elif|for|while|const|let|var|import|from|export|pass|true|false|null|undefined)\b|\b\d+\b|(\/\/.*|#.*))/g,
      (match) => {
        if (match.startsWith('"') || match.startsWith("'") || match.startsWith("`")) {
          return `<span style="color: #a5d6ff">${match}</span>`;
        }
        if (match.startsWith("//") || match.startsWith("#")) {
          return `<span style="color: #8b949e">${match}</span>`;
        }
        if (/^\d/.test(match)) {
          return `<span style="color: #79c0ff">${match}</span>`;
        }
        return `<span style="color: #ff7b72">${match}</span>`;
      }
    );
}

export default function CodeEditor({
  code,
  onChange,
  language = "python",
  onLanguageChange,
  starterCode = {},
  readOnly = false,
}) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.target;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newVal = code.substring(0, start) + "  " + code.substring(end);
        onChange(newVal);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [code, onChange]
  );

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

  function handleScroll(e) {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
  }

  const lineCount = (code || "").split("\n").length;
  const lineNums = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div style={styles.root}>
      <div style={styles.toolbar}>
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

        <div style={styles.actions}>
          <button onClick={handleCopy} style={styles.actionBtn}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button onClick={handleReset} style={styles.actionBtn} disabled={readOnly}>
            Reset
          </button>
        </div>
      </div>

      <div style={styles.editorBody}>
        <div style={styles.lineNums} aria-hidden>
          {lineNums.map((n) => (
            <div key={n} style={styles.lineNum}>
              {n}
            </div>
          ))}
        </div>
        <div style={styles.editorContainer}>
          <pre
            ref={preRef}
            style={styles.syntaxOverlay}
            dangerouslySetInnerHTML={{ __html: highlightCode(code || "") }}
            aria-hidden="true"
          />
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            readOnly={readOnly}
            placeholder={PLACEHOLDERS[language]}
            style={styles.textarea}
          />
        </div>
      </div>
    </div>
  );
}

const sharedEditorStyles = {
  margin: 0,
  padding: "12px 14px",
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  fontSize: "13px",
  lineHeight: "1.6",
  whiteSpace: "pre",
  overflowWrap: "normal",
  border: "none",
  outline: "none",
  tabSize: 2,
};

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
    color: active ? "#fff" : "#8b949e",
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
    overflow: "hidden",
  },
  lineNums: {
    padding: "12px 0",
    minWidth: "42px",
    background: "#0d1117",
    borderRight: "1px solid #21262d",
    textAlign: "right",
    userSelect: "none",
    flexShrink: 0,
    overflow: "hidden",
  },
  lineNum: {
    padding: "0 8px",
    color: "#3d444d",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  editorContainer: {
    position: "relative",
    flex: 1,
    overflow: "hidden",
    background: "transparent",
  },
  syntaxOverlay: {
    ...sharedEditorStyles,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: "#e6edf3",
    pointerEvents: "none",
    overflow: "hidden",
  },
  textarea: {
    ...sharedEditorStyles,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    color: "transparent",
    caretColor: "#e6edf3",
    background: "transparent",
    resize: "none",
    overflow: "auto",
  },
};