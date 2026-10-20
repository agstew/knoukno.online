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
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

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
    const current = rows.find((row) => row.answer._id === answerId);
    const conflict = rows.find((row) => row.answer._id !== answerId && row.rate === rate);

    try {
      if (conflict) {
        // Bumping into a number someone else already has - move that one out of the way
        // automatically: give it the number this answer is leaving behind, or send it to
        // the end of the list if this answer didn't have a number yet.
        const maxRate = rows.reduce((max, row) => Math.max(max, row.rate || 0), 0);
        const vacatedRate = current?.rate ?? maxRate + 1;
        const conflictData = await api.saveRate(token, conflict.answer._id, vacatedRate);
        setRows((prev) =>
          prev.map((row) => (row.answer._id === conflict.answer._id ? { ...row, rate: conflictData.rate.rate } : row))
        );
      }
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

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pagedRows = useMemo(
    () => sortedRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedRows, page]
  );

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">Rate</span>
          <h1>Rate your answers</h1>
          <p className="muted">
            Rank each saved answer with its own number. If you give one a number another answer
            already has, that one automatically moves to make room.
          </p>
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
            <>
              {pagedRows.map(({ answer, rate }) => (
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
              ))}
              {pageCount > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    className="btn-outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ← Prev
                  </button>
                  <span className="pagination-status">
                    Page {page} of {pageCount}
                  </span>
                  <button
                    type="button"
                    className="btn-outline"
                    disabled={page >= pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
