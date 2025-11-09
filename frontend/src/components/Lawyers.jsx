
import LawyerCard from './LawyerCard';

export default function Lawyers({ user, lawyers, onSelectLawyer }) {
  // Sort lawyers by wins in descending order, handling null values
  const sortedLawyers = (lawyers || []).sort((a, b) => (b.wins || 0) - (a.wins || 0));

  return (
    <div className="lawyers-view">
      <div className="grid cards">
        {sortedLawyers.map((l) => (
          <LawyerCard key={l.id} lawyer={l} user={user} onSelect={onSelectLawyer} />
        ))}
        {sortedLawyers.length === 0 && <div className="muted">No lawyers found.</div>}
      </div>
    </div>
  );
}
