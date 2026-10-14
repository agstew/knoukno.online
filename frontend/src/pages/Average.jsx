import { useCallback, useEffect, useState } from "react";
import TitleSwitcher from "../components/TitleSwitcher.jsx";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { useSelectedTitle } from "../useSelectedTitle.js";

export default function Average() {
  const { token } = useAuth();
  const { titles, selectedId, selectTitle, loading: titlesLoading } = useSelectedTitle();
  const [average, setAverage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!selectedId) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.getAverage(token, selectedId);
      setAverage(data.average);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, selectedId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">Average</span>
          <h1>Your average</h1>
          <p className="muted">Average grade points and rating across your graded/rated answers.</p>
        </div>
      </div>

      {!titlesLoading && <TitleSwitcher titles={titles} selectedId={selectedId} onSelect={selectTitle} />}
      {error && <p className="error-text">{error}</p>}

      {selectedId && (
        <>
          {loading ? (
            <p className="loading-text">Loading average...</p>
          ) : (
            <div className="plan-meter" style={{ display: "flex", gap: 32 }}>
              <span>
                Average grade:{" "}
                <strong>
                  {average.averageGrade !== null ? `${average.averageGrade.toFixed(2)} / 4.00` : "No grades yet"}
                </strong>
              </span>
              <span>
                Average rate:{" "}
                <strong>{average.averageRate !== null ? average.averageRate.toFixed(2) : "No rates yet"}</strong>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
