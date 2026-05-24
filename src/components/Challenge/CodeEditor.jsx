// CodeEditor.jsx
import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const LANGUAGES = [
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
];

const DEFAULT_CODE = {
  python: `def solution(n):\n    return n * 2\n`,
  javascript: `function solution(n) {\n  return n * 2;\n}\n`,
};

export default function CodeEditor({
  code,
  onChange,
  language = "python",
  onLanguageChange,
  starterCode = {},
  readOnly = false,
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleReset() {
    onChange(starterCode[language] || DEFAULT_CODE[language]);
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.topbar}>
        <div style={styles.languages}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onLanguageChange?.(lang.id)}
              style={{
                ...styles.langBtn,
                background: language === lang.id ? "#1f6feb" : "transparent",
                color: language === lang.id ? "#fff" : "#8b949e",
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div style={styles.actions}>
          <button onClick={handleCopy} style={styles.btn}>
            {copied ? "✓ Copied" : "Copy"}
          </button>

          <button onClick={handleReset} style={styles.btn}>
            Reset
          </button>
        </div>
      </div>

      <div style={styles.editor}>
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={(value) => onChange(value || "")}
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            readOnly,
            tabSize: 2,
            insertSpaces: true,
            lineNumbers: "on",
            cursorSmoothCaretAnimation: true,
          }}
        />
      </div>

      <div style={styles.footer}>
        <span>{language}</span>
        <span>{(code || "").split("\n").length} lines</span>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: "500px",
    background: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "12px",
    overflow: "hidden",
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
  langBtn: {
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
  btn: {
    border: "1px solid #30363d",
    background: "#21262d",
    color: "#e6edf3",
    padding: "7px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },
  editor: {
    flex: 1,
    width: "100%",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 14px",
    background: "#161b22",
    borderTop: "1px solid #30363d",
    color: "#8b949e",
    fontSize: "12px",
  },
};