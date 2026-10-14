import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { SELECTED_TITLE_STORAGE_KEY } from "../useSelectedTitle.js";

const EMPTY_FORM = { title: "", industry: "", location: "", description: "" };

export default function Title() {
  const { token } = useAuth();
  const [titles, setTitles] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listTitles(token)
      .then((data) => setTitles(data.titles))
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
      const data = await api.createTitle(token, form);
      setTitles([data.title, ...titles]);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(t) {
    if (!window.confirm(`Delete "${t.title}"? This also deletes its questions, answers, grades, and rates.`)) {
      return;
    }
    setError("");
    try {
      await api.deleteTitle(token, t._id);
      setTitles((prev) => prev.filter((item) => item._id !== t._id));
      if (localStorage.getItem(SELECTED_TITLE_STORAGE_KEY) === t._id) {
        localStorage.removeItem(SELECTED_TITLE_STORAGE_KEY);
      }
    } catch (err) {
      setError(err.message);
    }
  }

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
      ) : titles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>
            <strong>No business title yet.</strong> Write one above and it will show up here.
          </p>
        </div>
      ) : (
        <div className="business-list">
          {titles.map((t) => (
            <div className="business-item" key={t._id}>
              <div>
                <span className="biz-title">{t.title}</span>
                {(t.industry || t.location) && (
                  <div className="biz-meta">{[t.industry, t.location].filter(Boolean).join(" \u2022 ")}</div>
                )}
              </div>
              <div className="business-item-actions">
                <Link
                  to="/questions"
                  className="btn btn-outline"
                  onClick={() => localStorage.setItem(SELECTED_TITLE_STORAGE_KEY, t._id)}
                >
                  Open →
                </Link>
                <button type="button" className="btn btn-outline btn-danger" onClick={() => handleDelete(t)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
