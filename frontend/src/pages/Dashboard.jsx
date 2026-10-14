import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { SELECTED_TITLE_STORAGE_KEY } from "../useSelectedTitle.js";

export default function Dashboard() {
  const { token, user, setUser } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDashboard(token)
      .then((result) => {
        setData(result);
        setUser(result.user);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, setUser]);

  const used = user?.questionsUsed ?? 0;
  const quota = user?.questionsQuota ?? 0;
  const percentUsed = quota > 0 ? Math.min((used / quota) * 100, 100) : 0;

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">Dashboard</span>
          <h1>Welcome back</h1>
          <p className="muted">A quick overview of your plan and business titles.</p>
        </div>
      </div>

      {user && (
        <div className="plan-meter">
          <div className="plan-meter-top">
            <span>
              Plan: <strong>{user.plan}</strong>
            </span>
            <span>
              {used} / {quota} questions used
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentUsed}%` }} />
          </div>
          {used >= quota && (
            <p style={{ margin: "10px 0 0", fontSize: 13.5 }}>
              You're out of questions on this plan. <Link to="/price">Upgrade or add a bonus block.</Link>
            </p>
          )}
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="loading-text">Loading your dashboard...</p>
      ) : (
        <>
          <div className="plan-meter" style={{ display: "flex", gap: 32 }}>
            <span>
              Business titles: <strong>{data.titleCount}</strong>
            </span>
            <span>
              Answers saved: <strong>{data.answeredCount}</strong>
            </span>
          </div>

          <h2 style={{ marginTop: 40 }}>Your business titles</h2>
          {data.titles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>
                <strong>No business title yet.</strong> <Link to="/title">Create one to get started.</Link>
              </p>
            </div>
          ) : (
            <div className="business-list">
              {data.titles.map((t) => (
                <div className="business-item" key={t._id}>
                  <div>
                    <span className="biz-title">{t.title}</span>
                    {(t.industry || t.location) && (
                      <div className="biz-meta">{[t.industry, t.location].filter(Boolean).join(" \u2022 ")}</div>
                    )}
                  </div>
                  <Link
                    to="/questions"
                    className="btn btn-outline"
                    onClick={() => localStorage.setItem(SELECTED_TITLE_STORAGE_KEY, t._id)}
                  >
                    Open →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
