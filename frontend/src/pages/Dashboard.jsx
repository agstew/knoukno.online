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

  return (
    <div className="dashboard container">
      <h1>Your businesses</h1>
      {user && (
        <p style={{ color: "var(--gray)" }}>
          Plan: <strong>{user.plan}</strong> - {user.questionsUsed}/{user.questionsQuota} questions used
        </p>
      )}

      <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input
          placeholder="Name your business"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8 }}
        />
        <button className="btn btn-primary" type="submit">
          Create
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : businesses.length === 0 ? (
        <p>No businesses yet. Name one above to answer your first question.</p>
      ) : (
        <div className="business-list">
          {businesses.map((b) => (
            <div className="business-item" key={b._id}>
              <span>{b.title}</span>
              <Link to={`/business/${b._id}`} className="btn btn-outline">
                Open
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
