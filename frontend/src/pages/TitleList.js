import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

export default function TitleList() {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    apiFetch('/api/questions/titles', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load titles.');
        return res.json();
      })
      .then((data) => setTitles(Array.isArray(data) ? data.sort() : []))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <section className="title-list-page">
      <header className="title-list-header">
        <p className="title-list-eyebrow">Business workspace</p>
        <h1>Choose a Title</h1>
        <p>Select a business topic, then work through its questions one page at a time.</p>
      </header>

      {loading && <div className="spinner-wrap"><div className="spinner"></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && titles.length === 0 && (
        <div className="empty-state"><h3>No titles available</h3></div>
      )}
      <div className="title-list-grid">
        {titles.map((title) => (
          <Link
            key={title}
            className="title-list-link"
            to={`/title?${new URLSearchParams({ title, tab: 'questions' }).toString()}`}
          >
            <span>{title}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
