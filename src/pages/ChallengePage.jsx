/**
 * ChallengePage.jsx
 *
 * The full coding battle view.
 *
 * Layout (side-by-side on desktop, stacked on mobile):
 * ┌──────────────────────────────┬──────────────────────────────────────────┐
 * │  LEFT PANEL                  │  RIGHT PANEL                             │
 * │  - Challenge title/meta      │  - CodeEditor                            │
 * │  - Description               │  - SubmissionPanel (Run / Submit)        │
 * │  - TestCaseViewer (examples) │  - Terminal (output)                     │
 * └──────────────────────────────┴──────────────────────────────────────────┘
 *
 * Route param: :challengeId (integer)
 *
 * Data flow:
 *   1. Load challenge via GET /api/challenges/:id
 *   2. User writes code
 *   3. RUN  → runCodeSandbox (Piston) → show per-sample results in Terminal
 *   4. SUBMIT → POST /api/submissions/submit-code → show full results in Terminal
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { challenges, submissions, runCodeSandbox } from "../services/api";
import { CodeEditor } from "../components/Challenge/CodeEditor";
import { Terminal } from "../components/Challenge/Terminal";
import { SubmissionPanel } from "../components/Challenge/SubmissionPanel";
import { TestCaseViewer } from "../components/Challenge/TestCaseViewer";
import { useAuth }     from "../hooks/useAuth";

const DIFFICULTY_COLOR = {
  Easy:   "#3fb950",
  Medium: "#e3b341",
  Hard:   "#f85149",
};

export default function ChallengePage() {
  const { challengeId } = useParams();
  const { user }        = useAuth();
  const navigate        = useNavigate();

  // ── Challenge state ─────────────────────────────────────────────────────────
  const [challenge, setChallenge] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // ── Editor state ─────────────────────────────────────────────────────────────
  const [language, setLanguage] = useState("python");
  const [code, setCode]         = useState("");

  // ── Terminal state ────────────────────────────────────────────────────────────
  const [termResults,  setTermResults]  = useState([]);
  const [termSummary,  setTermSummary]  = useState(null);
  const [termMode,     setTermMode]     = useState("run");  // "run" | "submit"
  const [running,      setRunning]      = useState(false);
  const [submitting,   setSubmitting]   = useState(false);

  // ── Load challenge ──────────────────────────────────────────────────────────
  useEffect(() => {
    setChallenge(null);
    setLoadError(null);
    challenges.get(challengeId)
      .then((res) => {
        const c = res.data;
        setChallenge(c);
        // Pre-fill editor with starter code for the current language
        setCode(c.boilerplate?.[language] || "");
      })
      .catch((err) => setLoadError(err.message));
  }, [challengeId]);

  // Keep editor seeded when language switches
  useEffect(() => {
    if (challenge) {
      setCode((prev) => prev || challenge.boilerplate?.[language] || "");
    }
  }, [language]);

  // ── Handle language change ─────────────────────────────────────────────────
  function handleLanguageChange(lang) {
    setLanguage(lang);
    // Offer the starter code for the new language; don't clobber user's work
    if (!code.trim() && challenge) {
      setCode(challenge.boilerplate?.[lang] || "");
    }
  }

  // ── RUN — sandbox via Piston, sample tests only ───────────────────────────
  async function handleRun() {
    if (!code.trim()) return;
    const examples = challenge?.examples || [];

    setTermMode("run");
    setTermResults([]);
    setTermSummary(null);
    setRunning(true);

    try {
      if (examples.length === 0) {
        // No visible examples: run with empty stdin
        const out = await runCodeSandbox({ language, code, stdin: "" });
        setTermResults([{
          passed: out.exitCode === 0 && !out.stderr,
          status: out.stderr ? "Runtime Error" : "Accepted",
          is_hidden: false,
          input: "",
          expected: null,
          actual: out.stdout || "(no output)",
          stderr: out.stderr || null,
        }]);
        setTermSummary({ status: out.stderr ? "Runtime Error" : "Accepted", error: out.stderr });
      } else {
        const results = [];
        for (const ex of examples) {
          const out = await runCodeSandbox({ language, code, stdin: ex.input || "" });
          const passed = !out.stderr && out.stdout?.trim() === ex.output?.trim();
          results.push({
            passed,
            status: out.stderr ? "Runtime Error" : passed ? "Accepted" : "Wrong Answer",
            is_hidden: false,
            input:    ex.input || "(none)",
            expected: ex.output,
            actual:   out.stdout,
            stderr:   out.stderr || null,
          });
        }
        const passCount = results.filter((r) => r.passed).length;
        setTermResults(results);
        setTermSummary({
          status:       passCount === results.length ? "Accepted" : "Wrong Answer",
          passed_tests: passCount,
          total_tests:  results.length,
        });
      }
    } catch (err) {
      setTermResults([]);
      setTermSummary({ status: "Runtime Error", error: err.message });
    } finally {
      setRunning(false);
    }
  }

  // ── SUBMIT — full evaluation via backend ──────────────────────────────────
  async function handleSubmit() {
    if (!code.trim()) return;
    if (!user) { navigate("/login"); return; }

    setTermMode("submit");
    setTermResults([]);
    setTermSummary(null);
    setSubmitting(true);

    try {
      const res = await submissions.submit({
        challenge_id: parseInt(challengeId),
        language,
        code,
      });

      // The backend returns the submission object with per-test results
      // via evaluate_submission → per_test_results is NOT directly in the HTTP
      // response. The route returns passed_tests/total_tests on the submission.
      // We reconstruct a summary from what the route gives us.
      const sub = res.submission || {};

      // Build terminal results from what we have
      // (full per-test detail only lives inside scoring_service;
      //  the route exposes passed_tests, total_tests, stderr, stdout)
      setTermResults([]); // no per-test breakdown from this endpoint
      setTermSummary({
        status:       sub.status || (res.success ? "Accepted" : "Wrong Answer"),
        passed_tests: sub.passed_tests ?? res.passed_tests,
        total_tests:  sub.total_tests  ?? res.total_tests,
        score:        sub.score        ?? res.score,
        error:        res.success ? null : (sub.stderr || res.error || res.message),
      });
    } catch (err) {
      setTermSummary({
        status: "Runtime Error",
        error:  err.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loadError) return <ErrorScreen message={loadError} />;
  if (!challenge) return <LoadingScreen />;

  const diffColor = DIFFICULTY_COLOR[challenge.difficulty] || "#8b949e";

  return (
    <div style={styles.page}>
      {/* ── LEFT PANEL ── */}
      <div style={styles.left}>
        <div style={styles.meta}>
          <span style={{ ...styles.badge, background: diffColor + "22", color: diffColor }}>
            {challenge.difficulty}
          </span>
          <span style={styles.points}>+{challenge.points} pts</span>
          <span style={styles.time}>{challenge.time}</span>
        </div>

        <h1 style={styles.title}>{challenge.title}</h1>

        <div style={styles.description}
          dangerouslySetInnerHTML={{ __html: challenge.desc?.replace(/\n/g, "<br>") || "" }}
        />

        <TestCaseViewer
          examples={challenge.examples || []}
          hiddenCount={challenge.hiddenTests || 0}
        />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={styles.right}>
        {/* Editor fills available height */}
        <div style={styles.editorWrap}>
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            onLanguageChange={handleLanguageChange}
            starterCode={challenge.boilerplate || {}}
          />
        </div>

        {/* Run / Submit bar */}
        <SubmissionPanel
          onRun={handleRun}
          onSubmit={handleSubmit}
          running={running}
          submitting={submitting}
          disabled={!user}
        />

        {/* Terminal output */}
        <div style={styles.termWrap}>
          <Terminal
            results={termResults}
            summary={termSummary}
            loading={running || submitting}
            mode={termMode}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Sub-screens ──────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div style={styles.center}>
      <span style={styles.loadDot}>●</span>
      <span style={styles.loadText}>Loading challenge…</span>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={styles.center}>
      <p style={{ color: "#f85149", fontFamily: "monospace" }}>Error: {message}</p>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  page: {
    display: "flex",
    gap: "0",
    height: "calc(100vh - 56px)", // subtract nav height
    overflow: "hidden",
    background: "#0d1117",
    color: "#e6edf3",
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
  },
  left: {
    width: "38%",
    minWidth: "280px",
    overflowY: "auto",
    padding: "24px 20px 24px 28px",
    borderRight: "1px solid #21262d",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  badge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  points: {
    color: "#3fb950",
    fontSize: "12px",
    fontWeight: 700,
  },
  time: {
    color: "#8b949e",
    fontSize: "12px",
  },
  title: {
    fontSize: "20px",
    fontWeight: 800,
    margin: "0 0 14px",
    color: "#e6edf3",
    lineHeight: 1.3,
  },
  description: {
    fontSize: "14px",
    lineHeight: 1.75,
    color: "#cdd6f4",
    marginBottom: "22px",
  },
  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
  },
  editorWrap: {
    flex: "1 1 55%",
    overflow: "hidden",
    minHeight: "200px",
  },
  termWrap: {
    flex: "1 1 35%",
    overflow: "hidden",
    minHeight: "180px",
    borderTop: "1px solid #21262d",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    height: "60vh",
    color: "#8b949e",
    fontFamily: "monospace",
  },
  loadDot: {
    color: "#58a6ff",
    animation: "pulse 1s ease-in-out infinite",
  },
  loadText: {
    fontSize: "14px",
  },
};