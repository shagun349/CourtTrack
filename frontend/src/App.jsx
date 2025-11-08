import { useState, useEffect } from 'react';
import { fetchCases, getCurrentUser, fetchNotifications, logout,fetchUnreadNotificationCount } from './api';
import Header from './components/Header';
import CaseCard from './components/CaseCard';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import AddCase from './components/AddCase';
import RequestCase from './components/RequestCase';
import Notifications from './components/Notifications';
import Lawyers from './components/Lawyers';

function App() {
  const [selection, setSelection] = useState('landing');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [lawyerEmailForRequest, setLawyerEmailForRequest] = useState(null);



  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'brekke');
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
      // fetchUnreadNotificationCount() returns a number (unread count).
      const unreadCount = await fetchUnreadNotificationCount();
      setUnreadNotifications(unreadCount ?? 0);
    } catch (err) {
      console.error("Failed to load unread notifications:", err);
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

  const handleApproveCase = (caseId) => {
    setCases(cases.map(c => c.id === caseId ? { ...c, status: 'approved' } : c));
  };

  const handleFlagCase = (caseId, status) => {
    setCases(cases.map(c => c.id === caseId ? { ...c, status: status } : c));
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
                      <CaseCard key={c.id} item={c} user={user} onDecline={handleDeclineCase} onApprove={handleApproveCase} onFlag={handleFlagCase} />
                    ))}
                    {cases.length === 0 && <div className="muted">No cases found.</div>}
                  </div>
                )}

                {selection === 'add-case' && user.role === 'lawyer' && <AddCase />}
                {selection === 'request-case' && user.role === 'client' && (
                  <RequestCase
                    lawyerEmail={lawyerEmailForRequest}
                    onClearLawyerEmail={() => setLawyerEmailForRequest(null)}
                  />
                )}
                {selection === 'notifications' && <Notifications onMarkAsRead={handleMarkNotificationsAsRead} />}
                {selection === 'lawyers' && (
                  <Lawyers 
                    user={user}
                    onSelectLawyer={(email) => {
                      setLawyerEmailForRequest(email);
                      setSelection('request-case');
                    }}
                  />
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;