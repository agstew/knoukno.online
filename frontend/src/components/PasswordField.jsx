import { useState } from "react";

export default function PasswordField({ id, label, value, onChange, hint, required = true, minLength }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="password-field">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "🙈" : "👁"}
        </button>
      </div>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}
