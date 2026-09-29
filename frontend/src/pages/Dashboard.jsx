import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listBusinesses(token)
      .then((data) => setBusinesses(data.businesses))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return;
    try {
      const data = await api.createBusiness(token, title);
      setBusinesses([data.business, ...businesses]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  }

  const used = user?.questionsUsed ?? 0;
  const quota = user?.questionsQuota ?? 0;
  const percentUsed = quota > 0 ? Math.min((used / quota) * 100, 100) : 0;

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <h1>Your businesses</h1>
          <p className="muted">Name a business, then work through Law, Location, Hiring, and People.</p>
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

      <form onSubmit={handleCreate} className="create-business-form">
        <input
          placeholder="Name your business, e.g. Riverside Coffee Co."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Create
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="loading-text">Loading your businesses...</p>
      ) : businesses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>
            <strong>No businesses yet.</strong> Name one above to answer your first question.
          </p>
        </div>
      ) : (
        <div className="business-list">
          {businesses.map((b) => (
            <div className="business-item" key={b._id}>
              <span className="biz-title">{b.title}</span>
              <Link to={`/business/${b._id}`} className="btn btn-outline">
                Open →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
