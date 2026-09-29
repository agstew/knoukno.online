import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/client';

export default function ExamplePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [question, setQuestion] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10));
  const clientTitle = searchParams.get('clientTitle') || localStorage.getItem('kk_active_business_title') || '';
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch(`/api/questions?page=${page}&limit=1`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not load example.');
        setQuestion(data.questions?.[0] || null);
        setTotalPages(data.pages || 1);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, token]);

  const go = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    if (clientTitle) next.set('clientTitle', clientTitle);
    setSearchParams(next);
  };

  if (!clientTitle) {
    return <section className="workspace-page"><div className="empty-state"><h2>Choose a business title first</h2><Link className="btn btn-primary" to="/list">Open Title</Link></div></section>;
  }

  return (
    <section className="workspace-page">
      <header className="workspace-header">
        <p className="title-list-eyebrow">Example</p>
        <h1>{clientTitle}</h1>
        <p>Use the example to understand the shape of a strong response. Your answer should still be your own.</p>
      </header>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> : question ? (
        <article className="question-card">
          <div className="question-meta"><span className="question-number">Q{page}</span><span className="question-progress">Example {page} of {totalPages}</span></div>
          <h2 className="question-title">{question.questionText}</h2>
          <div className="question-example example-page-copy"><strong>Benchmark Guidance</strong>{question.example || 'No example has been added for this question yet.'}</div>
          <p className="answer-help">This is only an example. The answer still comes from you.</p>
          <div className="question-actions">
            <button className="btn btn-secondary" onClick={() => go(page - 1)} disabled={page <= 1}>Previous</button>
            <Link className="btn btn-primary" to={`/dashboard?${new URLSearchParams({ clientTitle, tab: 'questions', question: String(page) }).toString()}`}>Answer This Question</Link>
            <button className="btn btn-secondary" onClick={() => go(page + 1)} disabled={page >= totalPages}>Next</button>
          </div>
        </article>
      ) : <div className="empty-state"><h2>No example available</h2></div>}
    </section>
  );
}
