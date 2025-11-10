import React, { useEffect, useState } from 'react';
import CountUp from './Counter';
import { fetchCaseCount, fetchUserCount } from '../api';
import heroImage from '../assets/hero-dashboard.svg';

export default function LandingPage({ onSelectionChange }) {
  const [totalCases, setTotalCases] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const count = await fetchCaseCount();
        if (!mounted) return;
        setTotalCases(Number(count) || 0);
        // fetch users count too
        try {
          const ucount = await fetchUserCount();
          if (mounted) setTotalUsers(Number(ucount) || 0);
        } catch (e) {
          console.error('Failed to fetch user count', e);
        }
      } catch (err) {
        console.error('Failed to fetch total cases', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="landing page-landing">
      <section className="hero hero-split">
        <div className="hero-left">
          <h1 className="hero-title">Effortless Court
            <br />Case Management</h1>
          <p className="hero-sub">The secure, all-in-one platform for tracking legal proceedings, connecting with counsel, and managing your case data.</p>

          <div className="hero-actions">
            <button className="btn primary" onClick={() => onSelectionChange && onSelectionChange('register')}>Register for Free</button>
            
          </div>
        </div>

        <div className="hero-right">
          {heroImage ? (
            <img src={heroImage} alt="Dashboard preview" className="hero-image" />
          ) : (
            <div className="hero-image placeholder">Preview</div>
          )}
        </div>
      </section>

      <section className="stats-row">
        <div className="stat">
          <div className="stat-num">
            {!loading ? <CountUp to={totalCases} duration={1} /> : '—'}
          </div>
          <div className="stat-label">Total Cases Tracked in DB</div>
        </div>
        <div className="stat">
          <div className="stat-num">{!loading ? <CountUp to={totalUsers} duration={1} /> : '—'}</div>
          <div className="stat-label">Total Users in DB</div>
        </div>
      </section>

      <section className="features">
        <h2 className="features-title">Why Choose CourtTrack?</h2>
        <p className="features-sub">Discover the core features that make managing your legal cases simple, secure, and efficient.</p>

        <div className="feature-cards">
          <div className="card">
            <div className="card-icon">📁</div>
            <h3>Centralized Case Database</h3>
            <p>Keep all your case information organized and accessible in one secure, centralized location.</p>
          </div>

          <div className="card">
            <div className="card-icon">📝</div>
            <h3>Request a Lawyer</h3>
            <p>Easily submit requests for legal counsel directly through the platform, connecting you with qualified professionals.</p>
          </div>

          <div className="card">
            <div className="card-icon">👥</div>
            <h3>View Lawyer Directory</h3>
            <p>Browse a comprehensive directory of experienced lawyers to find the right match for your case.</p>
          </div>

          <div className="card">
            <div className="card-icon">🔒</div>
            <h3>Secure Document Handling</h3>
            <p>Upload, store, and share sensitive documents with confidence using our encrypted handling system.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div className="footer-copy">© 2025 CourtTrack. All rights reserved.</div>
      </footer>
    </main>
  );
}
