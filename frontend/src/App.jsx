import { useState, useEffect } from 'react';
import { fetchCases, fetchJudges, getCurrentUser } from './api';
import Header from './components/Header';
import CaseCard from './components/CaseCard';
import JudgeCard from './components/JudgeCard';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [selection, setSelection] = useState('landing');
  const [cases, setCases] = useState([]);
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      } else if (selection === 'judges') {
        setLoading(true);
        try {
          const data = await fetchJudges(searchQuery);
          if (!mounted) return;
          setJudges(data || []);
        } catch {
          if (!mounted) return;
          setError('Failed to load judges');
        } finally {
          if (mounted) setLoading(false);
        }
      }
    };

    if (user && (selection === 'cases' || selection === 'judges')) {
      load();
    }
    return () => {
      mounted = false;
    };
  }, [selection, searchQuery, user]);

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
    setUser(null);
    setSelection('landing');
    setCases([]);
    setJudges([]);
  };

  return (
    <div className="app-root">
      <Header 
        selection={selection} 
        onChange={setSelection}
        user={user}
        onSearch={handleSearch}
        onLogout={handleLogout}
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
                      <CaseCard key={c.id} item={c} />
                    ))}
                    {cases.length === 0 && <div className="muted">No cases found.</div>}
                  </div>
                )}

                {!loading && !error && selection === 'judges' && (
                  <div className="grid cards">
                    {judges.map((j) => (
                      <JudgeCard key={j.id} judge={j} />
                    ))}
                    {judges.length === 0 && <div className="muted">No judges found.</div>}
                  </div>
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