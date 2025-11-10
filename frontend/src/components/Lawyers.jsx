
import { useState, useMemo } from 'react';
import LawyerCard from './LawyerCard';

export default function Lawyers({ user, lawyers, onSelectLawyer }) {
  const [filter, setFilter] = useState('all');

  const displayedLawyers = useMemo(() => {
    if (!lawyers) return [];
    const arr = [...lawyers];
    switch (filter) {
      case 'most_wins':
        return arr.sort((a, b) => (b.wins || 0) - (a.wins || 0));
      case 'highest_approval':
        return arr.sort((a, b) => (b.approval_rate || 0) - (a.approval_rate || 0));
      case 'most_cases':
        return arr.sort((a, b) => (b.total_cases || 0) - (a.total_cases || 0));
      case 'alphabetical':
        return arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      default:
        return arr;
    }
  }, [lawyers, filter]);

  return (
    <div className="lawyers-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Lawyers</h2>
        <div>
          <label style={{ marginRight: 8 }} htmlFor="lawyer-filter">Sort:</label>
          <select id="lawyer-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Default</option>
            <option value="most_wins">Most wins</option>
            <option value="highest_approval">Highest approval</option>
            <option value="most_cases">Most cases</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="grid cards">
        {displayedLawyers.map((l) => (
          <LawyerCard key={l.id} lawyer={l} user={user} onSelect={onSelectLawyer} />
        ))}
        {displayedLawyers.length === 0 && <div className="muted">No lawyers found.</div>}
      </div>
    </div>
  );
}
