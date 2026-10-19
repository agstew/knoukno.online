import { useState } from "react";
import { api } from "../api.js";

export default function Hiring() {
  const [form, setForm] = useState({ name: "", email: "", role: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.submitHiring(form);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ padding: "60px 24px" }}>
      <div className="form-card" style={{ margin: "0 auto" }}>
        <h2>Careers</h2>
        <p className="subtitle">Interested in working with us? Tell us a bit about yourself.</p>
        {sent ? (
          <p className="save-indicator">Thanks - your message has been sent. We'll get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="hiring-name">Name</label>
              <input
                id="hiring-name"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="hiring-email">Email</label>
              <input
                id="hiring-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="hiring-role">Role you're interested in</label>
              <input
                id="hiring-role"
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="hiring-message">Message</label>
              <textarea
                id="hiring-message"
                rows={6}
                required
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
