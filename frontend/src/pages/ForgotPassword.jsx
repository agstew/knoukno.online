import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const data = await api.forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-side no-print">
        <h2>Forgot your password?</h2>
        <ul>
          <li>Enter the email on your account.</li>
          <li>We'll send a link to reset your password.</li>
          <li>The link expires in 1 hour.</li>
        </ul>
      </div>
      <div className="form-card" style={{ margin: "auto" }}>
        <h2>Reset your password</h2>
        <p className="subtitle">We'll email you a link to set a new password.</p>
        {message ? (
          <p className="save-indicator">{message}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
        <p className="form-footnote">
          Remembered it? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
