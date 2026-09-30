import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const EMPTY_FORM = { title: "", industry: "", location: "", description: "" };

export default function Dashboard() {
  const { token, user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listBusinesses(token)
      .then((data) => setBusinesses(data.businesses))
      .finally(() => setLoading(false));
  }, [token]);

  function updateField(key) {
    return (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return;
    try {
      const data = await api.createBusiness(token, form);
      setBusinesses([data.business, ...businesses]);
      setForm(EMPTY_FORM);
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
          <span className="section-eyebrow">Title</span>
          <h1>Name the business</h1>
          <p className="muted">
            Everything starts here. Add the title, trade, and location. Your questions and saved
            answers stay under the business you choose.
          </p>
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

      <form onSubmit={handleCreate} className="business-form">
        <div className="field">
          <label htmlFor="biz-title">Business title</label>
          <input
            id="biz-title"
            placeholder="Kno U Kno Coffee House"
            value={form.title}
            onChange={updateField("title")}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="biz-industry">Industry</label>
          <input
            id="biz-industry"
            placeholder="Food and drink"
            value={form.industry}
            onChange={updateField("industry")}
          />
        </div>
        <div className="field">
          <label htmlFor="biz-location">Location</label>
          <input
            id="biz-location"
            placeholder="Atlanta, GA"
            value={form.location}
            onChange={updateField("location")}
          />
        </div>
        <div className="field">
          <label htmlFor="biz-description">What is the business?</label>
          <input
            id="biz-description"
            placeholder="Two sentences on what you sell and who buys it."
            value={form.description}
            onChange={updateField("description")}
          />
        </div>
        <button className="btn btn-dark" type="submit">
          Save business title
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}

      <h2 style={{ marginTop: 40 }}>Your business titles</h2>
      {loading ? (
        <p className="loading-text">Loading your businesses...</p>
      ) : businesses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>
            <strong>No business title yet.</strong> Write one above and it will show up here.
          </p>
        </div>
      ) : (
        <div className="business-list">
          {businesses.map((b) => (
            <div className="business-item" key={b._id}>
              <div>
                <span className="biz-title">{b.title}</span>
                {(b.industry || b.location) && (
                  <div className="biz-meta">
                    {[b.industry, b.location].filter(Boolean).join(" \u2022 ")}
                  </div>
                )}
              </div>
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
