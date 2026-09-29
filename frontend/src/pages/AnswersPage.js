import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/client';

export default function AnswersPage() {
  const [searchParams] = useSearchParams();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const clientTitle = searchParams.get('clientTitle') || localStorage.getItem('kk_active_business_title') || '';
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    apiFetch('/api/answers/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not load answers.');
        setAnswers((Array.isArray(data) ? data : []).filter(answer => answer.clientTitle === clientTitle));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [clientTitle, token]);

  if (!clientTitle) {
    return <section className="workspace-page"><div className="empty-state"><h2>Choose a business title first</h2><Link className="btn btn-primary" to="/list">Open Title</Link></div></section>;
  }

  return (
    <section className="workspace-page">
      <header className="workspace-header">
        <p className="title-list-eyebrow">Answers</p>
        <h1>{clientTitle}</h1>
        <p>Every saved answer for this business, kept together in one place.</p>
      </header>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> : answers.length ? (
        <div className="answers-list">
          {answers.map((answer, index) => {
            const question = typeof answer.questionId === 'object' ? answer.questionId : null;
            return (
              <article className="answer-card" key={answer._id}>
                <div className="answer-card-meta">
                  <span>Question {question?.questionNumber || index + 1}</span>
                  <span>{answer.grade != null ? `Grade ${answer.grade}%` : 'Not graded'}</span>
                  <span>{answer.rating != null ? `Rated ${answer.rating}/5` : 'Not rated'}</span>
                </div>
                <h2>{question?.questionText || 'Saved answer'}</h2>
                <p>{answer.answerText?.trim() || 'No answer text saved.'}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state"><h2>No answers yet</h2><p>Answer a question first and it will appear here.</p><Link className="btn btn-primary" to={`/dashboard?${new URLSearchParams({ clientTitle, tab: 'questions' }).toString()}`}>Open Questions</Link></div>
      )}
    </section>
  );
}
