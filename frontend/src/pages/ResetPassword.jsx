import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api.js";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.resetPassword({ email, token, password });
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="auth-layout">
        <div className="form-card" style={{ margin: "auto" }}>
          <h2>Reset your password</h2>
          <p className="error-text">
            This reset link is missing its token. Request a new one from the{" "}
            <Link to="/forgot-password">forgot password</Link> page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-side no-print">
        <h2>Set a new password.</h2>
        <ul>
          <li>Resetting for {email}.</li>
          <li>At least 8 characters.</li>
          <li>You'll be able to log in right after.</li>
        </ul>
      </div>
      <div className="form-card" style={{ margin: "auto" }}>
        <h2>Set a new password</h2>
        {done ? (
          <p className="save-indicator">Password updated. Taking you to login...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="password">New password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="hint">At least 8 characters.</p>
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Set new password"}
            </button>
          </form>
        )}
        <p className="form-footnote">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
