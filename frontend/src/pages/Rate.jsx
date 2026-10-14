import { useCallback, useEffect, useState } from "react";
import TitleSwitcher from "../components/TitleSwitcher.jsx";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { useSelectedTitle } from "../useSelectedTitle.js";

export default function Rate() {
  const { token } = useAuth();
  const { titles, selectedId, selectTitle, loading: titlesLoading } = useSelectedTitle();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!selectedId) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.listRates(token, selectedId);
      setRows(data.answers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, selectedId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRate(answerId, rate) {
    setError("");
    try {
      const data = await api.saveRate(token, answerId, Number(rate));
      setRows((prev) => prev.map((row) => (row.answer._id === answerId ? { ...row, rate: data.rate.rate } : row)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">Rate</span>
          <h1>Rate your answers</h1>
          <p className="muted">Give each saved answer a numeric rating.</p>
        </div>
      </div>

      {!titlesLoading && <TitleSwitcher titles={titles} selectedId={selectedId} onSelect={selectTitle} />}
      {error && <p className="error-text">{error}</p>}

      {selectedId && (
        <>
          {loading ? (
            <p className="loading-text">Loading answers...</p>
          ) : rows.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✍️</div>
              <p>
                <strong>No saved answers yet.</strong> Answer questions first, then rate them here.
              </p>
            </div>
          ) : (
            rows.map(({ answer, rate }) => (
              <div className="question-card" key={answer._id}>
                <p className="question-text">{answer.question.text}</p>
                <p className="muted">{answer.text}</p>
                <div className="answer-meta">
                  <input
                    className="rank-input"
                    type="number"
                    min={1}
                    placeholder="Rate"
                    defaultValue={rate || ""}
                    onBlur={(e) => e.target.value && handleRate(answer._id, e.target.value)}
                    style={{ width: 80 }}
                  />
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
