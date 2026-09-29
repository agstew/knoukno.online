import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const activeBusinessTitle = localStorage.getItem('kk_active_business_title') || '';
  const workspaceQuery = activeBusinessTitle ? `?${new URLSearchParams({ clientTitle: activeBusinessTitle }).toString()}` : '';
  const workspacePath = `/questions${workspaceQuery}`;
  const backendActive = (name) => {
    if (name === 'title') return location.pathname === '/list';
    if (!['/dashboard', '/title', '/questions'].includes(location.pathname)) return false;
    if (name === 'example') return location.hash === '#example-section';
    if (name === 'answers') return location.hash === '#answers-section';
    return name === 'questions' && !['#example-section', '#answers-section'].includes(location.hash);
  };
  const backendClass = (name) => backendActive(name) ? 'nav-link active' : 'nav-link';

  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-inner">
        <Link to={isAuthenticated ? '/list' : '/'} className="nav-brand" onClick={() => setMenuOpen(false)} aria-label="Kno U Kno home">
          <img className="nav-logo" src="/img/logo-mark.svg" alt="" width="36" height="36" />
          <span className="nav-wordmark">Kno U <span>Kno</span></span>
        </Link>

        <button type="button" className="nav-menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="site-navigation-links" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}
        </button>
        <div id="site-navigation-links" className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/list" className={backendClass('title')} onClick={() => setMenuOpen(false)}>Title</Link>
              <Link to={workspacePath} className={backendClass('questions')} onClick={() => setMenuOpen(false)}>Questions</Link>
              <Link to={`${workspacePath}#example-section`} className={backendClass('example')} onClick={() => setMenuOpen(false)}>Example</Link>
              <Link to={`${workspacePath}#answers-section`} className={backendClass('answers')} onClick={() => setMenuOpen(false)}>Answers</Link>
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
