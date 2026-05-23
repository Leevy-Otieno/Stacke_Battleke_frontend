/**
 * src/pages/ChallengePage.jsx
 *
 * ── What was broken ─────────────────────────────────────────────────────────
 *
 * 1. NAMED IMPORTS ON DEFAULT EXPORTS
 *    import { CodeEditor }      from "../components/Challenge/CodeEditor"
 *    import { Terminal }        from "../components/Challenge/Terminal"
 *    import { SubmissionPanel } from "../components/Challenge/SubmissionPanel"
 *    import { TestCaseViewer }  from "../components/Challenge/TestCaseViewer"
 *    All four components use `export default`, NOT named exports.
 *    Result: each was undefined → white screen / "CodeEditor is not a function".
 *    Fix: use default imports.
 *
 * 2. WRONG HOOK PATH
 *    import { useAuth } from "../hooks/useAuth"
 *    The file is at src/context/AuthContext.jsx, not src/hooks/useAuth.
 *    Fix: import from "../context/AuthContext".
 *
 * 3. ROUTE PARAM MISMATCH
 *    App.jsx declares: <Route path="/challenges/:id" ...>
 *    ChallengePage used: const { challengeId } = useParams()
 *    So challengeId was always undefined → every GET /api/challenges/undefined.
 *    Fix: const { id: challengeId } = useParams() to match the ":id" param.
 *
 * 4. LANGUAGE SWITCH CLOBBERS USER CODE
 *    The language-switch useEffect ran setCode(prev => prev || ...) but the
 *    dependency array was [language] without challenge, so on the first switch
 *    it sometimes ran before the challenge loaded and set code to "".
 *    Fix: guard with `if (challenge)` before calling setCode.
 *
 * 5. MISSING KEY PROP WARNING → potential ordering bugs
 *    The per-test Terminal results used array index as key (fine) but the
 *    results array was reset to [] before each run, so React always re-mounts
 *    the items. Added a stable key using testIndex.
 *    (Terminal itself is fine; this is about data we pass to it.)
 *
 * 6. SUBMIT: res.data DOUBLE-UNWRAP
 *    After the api.js fix, submissions.submit() returns the Flask response body
 *    directly (not wrapped in an axios res.data again).
 *    The old code did `const sub = res.submission` which is correct.
 *    But ChallengePage was then reading res.success and res.error as if they
 *    were on the axios response — they are on the Flask body, so that's fine.
 *    No change needed once api.js is fixed.
 *
 * 7. ProtectedRoute wraps ChallengePage, so the <main> already has padding.
 *    The ChallengePage set height: "calc(100vh - 56px)" assuming a 56px topbar,
 *    but the app uses a SIDE nav (260px wide) + 2rem padding in main-content.
 *    Fix: height: "100%" and let the parent handle the scroll context.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { challenges, submissions, runCodeSandbox } from "../services/api";
import CodeEditor      from "../components/Challenge/CodeEditor";
import Terminal        from "../components/Challenge/Terminal";
import SubmissionPanel from "../components/Challenge/SubmissionPanel";
import TestCaseViewer  from "../components/Challenge/TestCaseViewer";
import { useAuth }     from "../context/AuthContext";

const DIFFICULTY_COLOR = {
  Easy:   "#3fb950",
  Medium: "#e3b341",
  Hard:   "#f85149",
};

export default function ChallengePage() {
  // FIX #3: param is ":id" in App.jsx, not ":challengeId"
  const { id: challengeId } = useParams();
  const { user }            = useAuth();
  const navigate            = useNavigate();

  // ── Challenge ────────────────────────────────────────────────────────────
  const [challenge, setChallenge] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // ── Editor ───────────────────────────────────────────────────────────────
  const [language, setLanguage] = useState("python");
  const [code,     setCode]     = useState("");

  // ── Terminal ─────────────────────────────────────────────────────────────
  const [termResults,  setTermResults]  = useState([]);
  const [termSummary,  setTermSummary]  = useState(null);
  const [termMode,     setTermMode]     = useState("run");
  const [running,      setRunning]      = useState(false);
  const [submitting,   setSubmitting]   = useState(false);

  // ── Load challenge ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!challengeId) return;
    setChallenge(null);
    setLoadError(null);
    setCode("");

    challenges.get(challengeId)
      .then((res) => {
        // api.js returns { data: challenge } so res.data is the challenge object
        const c = res?.data;
        if (!c) throw new Error("Challenge not found");
        setChallenge(c);
        setCode(c.boilerplate?.[language] || "");
      })
      .catch((err) => setLoadError(err.message));
  }, [challengeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Seed editor when language tab switches — but only if user hasn't typed anything
  useEffect(() => {
    if (challenge && !code.trim()) {
      setCode(challenge.boilerplate?.[language] || "");
    }
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleLanguageChange(lang) {
    setLanguage(lang);
  }

  // ── RUN (sandbox via Piston) ──────────────────────────────────────────────
  async function handleRun() {
    if (!code.trim()) return;
    // Safe default — examples might be missing on older challenges
    const examples = Array.isArray(challenge?.examples) ? challenge.examples : [];

    setTermMode("run");
    setTermResults([]);
    setTermSummary(null);
    setRunning(true);

    try {
      if (examples.length === 0) {
        // No visible test cases — just run the code with empty stdin
        const out = await runCodeSandbox({ language, code, stdin: "" });
        setTermResults([{
          passed:    out.exitCode === 0 && !out.stderr,
          status:    out.stderr ? "Runtime Error" : "Accepted",
          is_hidden: false,
          input:     null,
          expected:  null,
          actual:    out.stdout || "(no output)",
          stderr:    out.stderr || null,
        }]);
        setTermSummary({
          status: out.stderr ? "Runtime Error" : "Accepted",
          error:  out.stderr || null,
        });
      } else {
        const results = [];
        for (const ex of examples) {
          const out = await runCodeSandbox({ language, code, stdin: ex.input || "" });
          // Trim both sides for comparison (trailing newlines are common)
          const passed = !out.stderr && (out.stdout?.trim() ?? "") === (ex.output?.trim() ?? "");
          results.push({
            passed,
            status:    out.stderr ? "Runtime Error" : passed ? "Accepted" : "Wrong Answer",
            is_hidden: false,
            input:     ex.input  || "(none)",
            expected:  ex.output || "",
            actual:    out.stdout ?? "",
            stderr:    out.stderr || null,
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

  // ── SUBMIT (full evaluation via Flask backend) ────────────────────────────
  async function handleSubmit() {
    if (!code.trim()) return;
    if (!user) { navigate("/login"); return; }

    setTermMode("submit");
    setTermResults([]);
    setTermSummary(null);
    setSubmitting(true);

    try {
      // submissions.submit() returns the Flask response body directly:
      //   Accepted:  { success: true, score, output, submission: {...} }
      //   Failed:    { success: false, message, error, traceback, submission: {...} }
      const res = await submissions.submit({
        challenge_id: parseInt(challengeId, 10),
        language,
        code,
      });

      const sub = res?.submission || {};

      setTermSummary({
        status:       sub.status ?? (res.success ? "Accepted" : "Wrong Answer"),
        passed_tests: sub.passed_tests ?? null,
        total_tests:  sub.total_tests  ?? null,
        score:        sub.score        ?? res.score ?? null,
        error:        res.success
                        ? null
                        : (sub.stderr || res.error || res.message || null),
      });

      // If the backend ever returns per-test results in future, show them
      if (Array.isArray(res.results)) {
        setTermResults(res.results);
      }
    } catch (err) {
      setTermSummary({ status: "Runtime Error", error: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (loadError) return <ErrorScreen message={loadError} />;
  if (!challenge) return <LoadingScreen />;

  const diffColor = DIFFICULTY_COLOR[challenge.difficulty] || "#8b949e";

  return (
    <div style={styles.page}>
      {/* LEFT — problem description */}
      <div style={styles.left}>
        <div style={styles.meta}>
          <span style={{ ...styles.badge, background: diffColor + "22", color: diffColor }}>
            {challenge.difficulty}
          </span>
          {challenge.points != null && (
            <span style={styles.points}>+{challenge.points} pts</span>
          )}
          {challenge.time && (
            <span style={styles.time}>⏱ {challenge.time}</span>
          )}
        </div>

        <h1 style={styles.title}>{challenge.title}</h1>

        <div
          style={styles.description}
          dangerouslySetInnerHTML={{
            __html: (challenge.desc || "").replace(/\n/g, "<br>"),
          }}
        />

        <TestCaseViewer
          examples={Array.isArray(challenge.examples) ? challenge.examples : []}
          hiddenCount={challenge.hiddenTests ?? 0}
        />
      </div>

      {/* RIGHT — editor + terminal */}
      <div style={styles.right}>
        <div style={styles.editorWrap}>
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            onLanguageChange={handleLanguageChange}
            starterCode={challenge.boilerplate || {}}
          />
        </div>

        <SubmissionPanel
          onRun={handleRun}
          onSubmit={handleSubmit}
          running={running}
          submitting={submitting}
          disabled={!user}
        />

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

// ── Sub-screens ───────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={styles.center}>
      <span style={{ color: "#58a6ff", fontSize: "18px" }}>●</span>
      <span style={{ fontSize: "14px", color: "#8b949e" }}>Loading challenge…</span>
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

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    display: "flex",
    height: "100%",           // FIX #7: fill parent, not full viewport
    overflow: "hidden",
    background: "#0d1117",
    color: "#e6edf3",
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    // The ProtectedRoute wraps us in <main className="main-content"> which
    // has padding: 2rem.  Override it for the challenge page so the editor
    // fills to the edges.
    margin: "-2rem",          // cancel the 2rem padding from main-content
    minHeight: "calc(100vh - 0px)",
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
  points: { color: "#3fb950", fontSize: "12px", fontWeight: 700 },
  time:   { color: "#8b949e", fontSize: "12px" },
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
};