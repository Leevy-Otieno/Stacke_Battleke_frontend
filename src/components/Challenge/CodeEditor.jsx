import React, { useRef, useEffect, useState } from "react";
import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css";

import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";

const LANGUAGES = [
  {
    id: "python",
    label: "🐍 Python",
  },
  {
    id: "javascript",
    label: "⚡ JavaScript",
  },
];

const DEFAULT_CODE = {
  python: `def solution(n):
    return n * 2
`,
  javascript: `function solution(n) {
  return n * 2;
}
`,
};

export default function CodeEditor({
  code,
  onChange,
  language = "python",
  onLanguageChange,
  readOnly = false,
}) {
  const textareaRef = useRef(null);
  const codeRef = useRef(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightElement(codeRef.current);
  }, [code, language]);

  function handleScroll(e) {
    const pre = codeRef.current.parentElement;

    pre.scrollTop = e.target.scrollTop;
    pre.scrollLeft = e.target.scrollLeft;
  }

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();

      const textarea = textareaRef.current;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const updated =
        code.substring(0, start) +
        "  " +
        code.substring(end);

      onChange(updated);

      requestAnimationFrame(() => {
        textarea.selectionStart =
          textarea.selectionEnd =
            start + 2;
      });
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function handleReset() {
    onChange(DEFAULT_CODE[language]);
  }

  const lines = code.split("\n");

  return (
    <div style={styles.wrapper}>
      <div style={styles.topbar}>
        <div style={styles.languages}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() =>
                onLanguageChange?.(lang.id)
              }
              style={{
                ...styles.languageButton,
                background:
                  language === lang.id
                    ? "#1f6feb"
                    : "transparent",
                color:
                  language === lang.id
                    ? "#ffffff"
                    : "#8b949e",
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div style={styles.actions}>
          <button
            style={styles.actionButton}
            onClick={handleCopy}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>

          <button
            style={styles.actionButton}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={styles.editorContainer}>
        <div style={styles.lineNumbers}>
          {lines.map((_, index) => (
            <div
              key={index}
              style={styles.lineNumber}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <div style={styles.editor}>
          <pre style={styles.pre}>
            <code
              ref={codeRef}
              className={`language-${language}`}
            >
              {code}
            </code>
          </pre>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) =>
              onChange(e.target.value)
            }
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            readOnly={readOnly}
            style={styles.textarea}
          />
        </div>
      </div>

      <div style={styles.footer}>
        <span>{language}</span>

        <span>
          {lines.length} lines
        </span>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    minHeight: "500px",
    background: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "12px",
    overflow: "hidden",
    fontFamily:
      "'JetBrains Mono', monospace",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    background: "#161b22",
    borderBottom: "1px solid #30363d",
  },

  languages: {
    display: "flex",
    gap: "8px",
  },

  languageButton: {
    border: "none",
    padding: "7px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  },

  actions: {
    display: "flex",
    gap: "8px",
  },

  actionButton: {
    border: "1px solid #30363d",
    background: "#21262d",
    color: "#e6edf3",
    padding: "7px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },

  editorContainer: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },

  lineNumbers: {
    width: "60px",
    background: "#161b22",
    borderRight: "1px solid #30363d",
    paddingTop: "16px",
    userSelect: "none",
  },

  lineNumber: {
    textAlign: "right",
    paddingRight: "14px",
    color: "#6e7681",
    fontSize: "13px",
    lineHeight: "24px",
  },

  editor: {
    position: "relative",
    flex: 1,
    overflow: "hidden",
  },

  pre: {
    margin: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    padding: "16px",
    background: "#0d1117",
    fontSize: "14px",
    lineHeight: "24px",
  },

  textarea: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    resize: "none",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "transparent",
    caretColor: "#ffffff",
    padding: "16px",
    fontSize: "14px",
    lineHeight: "24px",
    fontFamily:
      "'JetBrains Mono', monospace",
    overflow: "auto",
    whiteSpace: "pre",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    background: "#161b22",
    borderTop: "1px solid #30363d",
    color: "#8b949e",
    fontSize: "12px",
  },
};