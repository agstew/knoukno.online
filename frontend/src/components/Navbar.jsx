import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import Logo from "./Logo.jsx";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/price", label: "Price" },
  { to: "/login", label: "Login" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" onClick={closeMenu} aria-label="Kno U Kno home">
          <Logo />
        </Link>
        <button
          className="nav-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "\u2715" : "\u2630"}
        </button>
      </div>

      {open && (
        <div className="nav-overlay">
          <div className="nav-overlay-links">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={closeMenu}
                className={location.pathname === l.to ? "active" : ""}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link to="/dashboard" onClick={closeMenu} className={location.pathname === "/dashboard" ? "active" : ""}>
                Dashboard
              </Link>
            )}
          </div>
          <div className="nav-overlay-secondary">
            {user ? (
              <button onClick={handleLogout}>Log out</button>
            ) : (
              <Link to="/register" onClick={closeMenu}>
                Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
