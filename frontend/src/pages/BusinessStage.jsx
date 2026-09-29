import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const STAGES = ["law", "location", "hiring", "people"];
const GRADES = ["A", "B", "C", "D", "F"];

export default function BusinessStage() {
  const { id: businessId } = useParams();
  const { token, user, setUser } = useAuth();
  const [stage, setStage] = useState("law");
  const [questions, setQuestions] = useState([]);
  const [answersByQuestion, setAnswersByQuestion] = useState({});
  const [drafts, setDrafts] = useState({});
  const [average, setAverage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [qData, aData] = await Promise.all([
        api.listQuestions(token, businessId, stage),
        api.listAnswers(token, businessId),
      ]);
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
  }, [token, businessId, stage]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleNextQuestion() {
    setError("");
    try {
      const data = await api.nextQuestion(token, businessId, stage);
      setQuestions((prev) => [...prev, data.question]);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveAnswer(questionId) {
    const text = drafts[questionId];
    if (!text || !text.trim()) return;
    try {
      const data = await api.saveAnswer(token, questionId, text);
      setAnswersByQuestion((prev) => ({ ...prev, [questionId]: data.answer }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleGrade(answerId, grade) {
    try {
      const data = await api.gradeAnswer(token, answerId, grade);
      setAnswersByQuestion((prev) => {
        const next = { ...prev };
        const qid = Object.keys(next).find((k) => next[k]._id === answerId);
        if (qid) next[qid] = data.answer;
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRank(answerId, rank) {
    try {
      const data = await api.rankAnswer(token, answerId, Number(rank));
      setAnswersByQuestion((prev) => {
        const next = { ...prev };
        const qid = Object.keys(next).find((k) => next[k]._id === answerId);
        if (qid) next[qid] = data.answer;
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  }

  const quotaRemaining = useMemo(
    () => (user ? Math.max(user.questionsQuota - user.questionsUsed, 0) : 0),
    [user]
  );

  return (
    <div className="dashboard container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Business plan</h1>
        <button className="btn btn-outline no-print" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <div className="stage-tabs">
        {STAGES.map((s) => (
          <button
            key={s}
            className={`stage-tab ${stage === s ? "active" : ""}`}
            onClick={() => setStage(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {average !== null && <p>Average grade points: {average.toFixed(2)} / 4.00</p>}
      <p className="no-print">Questions remaining on your plan: {quotaRemaining}</p>
      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {questions.map((q) => {
            const answer = answersByQuestion[q._id];
            return (
              <div className="question-card" key={q._id}>
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
              </div>
            );
          })}

          <button className="btn btn-primary no-print" onClick={handleNextQuestion} disabled={quotaRemaining <= 0}>
            Ask the next question
          </button>
        </>
      )}
    </div>
  );
}
