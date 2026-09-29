import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await api.register({ name, email, password });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-side no-print">
        <h2>Name your business and answer the first question.</h2>
        <ul>
          <li>5 free questions for 3 days - no card required.</li>
          <li>Questions written around your business, in order: Law, Location, Hiring, People.</li>
          <li>Grade A-F, rank, and print a plan that's entirely in your own words.</li>
        </ul>
      </div>
      <div className="form-card" style={{ margin: "auto" }}>
        <h2>Register free</h2>
        <p className="subtitle">
          Name your business and answer the first question. The first five questions are free for
          three days. No card until you decide to keep going.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="hint">At least 8 characters.</div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Register free"}
          </button>
        </form>
        <p className="form-footnote">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
