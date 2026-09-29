import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import Logo from "./Logo.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <div className="announcement-bar">
        Free trial: <strong>5 questions, 3 days</strong> - no card required
      </div>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" onClick={closeMenu}>
            <Logo />
          </Link>
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "\u2715" : "\u2630"}
          </button>
          <div className={`nav-links ${open ? "open" : ""}`}>
            <Link to="/price" onClick={closeMenu}>
              Price
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={closeMenu}>
                  Dashboard
                </Link>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                  Register free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
