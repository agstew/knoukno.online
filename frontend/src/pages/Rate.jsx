import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { useSelectedTitle } from "../useSelectedTitle.js";

export default function Rate() {
  const { token } = useAuth();
  const { selectedId } = useSelectedTitle();
  const [rows, setRows] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!selectedId) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.listRates(token, selectedId);
      setRows(data.answers);
      setDrafts({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, selectedId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRate(answerId, rawValue) {
    setError("");
    const rate = Number(rawValue);
    const inUseBy = rows.find((row) => row.answer._id !== answerId && row.rate === rate);
    if (inUseBy) {
      setError(
        `${rate} is already used for another answer. Each answer needs its own number - move that one first.`
      );
      setDrafts((prev) => ({ ...prev, [answerId]: "" }));
      return;
    }
    try {
      const data = await api.saveRate(token, answerId, rate);
      setRows((prev) => prev.map((row) => (row.answer._id === answerId ? { ...row, rate: data.rate.rate } : row)));
      setDrafts((prev) => ({ ...prev, [answerId]: undefined }));
    } catch (err) {
      setError(err.message);
    }
  }

  const sortedRows = useMemo(
    () =>
      [...rows].sort((a, b) => {
        if (a.rate == null && b.rate == null) return 0;
        if (a.rate == null) return 1;
        if (b.rate == null) return -1;
        return a.rate - b.rate;
      }),
    [rows]
  );

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">Rate</span>
          <h1>Rate your answers</h1>
          <p className="muted">Give each saved answer its own rank number - no two answers can share one.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {selectedId && (
        <>
          {loading ? (
            <p className="loading-text">Loading answers...</p>
          ) : sortedRows.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✍️</div>
              <p>
                <strong>No saved answers yet.</strong> Answer questions first, then rate them here.
              </p>
            </div>
          ) : (
            sortedRows.map(({ answer, rate }) => (
              <div className="question-card" key={answer._id}>
                <p className="question-text">{answer.question.text}</p>
                <p className="muted">{answer.text}</p>
                <div className="answer-meta">
                  <input
                    className="rank-input"
                    type="number"
                    min={1}
                    placeholder="Rate"
                    value={drafts[answer._id] ?? rate ?? ""}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [answer._id]: e.target.value }))}
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
