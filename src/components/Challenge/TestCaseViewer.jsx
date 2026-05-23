/**
 * TestCaseViewer.jsx
 *
 * Displays the visible (non-hidden) example test cases from the challenge.
 * Also shows the count of hidden test cases.
 *
 * Props:
 *   examples    [{ input, output, explanation }]   — from challenge.examples (visible)
 *   hiddenCount number                              — from challenge.hiddenTests
 */

export default function TestCaseViewer({ examples = [], hiddenCount = 0 }) {
  if (examples.length === 0 && hiddenCount === 0) return null;

  return (
    <div style={styles.root}>
      <h3 style={styles.heading}>Test Cases</h3>

      {examples.map((ex, i) => (
        <div key={i} style={styles.card}>
          <div style={styles.cardTitle}>Example {i + 1}</div>

          {ex.input && (
            <div style={styles.row}>
              <span style={styles.label}>Input</span>
              <code style={styles.code}>{ex.input}</code>
            </div>
          )}
          <div style={styles.row}>
            <span style={styles.label}>Output</span>
            <code style={styles.code}>{ex.output}</code>
          </div>
          {ex.explanation && (
            <div style={styles.row}>
              <span style={styles.label}>Note</span>
              <span style={styles.explanation}>{ex.explanation}</span>
            </div>
          )}
        </div>
      ))}

      {hiddenCount > 0 && (
        <p style={styles.hiddenNote}>
          🔒 {hiddenCount} hidden test{hiddenCount > 1 ? "s" : ""} — only visible after submission
        </p>
      )}
    </div>
  );
}

const styles = {
  root: {
    padding: "0 0 16px",
  },
  heading: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#8b949e",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  card: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "10px",
  },
  cardTitle: {
    color: "#58a6ff",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "8px",
    letterSpacing: "0.5px",
  },
  row: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    marginBottom: "5px",
  },
  label: {
    minWidth: "58px",
    color: "#8b949e",
    fontSize: "12px",
    fontWeight: 600,
    paddingTop: "2px",
  },
  code: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    color: "#e6edf3",
    background: "#0d1117",
    padding: "2px 8px",
    borderRadius: "4px",
    flex: 1,
    wordBreak: "break-all",
    whiteSpace: "pre-wrap",
  },
  explanation: {
    color: "#8b949e",
    fontSize: "12px",
    flex: 1,
  },
  hiddenNote: {
    color: "#484f58",
    fontSize: "12px",
    fontStyle: "italic",
    margin: "4px 0 0",
  },
};