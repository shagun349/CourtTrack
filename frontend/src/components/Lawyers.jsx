
import { useState, useEffect } from 'react';
import { fetchLawyers } from '../api';
import LawyerCard from './LawyerCard';

export default function Lawyers({ user, onSelectLawyer }) {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadLawyers = async () => {
      setLoading(true);
      try {
        const data = await fetchLawyers();
        if (mounted) {
          // Sort lawyers by wins in descending order, handling null values
          const sortedData = (data || []).sort((a, b) => (b.wins || 0) - (a.wins || 0));
          setLawyers(sortedData);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load lawyers');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadLawyers();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="lawyers-view">
      {loading && <div className="muted">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <div className="grid cards">
          {lawyers.map((l) => (
            <LawyerCard key={l.id} lawyer={l} user={user} onSelect={onSelectLawyer} />
          ))}
          {lawyers.length === 0 && <div className="muted">No lawyers found.</div>}
        </div>
      )}
    </div>
  );
}
