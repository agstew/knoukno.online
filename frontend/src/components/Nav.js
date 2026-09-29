import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const { isAuthenticated, isAdmin, logout, tier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const focus = new URLSearchParams(location.search).get('focus') || '';
  const backendActive = (name) => {
    if (name === 'title') return location.pathname === '/list';
    if (name === 'questions') return ['/dashboard', '/title'].includes(location.pathname) && !focus;
    return ['/dashboard', '/title'].includes(location.pathname) && focus === name;
  };
  const backendClass = (name) => backendActive(name) ? 'nav-link active' : 'nav-link';
  const hasAdvancedTools = isAdmin || tier === 'members' || tier === 'pro';

  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)} aria-label="knoukno.online home">
          <span className="nav-mark" aria-hidden="true">K<span>.</span></span>
          <span className="nav-wordmark">knoukno<span>.online</span></span>
        </Link>

        <button type="button" className="nav-menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="site-navigation-links" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}
        </button>
        <div id="site-navigation-links" className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/list" className={backendClass('title')} onClick={() => setMenuOpen(false)}>Title</Link>
              <Link to="/dashboard?tab=questions" className={backendClass('questions')} onClick={() => setMenuOpen(false)}>Questions</Link>
              {hasAdvancedTools && (
                <>
                  <Link to="/dashboard?tab=questions&focus=grade" className={backendClass('grade')} onClick={() => setMenuOpen(false)}>Grade</Link>
                  <Link to="/dashboard?tab=questions&focus=rate" className={backendClass('rate')} onClick={() => setMenuOpen(false)}>Rated</Link>
                  <Link to="/dashboard?focus=average" className={backendClass('average')} onClick={() => setMenuOpen(false)}>Average</Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className={isActive('/admin')} onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button
                className="nav-link btn-nav"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/about" className={isActive('/about')} onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/price" className={isActive('/price')} onClick={() => setMenuOpen(false)}>Price</Link>
              <Link to="/login" className={isActive('/login')} onClick={() => setMenuOpen(false)}>Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
