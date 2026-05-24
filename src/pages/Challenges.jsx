import React, { useCallback } from "react";
import { PageLoader, ErrorMessage } from "../components/UI";
import ChallengeCard from "../components/ChallengeCard";
import { fetchChallenges } from "../services/api";
import { useAsync } from "../hooks/useAsync";

const Challenges = () => {
  const fetcher = useCallback(() => fetchChallenges(), []);
  const { data, loading, error, refetch } = useAsync(fetcher);

  const challengeList = Array.isArray(data) ? data : data?.data || [];

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#e6edf3" }}>All Challenges</h1>
        <p style={{ color: "#8b949e" }}>
          Test your skills, solve problems, and climb the leaderboard.
        </p>
      </div>

      {challengeList.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
            width: "100%",
          }}
        >
          {challengeList.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            color: "#8b949e",
            padding: "4rem 2rem",
            background: "#161b22",
            borderRadius: "10px",
            border: "1px solid #30363d",
          }}
        >
          No challenges available yet.
        </div>
      )}
    </div>
  );
};

export default Challenges;