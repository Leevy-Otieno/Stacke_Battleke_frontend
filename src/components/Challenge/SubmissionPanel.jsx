/**
 * SubmissionPanel.jsx
 *
 * The action bar shown below / beside the code editor.
 * Contains RUN (sandbox, no DB write) and SUBMIT (full evaluation + DB) buttons.
 *
 * Props:
 *   onRun    async fn()
 *   onSubmit async fn()
 *   running  bool  — RUN in progress
 *   submitting bool — SUBMIT in progress
 *   disabled bool  — true while auth is loading etc.
 */

export default function SubmissionPanel({
  onRun,
  onSubmit,
  running    = false,
  submitting = false,
  disabled   = false,
}) {
  const busy = running || submitting;

  return (
    <div style={styles.root}>
      {/* Left: status hint */}
      <span style={styles.hint}>
        {submitting ? "Evaluating against all test cases…"
          : running   ? "Running sample tests…"
          : ""}
      </span>

      {/* Right: action buttons */}
      <div style={styles.actions}>
        {/* RUN button — calls Piston directly, sandbox mode */}
        <button
          onClick={onRun}
          disabled={busy || disabled}
          style={{ ...styles.btn, ...styles.runBtn }}
          title="Run against sample test cases (no submission saved)"
        >
          {running ? <Spinner /> : "▶  Run"}
        </button>

        {/* SUBMIT button — calls backend POST /api/submissions/submit-code */}
        <button
          onClick={onSubmit}
          disabled={busy || disabled}
          style={{ ...styles.btn, ...styles.submitBtn }}
          title="Submit solution against all test cases"
        >
          {submitting ? <Spinner white /> : "⚡  Submit"}
        </button>
      </div>
    </div>
  );
}

function Spinner({ white }) {
  return (
    <span style={{
      display: "inline-block",
      width: 14, height: 14,
      border: `2px solid ${white ? "rgba(255,255,255,0.3)" : "rgba(88,166,255,0.3)"}`,
      borderTop: `2px solid ${white ? "#fff" : "#58a6ff"}`,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      verticalAlign: "middle",
    }} />
  );
}

if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(s);
}

const styles = {
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    background: "#161b22",
    borderTop: "1px solid #30363d",
    borderRadius: "0 0 10px 10px",
    flexWrap: "wrap",
    gap: "8px",
    flexShrink: 0,
  },
  hint: {
    color: "#8b949e",
    fontSize: "12px",
    fontStyle: "italic",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginLeft: "auto",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.15s, transform 0.1s",
  },
  runBtn: {
    background: "#21262d",
    color: "#58a6ff",
    border: "1px solid #30363d",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #1f6feb, #388bfd)",
    color: "#fff",
  },
};