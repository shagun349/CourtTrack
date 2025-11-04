import React, { useEffect, useState } from 'react';
import CountUp from './Counter';
import { fetchCaseCount } from '../api';
import { useRef } from 'react';
import VariableProximity from './VariableProximity';



export default function LandingPage() {
  const [totalCases, setTotalCases] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const count = await fetchCaseCount();
        if (!mounted) return;
        setTotalCases(Number(count) || 0);
      } catch (err) {
        console.error('Failed to fetch total cases', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);
const containerRef = useRef(null);
  return (
    
    <main className="landing">

      <div className="hero">
        <h1 className="hero-title">CourtTrack</h1>
        <p className="hero-sub">A clean, simple UI for tracking cases and judges.</p>

        <div className="hero-stats" style={{marginTop:16}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:14,color:'var(--muted)'}}>Total cases tracked in our database</div>
            {!loading ? (
              <div style={{fontSize:36,fontWeight:700}}>
                <CountUp to={totalCases} duration={2} />
              </div>
            ) : (
              <div className="muted">Loading...</div>
            )}
          </div>
        </div>
      </div>
      <h1 className="hero-title">What is CourtTrack?</h1>
           <div
ref={containerRef}
style={{position: 'relative'}}
>
  <VariableProximity
    label={'CourtTrack is a secure legal case and document management system designed to help lawyers and clients stay organized and efficient. The platform enables seamless case tracking, structured document storage, hearing schedule management, and quick case retrieval through a role-based dashboard system. With dedicated access for lawyers and clients, CourtTrack ensures accurate case monitoring, streamlined workflows, and improved legal practice management from one centralized place.'}
    className={'variable-proximity-demo'}
    fromFontVariationSettings="'wght' 400, 'opsz' 9"
    toFontVariationSettings="'wght' 1000, 'opsz' 40"
    containerRef={containerRef}
    radius={100}
    falloff='linear'
  />
</div>
    </main>
    
  );
}
