import React from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

const SubmissionResult = ({ result, onClose, onResubmit }) => {
  if (!result) return null;

  const status = result.status;

  const config = {
    Accepted: { icon: <CheckCircle size={32} />, color: "#22c55e", label: "Accepted" },
    "Wrong Answer": { icon: <XCircle size={32} />, color: "#ef4444", label: "Wrong Answer" },
    "Runtime Error": { icon: <AlertTriangle size={32} />, color: "#f59e0b", label: "Runtime Error" },
  }[status] || {
    icon: <AlertTriangle size={32} />,
    color: "#f59e0b",
    label: status || "Error",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#0d1117",
          border: "1px solid #30363d",
          borderRadius: "12px",
          padding: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", color: "#8b949e", border: "none" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <div style={{ color: config.color }}>{config.icon}</div>
          <h2 style={{ color: config.color }}>{config.label}</h2>
          <p style={{ color: "#8b949e" }}>
            {result.passed_tests}/{result.total_tests} test cases passed
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "#8b949e" }}>Points</div>
            <div style={{ color: "#22c55e", fontWeight: "bold" }}>+{result.score || 0}</div>
          </div>

          <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "#8b949e" }}>Runtime</div>
            <div style={{ color: "#e6edf3" }}>{result.execution_time || 0}s</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button onClick={onResubmit} style={{ flex: 1, background: "#1f6feb", color: "white", padding: "10px", borderRadius: "8px", border: "none" }}>
            Try Again
          </button>

          <button onClick={onClose} style={{ flex: 1, background: "transparent", color: "#e6edf3", padding: "10px", borderRadius: "8px", border: "1px solid #30363d" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;