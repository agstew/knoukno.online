import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { useSelectedTitle } from "../useSelectedTitle.js";

const GRADES = ["A", "B", "C", "D", "F"];

export default function Grade() {
  const { token } = useAuth();
  const { selectedId } = useSelectedTitle();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!selectedId) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.listGrades(token, selectedId);
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

  async function handleGrade(answerId, grade) {
    setError("");
    try {
      const data = await api.saveGrade(token, answerId, grade);
      setRows((prev) =>
        prev.map((row) => (row.answer._id === answerId ? { ...row, grade: data.grade.grade } : row))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">Grade</span>
          <h1>Grade your answers</h1>
          <p className="muted">Assign a letter grade (A-F) to each saved answer.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {selectedId && (
        <>
          {loading ? (
            <p className="loading-text">Loading answers...</p>
          ) : rows.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✍️</div>
              <p>
                <strong>No saved answers yet.</strong> Answer questions first, then grade them here.
              </p>
            </div>
          ) : (
            rows.map(({ answer, grade }) => (
              <div className="question-card" key={answer._id}>
                <p className="question-text">{answer.question.text}</p>
                <p className="muted">{answer.text}</p>
                <div className="answer-meta">
                  <select
                    className="grade-select"
                    value={grade || ""}
                    onChange={(e) => handleGrade(answer._id, e.target.value)}
                  >
                    <option value="">Grade</option>
                    {GRADES.map((g) => (
                      <option value={g} key={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {grade && <span className={`grade-badge ${grade}`}>{grade}</span>}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
