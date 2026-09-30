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
    // Commit the route change before clearing the token so a ProtectedRoute
    // on the current page can't race the navigate and redirect to /login instead.
    navigate("/", { replace: true });
    closeMenu();
    setTimeout(() => logout(), 0);
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
            {LINKS.filter((l) => l.to !== "/login" || !user).map((l) => (
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
