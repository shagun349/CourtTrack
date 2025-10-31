import { useState, useEffect } from 'react';
import { fetchCases, getCurrentUser, fetchNotifications, logout } from './api';
import Header from './components/Header';
import CaseCard from './components/CaseCard';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import AddCase from './components/AddCase';
import RequestCase from './components/RequestCase';
import Notifications from './components/Notifications';

function App() {
  const [selection, setSelection] = useState('landing');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        // Token invalid or expired
        setUser(null);
      }
    };
    
    if (localStorage.getItem('token')) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setError(null);
      if (selection === 'cases') {
        setLoading(true);
        try {
          const data = await fetchCases(searchQuery);
          if (!mounted) return;
          setCases(data || []);
        } catch {
          if (!mounted) return;
          setError('Failed to load cases');
        } finally {
          if (mounted) setLoading(false);
        }
      }
    };

    if (user && selection === 'cases') {
      load();
    }
    return () => {
      mounted = false;
    };
  }, [selection, searchQuery, user]);

  useEffect(() => {
    const loadUnreadNotifications = async () => {
      try {
        const notifications = await fetchNotifications();
        setUnreadNotifications(notifications.filter(n => !n.is_read).length);
      } catch {
        // Ignore error
      }
    };

    if (user) {
      loadUnreadNotifications();
    }
  }, [user]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleLogin = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setSelection('cases');
    } catch {
      setError('Failed to get user data');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setSelection('landing');
    setCases([]);
  };

  const handleMarkNotificationsAsRead = () => {
    setUnreadNotifications(0);
  };

  const handleDeclineCase = (caseId) => {
    setCases(cases.filter(c => c.id !== caseId));
  };

  return (
    <div className="app-root">
      <Header 
        selection={selection} 
        onChange={setSelection}
        user={user}
        onSearch={handleSearch}
        onLogout={handleLogout}
        unreadNotifications={unreadNotifications}
      />

      <main className="container">
        {selection === 'landing' && <LandingPage onSelectionChange={setSelection} />}
        
        {selection === 'login' && <Login onLogin={handleLogin} />}
        {selection === 'register' && <Register onRegister={handleLogin} />}

        {selection !== 'landing' && selection !== 'login' && selection !== 'register' && (
          <section className="view">
            {!user ? (
              <div className="muted">Please log in to view content</div>
            ) : (
              <>
                {loading && <div className="muted">Loading...</div>}
                {error && <div className="error">{error}</div>}

                {!loading && !error && selection === 'cases' && (
                  <div className="grid cards">
                    {cases.map((c) => (
                      <CaseCard key={c.id} item={c} user={user} onDecline={handleDeclineCase} />
                    ))}
                    {cases.length === 0 && <div className="muted">No cases found.</div>}
                  </div>
                )}

                {selection === 'add-case' && user.role === 'lawyer' && <AddCase />}
                {selection === 'request-case' && user.role === 'client' && <RequestCase />}
                {selection === 'notifications' && <Notifications onMarkAsRead={handleMarkNotificationsAsRead} />}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;