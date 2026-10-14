import { Link } from "react-router-dom";

export default function TitleSwitcher({ titles, selectedId, onSelect }) {
  if (titles.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✍️</div>
        <p>
          <strong>No business title yet.</strong>{" "}
          <Link to="/title">Create one first.</Link>
        </p>
      </div>
    );
  }

  if (titles.length === 1) {
    return <p className="muted">{titles[0].title}</p>;
  }

  return (
    <div className="field" style={{ maxWidth: 320 }}>
      <label htmlFor="title-switcher">Business title</label>
      <select id="title-switcher" value={selectedId} onChange={(e) => onSelect(e.target.value)}>
        {titles.map((t) => (
          <option key={t._id} value={t._id}>
            {t.title}
          </option>
        ))}
      </select>
    </div>
  );
}
