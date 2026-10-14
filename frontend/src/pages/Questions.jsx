import { useCallback, useEffect, useMemo, useState } from "react";
import TitleSwitcher from "../components/TitleSwitcher.jsx";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { useSelectedTitle } from "../useSelectedTitle.js";

const STAGES = [
  {
    key: "law",
    label: "Law",
    description: "Choose the entity, register the name, and find out which licences and permits you need.",
  },
  {
    key: "location",
    label: "Location",
    description: "Defend the rent against the revenue you expect, the zoning, and your backup plan.",
  },
  {
    key: "hiring",
    label: "Hiring",
    description: "Decide what your first hire needs to cover and how you'll know within 30 days if it worked.",
  },
  {
    key: "people",
    label: "People",
    description: "Describe who your customers are, what problem brings them in, and what makes them return.",
  },
];

export default function Questions() {
  const { token, user, setUser } = useAuth();
  const { titles, selectedId, selectTitle, selectedTitle, loading: titlesLoading } = useSelectedTitle();
  const [stage, setStage] = useState("law");
  const [questions, setQuestions] = useState([]);
  const [answersByQuestion, setAnswersByQuestion] = useState({});
  const [drafts, setDrafts] = useState({});
  const [savedIds, setSavedIds] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [asking, setAsking] = useState(false);

  const load = useCallback(async () => {
    if (!selectedId) return;
    setLoading(true);
    setError("");
    try {
      const [qData, aData, meData] = await Promise.all([
        api.listQuestions(token, selectedId, stage),
        api.listAnswers(token, selectedId),
        api.me(token),
      ]);
      setQuestions(qData.questions);
      const byQ = {};
      aData.answers.forEach((a) => {
        byQ[a.question._id] = a;
      });
      setAnswersByQuestion(byQ);
      setUser(meData.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, selectedId, stage, setUser]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleNextQuestion() {
    setError("");
    setAsking(true);
    try {
      const data = await api.nextQuestion(token, selectedId, stage);
      setQuestions((prev) => [...prev, data.question]);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setAsking(false);
    }
  }

  async function handleSaveAnswer(questionId) {
    const text = drafts[questionId];
    if (!text || !text.trim()) return;
    try {
      const data = await api.saveAnswer(token, questionId, text);
      setAnswersByQuestion((prev) => ({ ...prev, [questionId]: data.answer }));
      setSavedIds((prev) => ({ ...prev, [questionId]: true }));
      setTimeout(() => setSavedIds((prev) => ({ ...prev, [questionId]: false })), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  const quotaRemaining = useMemo(
    () => (user ? Math.max(user.questionsQuota - user.questionsUsed, 0) : 0),
    [user]
  );
  const currentStage = STAGES.find((s) => s.key === stage);
  const answeredCount = questions.filter((q) => answersByQuestion[q._id]?.text).length;

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">Questions</span>
          <h1>{selectedTitle?.title || "Business plan"}</h1>
          <p className="muted">
            {answeredCount} of {questions.length} questions answered in {currentStage?.label}
          </p>
        </div>
        <button className="btn btn-outline no-print" onClick={() => window.print()}>
          🖨 Print plan
        </button>
      </div>

      {!titlesLoading && <TitleSwitcher titles={titles} selectedId={selectedId} onSelect={selectTitle} />}

      {selectedId && (
        <>
          <div className="stage-tabs">
            {STAGES.map((s) => (
              <button
                key={s.key}
                className={`stage-tab ${stage === s.key ? "active" : ""}`}
                onClick={() => setStage(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="stage-description">{currentStage?.description}</p>
          <p className="muted no-print">Questions remaining on your plan: {quotaRemaining}</p>
          {error && <p className="error-text">{error}</p>}

          {loading ? (
            <p className="loading-text">Loading your questions...</p>
          ) : (
            <>
              {questions.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">✍️</div>
                  <p>
                    <strong>No questions yet for {currentStage?.label}.</strong> Ask the first one below.
                  </p>
                </div>
              )}

              {questions.map((q, i) => {
                const answer = answersByQuestion[q._id];
                return (
                  <div className="question-card" key={q._id}>
                    <span className="question-index">Question {i + 1}</span>
                    <p className="question-text">{q.text}</p>
                    {q.example && (
                      <p className="question-example">
                        <strong>Example:</strong> {q.example}
                      </p>
                    )}
                    <textarea
                      className="answer-textarea"
                      rows={8}
                      defaultValue={answer?.text || ""}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [q._id]: e.target.value }))}
                      placeholder="Write your answer in your own words"
                    />
                    <div className="answer-meta no-print">
                      <button className="btn btn-outline" onClick={() => handleSaveAnswer(q._id)}>
                        Save answer
                      </button>
                      {savedIds[q._id] && <span className="save-indicator">Saved ✓</span>}
                    </div>
                  </div>
                );
              })}

              <button
                className="btn btn-primary no-print"
                onClick={handleNextQuestion}
                disabled={quotaRemaining <= 0 || asking}
              >
                {asking ? "Asking..." : "Ask the next question"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
