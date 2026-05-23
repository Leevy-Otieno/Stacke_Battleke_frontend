/**
 * Terminal.jsx
 *
 * Displays code execution output in a terminal-style panel.
 *
 * Props:
 * results  — array of per-test objects
 * summary  — { passed_tests, total_tests, score, status, error }
 * loading  — bool
 * mode     — "run" | "submit"
 */

import { useEffect, useRef } from "react";

const STATUS_ICON = {
  Accepted:     "✓",
  "Wrong Answer": "✕",
  "Runtime Error": "!",
  Pending:      "...",
};

export default function Terminal({ results = [], summary = null, loading = false, mode = "run" }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [results, loading]);

  return (
    <div style={styles.shell}>
      {/* Header bar */}
      <div style={styles.bar}>
        <span style={styles.barLabel}>
          {mode === "submit" ? "SUBMISSION RESULTS" : "RUN OUTPUT"}
        </span>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {/* Idle state */}
        {!loading && results.length === 0 && !summary && (
          <p style={styles.idle}>
            {mode === "submit"
              ? "Click SUBMIT to run against all test cases."
              : "Click RUN to execute against sample inputs."}
          </p>
        )}

        {/* Spinner */}
        {loading && (
          <div style={styles.spinnerWrap}>
            <span style={styles.spinner} />
            <span style={styles.spinnerText}>
              {mode === "submit" ? "Running all test cases…" : "Executing code…"}
            </span>
          </div>
        )}

        {/* Per-test results */}
        {!loading && results.map((r, i) => (
          <div key={i} style={styles.testBlock(r.passed)}>
            <div style={styles.testHeader}>
              <span style={styles.testNum}>Test {i + 1}</span>
              <span style={styles.testStatus}>
                {STATUS_ICON[r.status] || ""} {r.status}
              </span>
            </div>

            {r.input != null && <Row label="Input" value={r.input} />}

            {r.is_hidden ? (
              <p style={styles.hiddenNote}>Hidden test case — output not shown.</p>
            ) : (
              <>
                {r.expected != null && <Row label="Expected" value={r.expected} accent />}
                {r.actual   != null && <Row label="Got"      value={r.actual}   error={!r.passed} />}
              </>
            )}

            {r.stderr && <Row label="Error" value={r.stderr} error />}
          </div>
        ))}

        {/* Summary banner */}
        {!loading && summary && (
          <div style={styles.summary(summary.status === "Accepted")}>
            <span style={styles.summaryScore}>
              Score: {summary.passed_tests ?? "?"}/{summary.total_tests ?? "?"}
              {summary.score !== undefined && ` — ${summary.score} pts`}
            </span>
            <span style={styles.summaryStatus}>
              {STATUS_ICON[summary.status] || ""} {summary.status}
            </span>
            {summary.error && (
              <pre style={styles.summaryError}>{summary.error}</pre>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function Row({ label, value, accent, error }) {
  const color = error ? "#ff6b6b" : accent ? "#a8ff78" : "#cdd6f4";
  return (
    <div style={styles.row}>
      <span style={{ ...styles.rowLabel, color }}>{label}:</span>
      <code style={{ ...styles.rowValue, color }}>{value}</code>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  shell: {
    display: "flex",
    flexDirection: "column",
    background: "#0d1117",
    borderRadius: "10px",
    border: "1px solid #30363d",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontSize: "13px",
    overflow: "hidden",
    height: "100%",
    minHeight: "280px",
  },
  bar: {
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
    background: "#161b22",
    borderBottom: "1px solid #30363d",
    flexShrink: 0,
  },
  barLabel: {
    color: "#8b949e",
    fontSize: "11px",
    letterSpacing: "1.5px",
    fontWeight: 600,
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "14px 18px",
    lineHeight: 1.6,
  },
  idle: {
    color: "#484f58",
    fontStyle: "italic",
    margin: 0,
  },
  spinnerWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#58a6ff",
  },
  spinner: {
    display: "inline-block",
    width: 16, height: 16,
    border: "2px solid #30363d",
    borderTop: "2px solid #58a6ff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  spinnerText: { color: "#58a6ff" },
  testBlock: (passed) => ({
    marginBottom: "14px",
    padding: "10px 14px",
    borderRadius: "6px",
    background: passed ? "rgba(46,160,67,0.08)" : "rgba(248,81,73,0.08)",
    borderLeft: `3px solid ${passed ? "#2ea043" : "#f85149"}`,
  }),
  testHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },
  testNum: { color: "#e6edf3", fontWeight: 700 },
  testStatus: { color: "#8b949e", fontSize: "12px" },
  hiddenNote: { color: "#484f58", fontStyle: "italic", margin: "4px 0 0", fontSize: "12px" },
  row: { display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "4px" },
  rowLabel: { minWidth: "68px", fontWeight: 600, fontSize: "12px", paddingTop: "1px" },
  rowValue: {
    background: "rgba(22,27,34,0.8)",
    padding: "2px 8px",
    borderRadius: "4px",
    flex: 1,
    wordBreak: "break-all",
    whiteSpace: "pre-wrap",
  },
  summary: (accepted) => ({
    marginTop: "10px",
    padding: "12px 16px",
    borderRadius: "8px",
    background: accepted ? "rgba(46,160,67,0.15)" : "rgba(248,81,73,0.12)",
    border: `1px solid ${accepted ? "#2ea043" : "#f85149"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
  }),
  summaryScore: { color: "#e6edf3", fontWeight: 700, fontSize: "15px" },
  summaryStatus: { color: "#8b949e", fontSize: "13px" },
  summaryError: {
    width: "100%",
    margin: "8px 0 0",
    color: "#ff6b6b",
    fontSize: "12px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}