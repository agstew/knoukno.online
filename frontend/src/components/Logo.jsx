export default function Logo({ small = false }) {
  return (
    <span className={`logo-mark ${small ? "logo-sm" : ""}`}>
      <svg className="logo-icon" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" rx="10" fill="#000000" stroke="#1e90ff" strokeWidth="2.5" />
        <text x="10" y="28" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="20" fill="#ffffff">
          K
        </text>
        <circle cx="27" cy="27" r="3" fill="#1e90ff" />
      </svg>
      <span className="logo-word">
        <span className="logo-white">Kno U</span> <span className="logo-blue">Kno</span>
      </span>
    </span>
  );
}
