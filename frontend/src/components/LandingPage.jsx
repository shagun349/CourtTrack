import React from 'react';

export default function LandingPage({ onSelectionChange }) {
  return (
    <main className="landing">
      <div className="hero">
        <h1 className="hero-title">CourtTrack</h1>
        <p className="hero-sub">A clean, simple UI for tracking cases and judges.</p>

        <div className="hero-actions">
          <button onClick={() => onSelectionChange('cases')} className="btn primary">View Cases</button>
          <button onClick={() => onSelectionChange('judges')} className="btn">View Judges</button>
        </div>
      </div>
    </main>
  );
}
