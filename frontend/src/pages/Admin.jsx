import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Admin() {
  const { token, user: me } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);
  const [broadcastForm, setBroadcastForm] = useState({ subject: "", message: "" });
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [search, setSearch] = useState("");

  function load() {
    setLoading(true);
    setError("");
    Promise.all([api.adminStats(token), api.adminListUsers(token)])
      .then(([statsData, usersData]) => {
        setStats(statsData);
        setUsers(usersData.users);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (me?.role === "admin") load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, me?.role]);

  if (me && me.role !== "admin") return <Navigate to="/dashboard" replace />;

  async function toggleRole(targetUser) {
    const nextRole = targetUser.role === "admin" ? "user" : "admin";
    setPendingId(targetUser._id);
    setError("");
    try {
      const data = await api.adminUpdateUserRole(token, targetUser._id, nextRole);
      setUsers((prev) => prev.map((u) => (u._id === data.user._id ? data.user : u)));
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingId(null);
    }
  }

  async function deleteUser(targetUser) {
    if (
      !window.confirm(
        `Delete ${targetUser.name} (${targetUser.email})? This permanently removes their account, business titles, and saved answers. This cannot be undone.`
      )
    ) {
      return;
    }
    setPendingId(targetUser._id);
    setError("");
    try {
      await api.adminDeleteUser(token, targetUser._id);
      setUsers((prev) => prev.filter((u) => u._id !== targetUser._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingId(null);
    }
  }

  async function handleBroadcast(e) {
    e.preventDefault();
    if (
      !window.confirm(
        `Send this email to ${optedInCount} opted-in user${optedInCount === 1 ? "" : "s"} right now?`
      )
    ) {
      return;
    }
    setBroadcastResult(null);
    setBroadcastSending(true);
    try {
      const data = await api.adminSendBroadcast(token, broadcastForm.subject, broadcastForm.message);
      setBroadcastResult({
        type: "success",
        text: `Sent to ${data.sent} of ${data.recipientCount} opted-in users.${
          data.failed ? ` ${data.failed} failed to send.` : ""
        }`,
      });
      setBroadcastForm({ subject: "", message: "" });
    } catch (err) {
      setBroadcastResult({ type: "error", text: err.message });
    } finally {
      setBroadcastSending(false);
    }
  }

  const optedInCount = users.filter((u) => u.emailOptIn !== false).length;

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">Admin</span>
          <h1>Platform overview</h1>
          <p className="muted">Users, plans, and quick role management.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="loading-text">Loading admin data...</p>
      ) : (
        <>
          {stats && (
            <div className="admin-stats-grid">
              <div className="stat-card">
                <div className="stat-card-icon">👥</div>
                <div>
                  <p className="stat-card-label">Users</p>
                  <p className="stat-card-value">{stats.userCount}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">🏢</div>
                <div>
                  <p className="stat-card-label">Businesses</p>
                  <p className="stat-card-value">{stats.businessCount}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">📝</div>
                <div>
                  <p className="stat-card-label">Answers</p>
                  <p className="stat-card-value">{stats.answerCount}</p>
                </div>
              </div>
              {stats.revenue && (
                <>
                  <div className="stat-card">
                    <div className="stat-card-icon">💰</div>
                    <div>
                      <p className="stat-card-label">Est. MRR</p>
                      <p className="stat-card-value">
                        $
                        {stats.revenue.mrr.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-icon">⭐</div>
                    <div>
                      <p className="stat-card-label">Members</p>
                      <p className="stat-card-value">{stats.revenue.memberCount}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-icon">🚀</div>
                    <div>
                      <p className="stat-card-label">Pro</p>
                      <p className="stat-card-value">{stats.revenue.proCount}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>Users</h2>
                <p className="muted" style={{ margin: "4px 0 0" }}>
                  {filteredUsers.length} of {users.length} shown
                </p>
              </div>
              <input
                type="search"
                className="admin-search"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Questions</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="admin-name-cell">
                          <span className="admin-avatar">{initials(u.name)}</span>
                          {u.name}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`pill pill-plan-${u.plan}`}>{u.plan}</span>
                      </td>
                      <td>
                        {u.questionsUsed} / {u.questionsQuota}
                      </td>
                      <td>
                        <span className={`pill pill-role-${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline"
                          disabled={pendingId === u._id || (u._id === me._id && u.role === "admin")}
                          onClick={() => toggleRole(u)}
                        >
                          {pendingId === u._id
                            ? "Saving..."
                            : u.role === "admin"
                              ? "Remove admin"
                              : "Make admin"}
                        </button>{" "}
                        <button
                          className="btn btn-outline"
                          disabled={pendingId === u._id || u._id === me._id}
                          onClick={() => deleteUser(u)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <p className="admin-empty">No users match "{search}".</p>}
            </div>
          </div>

          <div className="admin-section">
          <div className="email-broadcast">
            <div className="email-broadcast-header">
              <div>
                <h2>Email all opted-in users</h2>
                <p className="muted" style={{ margin: "4px 0 0" }}>
                  Sends immediately. Opted-out users are always skipped.
                </p>
              </div>
              <span className="email-broadcast-badge">
                ✉ {optedInCount} of {users.length} opted in
              </span>
            </div>

            <div className="email-broadcast-grid">
              <form onSubmit={handleBroadcast} className="email-broadcast-form">
                <div className="field">
                  <label htmlFor="broadcast-subject">Subject</label>
                  <input
                    id="broadcast-subject"
                    placeholder="A quick update from KnoUKno"
                    value={broadcastForm.subject}
                    onChange={(e) => setBroadcastForm((prev) => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                  <div className="hint">{broadcastForm.subject.length} characters</div>
                </div>
                <div className="field">
                  <label htmlFor="broadcast-message">Message</label>
                  <textarea
                    id="broadcast-message"
                    rows={8}
                    placeholder="Write your update here. Line breaks are kept as paragraphs."
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm((prev) => ({ ...prev, message: e.target.value }))}
                    required
                  />
                  <div className="hint">{broadcastForm.message.length} characters</div>
                </div>
                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={broadcastSending || !broadcastForm.subject.trim() || !broadcastForm.message.trim()}
                >
                  {broadcastSending
                    ? "Sending..."
                    : `Send to ${optedInCount} opted-in user${optedInCount === 1 ? "" : "s"}`}
                </button>
                {broadcastResult && (
                  <p className={broadcastResult.type === "success" ? "success-text" : "error-text"}>
                    {broadcastResult.text}
                  </p>
                )}
              </form>

              <div>
                <div className="email-preview-label">Live preview</div>
                <div className="email-preview">
                  <div className="email-preview-topbar">
                    <span className="logo-dot">K</span>
                    <span className="wordmark">
                      Kno U <span>Kno</span>
                    </span>
                  </div>
                  <div className="email-preview-body">
                    <p className="email-preview-subject">
                      {broadcastForm.subject.trim() || (
                        <span className="email-preview-placeholder">Subject line will appear here</span>
                      )}
                    </p>
                    <p>Hi there,</p>
                    {broadcastForm.message.trim() ? (
                      <p className="email-preview-message">{broadcastForm.message}</p>
                    ) : (
                      <p className="email-preview-placeholder">Your message will appear here as you type.</p>
                    )}
                    <p>
                      Know you know.
                      <br />
                      Kno U Kno
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
