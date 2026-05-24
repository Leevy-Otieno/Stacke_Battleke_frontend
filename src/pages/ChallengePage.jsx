import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { challenges, submissions } from "../services/api";
import CodeEditor from "../components/Challenge/CodeEditor";
import Terminal from "../components/Challenge/Terminal";
import SubmissionPanel from "../components/Challenge/SubmissionPanel";
import TestCaseViewer from "../components/Challenge/TestCaseViewer";
import { useAuth } from "../context/AuthContext";

const DIFFICULTY_COLOR = {
  Easy: "#3fb950",
  Medium: "#e3b341",
  Hard: "#f85149",
};

export default function ChallengePage() {
  const { id: challengeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");

  const [termResults, setTermResults] = useState([]);
  const [termSummary, setTermSummary] = useState(null);
  const [termMode, setTermMode] = useState("run");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!challengeId) return;
    setChallenge(null);
    setLoadError(null);
    setCode("");

    challenges.get(challengeId)
      .then((res) => {
        const c = res?.data;
        if (!c) throw new Error("Challenge not found");
        setChallenge(c);
        setCode(c.boilerplate?.[language] || "");
      })
      .catch((err) => setLoadError(err.message));
  }, [challengeId]);

  function handleLanguageChange(lang) {
    setLanguage(lang);
    if (challenge) {
      setCode(challenge.boilerplate?.[lang] || "");
    }
  }

  async function handleRun() {
    if (!code.trim()) return;
    setTermMode("run");
    setRunning(true);
    await handleSubmit();
    setRunning(false);
  }

  async function handleSubmit() {
    if (!code.trim()) return;
    if (!user) { navigate("/login"); return; }

    if (termMode !== "run") {
      setTermMode("submit");
      setSubmitting(true);
    }
    
    setTermResults([]);
    setTermSummary(null);

    try {
      const res = await submissions.submit({
        challenge_id: parseInt(challengeId, 10),
        language,
        code,
      });

      if (!res.success) {
        setTermSummary({ status: "Runtime Error", error: res.error || res.traceback });
        return;
      }

      const result = res.result || {};
      const sub = res.submission || {};

      setTermSummary({
        status: sub.status ?? "Error",
        passed_tests: sub.passed_tests ?? null,
        total_tests: sub.total_tests ?? null,
        score: sub.score ?? null,
        error: sub.stderr || null, 
      });

      if (Array.isArray(result.test_results)) {
        const formattedResults = result.test_results.map((tc) => ({
          status: tc.status,
          passed: tc.status === "Accepted",
          is_hidden: tc.is_hidden,
          expected: tc.expected !== null ? JSON.stringify(tc.expected) : null,
          actual: tc.actual !== null ? JSON.stringify(tc.actual) : null,
          stdout: sub.stdout || null, 
        }));
        
        setTermResults(formattedResults);
      }
    } catch (err) {
      setTermSummary({ status: "Runtime Error", error: err.message });
    } finally {
      if (termMode !== "run") {
        setSubmitting(false);
      }
    }
  }

  if (loadError) return <ErrorScreen message={loadError} />;
  if (!challenge) return <LoadingScreen />;

  const diffColor = DIFFICULTY_COLOR[challenge.difficulty] || "#8b949e";

  return (
    <div style={styles.page}>
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

const styles = {
  page: {
    display: "flex",
    height: "100%",           
    overflow: "hidden",
    background: "#0d1117",
    color: "#e6edf3",
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    margin: "-2rem",          
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