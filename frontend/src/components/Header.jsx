import React, { useState } from 'react';
import { logout } from '../api';

export default function Header({ selection, onChange, user, onSearch, onLogout }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('dark');

  // initialize theme on first render
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onChange(selection === 'judges' ? 'judges' : 'cases');
    onSearch(query);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="brand" onClick={() => onChange('landing')}>CourtTrack</div>
        {user && (
          <form className="search" onSubmit={handleSearchSubmit} role="search">
            <input
              aria-label="Search cases or judges"
              placeholder={`Search ${selection === 'judges' ? 'judges' : 'cases'}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        )}
      </div>

      <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main navigation">
        <button className={selection === 'landing' ? 'active' : ''} onClick={() => onChange('landing')}>Home</button>
        {user ? (
          <>
            <button className={selection === 'cases' ? 'active' : ''} onClick={() => onChange('cases')}>Cases</button>
            <button className={selection === 'judges' ? 'active' : ''} onClick={() => onChange('judges')}>Judges</button>
            <span className="user-name">Hi, {user.name} <span className="user-role">({user.role})</span></span>
            <button onClick={handleLogout}>Logout</button>
            <button className="theme-toggle" onClick={() => { const next = theme === 'dark' ? 'brown' : 'dark'; setTheme(next); document.documentElement.dataset.theme = next; }}>Theme</button>
          </>
        ) : (
          <>
            <button className={selection === 'login' ? 'active' : ''} onClick={() => onChange('login')}>Login</button>
            <button className={selection === 'register' ? 'active' : ''} onClick={() => onChange('register')}>Register</button>
          </>
        )}
      </nav>

      <button className="menu-toggle" onClick={() => setOpen((s) => !s)} aria-expanded={open} aria-label="Toggle menu">
        ☰
      </button>
    </header>
  );
}

