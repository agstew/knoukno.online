import { useEffect, useState } from "react";
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
  const [broadcastStatus, setBroadcastStatus] = useState(null);
  const [broadcastSending, setBroadcastSending] = useState(false);

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

  async function handleBroadcast(e) {
    e.preventDefault();
    const recipientCount = users.filter((u) => u.emailOptIn !== false).length;
    if (
      !window.confirm(
        `Send this email to ${recipientCount} opted-in user${recipientCount === 1 ? "" : "s"}? This cannot be undone.`
      )
    ) {
      return;
    }
    setBroadcastStatus(null);
    setBroadcastSending(true);
    try {
      const data = await api.adminSendBroadcast(token, broadcastForm.subject, broadcastForm.message);
      setBroadcastStatus({
        type: "success",
        text:
          data.failed > 0
            ? `Sent to ${data.sent} of ${data.recipientCount} opted-in users (${data.failed} failed - try again later).`
            : `Sent to all ${data.sent} opted-in users.`,
      });
      setBroadcastForm({ subject: "", message: "" });
    } catch (err) {
      setBroadcastStatus({ type: "error", text: err.message });
    } finally {
      setBroadcastSending(false);
    }
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
            <div className="plan-meter" style={{ display: "flex", gap: 32 }}>
              <span>
                Users: <strong>{stats.userCount}</strong>
              </span>
              <span>
                Businesses: <strong>{stats.businessCount}</strong>
              </span>
              <span>
                Answers: <strong>{stats.answerCount}</strong>
              </span>
            </div>
          )}

          <h2>Users</h2>
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
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.plan}</td>
                    <td>
                      {u.questionsUsed} / {u.questionsQuota}
                    </td>
                    <td>{u.role}</td>
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
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="broadcast-card">
            <h2 style={{ marginTop: 0 }}>Email all opted-in users</h2>
            <p className="muted">
              This sends an email right away to every user who hasn't opted out ({" "}
              <strong>{users.filter((u) => u.emailOptIn !== false).length}</strong> of {users.length} users).
              Use it for announcements, outages, or anything every customer should see.
            </p>
            <form onSubmit={handleBroadcast} className="business-form">
              <div className="field">
                <label htmlFor="broadcast-subject">Subject line</label>
                <input
                  id="broadcast-subject"
                  placeholder="e.g. New feature: Payment schedule"
                  value={broadcastForm.subject}
                  onChange={(e) => setBroadcastForm((prev) => ({ ...prev, subject: e.target.value }))}
                  maxLength={150}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="broadcast-message">Message</label>
                <textarea
                  id="broadcast-message"
                  placeholder="Write the email body in plain text - line breaks are kept."
                  rows={6}
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm((prev) => ({ ...prev, message: e.target.value }))}
                  maxLength={5000}
                  required
                />
                <span className="hint">{broadcastForm.message.length} / 5000 characters</span>
              </div>
              <button
                className="btn btn-dark"
                type="submit"
                disabled={broadcastSending || !broadcastForm.subject.trim() || !broadcastForm.message.trim()}
              >
                {broadcastSending ? "Sending..." : "Send to all opted-in users"}
              </button>
            </form>
            {broadcastStatus && (
              <p className={broadcastStatus.type === "error" ? "error-text" : "success-text"}>
                {broadcastStatus.text}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
