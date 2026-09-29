import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

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
const GRADES = ["A", "B", "C", "D", "F"];

export default function BusinessStage() {
  const { id: businessId } = useParams();
  const { token, user, setUser } = useAuth();
  const [business, setBusiness] = useState(null);
  const [stage, setStage] = useState("law");
  const [questions, setQuestions] = useState([]);
  const [answersByQuestion, setAnswersByQuestion] = useState({});
  const [drafts, setDrafts] = useState({});
  const [savedIds, setSavedIds] = useState({});
  const [average, setAverage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [asking, setAsking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [bData, qData, aData] = await Promise.all([
        business ? Promise.resolve({ business }) : api.getBusiness(token, businessId),
        api.listQuestions(token, businessId, stage),
        api.listAnswers(token, businessId),
      ]);
      setBusiness(bData.business);
      setQuestions(qData.questions);
      const byQ = {};
      aData.answers.forEach((a) => {
        byQ[a.question._id] = a;
      });
      setAnswersByQuestion(byQ);
      setAverage(aData.average);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, businessId, stage]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleNextQuestion() {
    setError("");
    setAsking(true);
    try {
      const data = await api.nextQuestion(token, businessId, stage);
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

  function updateAnswerInState(answer) {
    setAnswersByQuestion((prev) => {
      const next = { ...prev };
      const qid = Object.keys(next).find((k) => next[k]._id === answer._id);
      if (qid) next[qid] = answer;
      return next;
    });
  }

  async function handleGrade(answerId, grade) {
    try {
      const data = await api.gradeAnswer(token, answerId, grade);
      updateAnswerInState(data.answer);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRank(answerId, rank) {
    try {
      const data = await api.rankAnswer(token, answerId, Number(rank));
      updateAnswerInState(data.answer);
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
          <h1>{business?.title || "Business plan"}</h1>
          <p className="muted">
            {answeredCount} of {questions.length} questions answered in {currentStage?.label}
          </p>
        </div>
        <button className="btn btn-outline no-print" onClick={() => window.print()}>
          🖨 Print plan
        </button>
      </div>

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

      {average !== null && (
        <p>
          Average grade points: <strong>{average.toFixed(2)} / 4.00</strong>
        </p>
      )}
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
                <textarea
                  rows={4}
                  defaultValue={answer?.text || ""}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [q._id]: e.target.value }))}
                  placeholder="Write your answer in your own words"
                />
                <div className="answer-meta no-print">
                  <button className="btn btn-outline" onClick={() => handleSaveAnswer(q._id)}>
                    Save answer
                  </button>
                  {savedIds[q._id] && <span className="save-indicator">Saved ✓</span>}
                  {answer && (
                    <>
                      <select
                        className="grade-select"
                        value={answer.grade || ""}
                        onChange={(e) => handleGrade(answer._id, e.target.value)}
                      >
                        <option value="">Grade</option>
                        {GRADES.map((g) => (
                          <option value={g} key={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <input
                        className="rank-input"
                        type="number"
                        min={1}
                        placeholder="Rank"
                        defaultValue={answer.rank || ""}
                        onBlur={(e) => e.target.value && handleRank(answer._id, e.target.value)}
                        style={{ width: 70 }}
                      />
                    </>
                  )}
                </div>
                {answer?.grade && (
                  <span className={`grade-badge ${answer.grade}`} style={{ marginTop: 10 }}>
                    {answer.grade}
                  </span>
                )}
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
    </div>
  );
}
