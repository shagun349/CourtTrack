import { useState } from 'react';

const Header = ({ selection, onChange, user, onSearch, onLogout, unreadNotifications }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header>
      <div className="container header-content">
        <div className="logo">CourtTrack</div>
        <nav>
          {user && (
            <>
              <button 
                className={selection === 'cases' ? 'active' : ''} 
                onClick={() => onChange('cases')}
              >
                Cases
              </button>
              {user.role === 'lawyer' && (
                <button 
                  className={selection === 'add-case' ? 'active' : ''} 
                  onClick={() => onChange('add-case')}
                >
                  Add Case
                </button>
              )}
              {user.role === 'client' && (
                <button 
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
                <button className="btn" onClick={() => onChange('login')}>Login</button>
                <button className="btn" onClick={() => onChange('register')}>Register</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

