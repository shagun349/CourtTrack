import { useState, useRef, useEffect } from 'react';
import Magnet from './Magnet';
const Header = ({ selection, onChange, user, onSearch, onLogout, unreadNotifications }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navRef = useRef(null);
  const indicatorRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Position and animate the sliding indicator whenever selection or layout changes
  useEffect(() => {
    const updateIndicator = () => {
      const navEl = navRef.current;
      const ind = indicatorRef.current;
      if (!navEl || !ind) return;
      const active = navEl.querySelector(`[data-key="${selection}"]`);
      if (active) {
        const rect = active.getBoundingClientRect();
        const navRect = navEl.getBoundingClientRect();
        ind.style.left = `${rect.left - navRect.left}px`;
        ind.style.width = `${rect.width}px`;
        ind.style.opacity = '1';
      } else {
        // hide when there's no matching tab (e.g., on landing/login/register)
        ind.style.opacity = '0';
        ind.style.width = '0px';
      }
    };

    // initial position
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [selection, user]);

  return (
    <header>
      <div className="container header-content">
        <div className="logo">CourtTrack</div>
        
        <nav ref={navRef}>
          {/* sliding indicator behind active tab */}
          <div className="nav-indicator" ref={indicatorRef} aria-hidden="true" />
          {user && (
            <>
              <button 
                data-key="cases"
                className={selection === 'cases' ? 'active' : ''}
                onClick={() => onChange('cases')}
              >
                Cases
              </button>
              <button 
                data-key="lawyers"
                className={selection === 'lawyers' ? 'active' : ''}
                onClick={() => onChange('lawyers')}
              >
                Lawyers
              </button>
              {user.role === 'lawyer' && (
                <button 
                  data-key="add-case"
                  className={selection === 'add-case' ? 'active' : ''}
                  onClick={() => onChange('add-case')}
                >
                  Add Case
                </button>
              )}
              {user.role === 'client' && (
                <button 
                  data-key="request-case"
                  className={selection === 'request-case' ? 'active' : ''}
                  onClick={() => onChange('request-case')}
                >
                  Request Case
                </button>
              )}
            </>
          )}
        </nav>
        <div className="header-right">
          {user && (
            <form onSubmit={handleSearch} className="search-form">
              <input 
                type="search" 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <button type="submit">Search</button>
            </form>
          )}
          <div className="user-actions">
            {user ? (
              <>
                <span className="welcome-message">Welcome, {user.name}</span>
                <button className="notifications-btn" onClick={() => onChange('notifications')}>
                  🔔
                  {unreadNotifications > 0 && (
                    <span className="notification-count">{unreadNotifications}</span>
                  )}
                </button>
                <button className="btn" onClick={onLogout}>Logout</button>
              </>
            ) : (
             <>
  <Magnet padding={200} magnetStrength={10}>
    <button className="btn" id='login-btn' onClick={() => onChange('login')}>Login</button>
  </Magnet>

  <Magnet padding={200} magnetStrength={10}>
    <button className="btn" onClick={() => onChange('register')}>Register</button>
  </Magnet>
</>

            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

