import React from 'react';

export default function JudgeCard({ judge }) {
  return (
    <article className="card judge-card">
      <h3 className="card-title">{judge.name}</h3>
      <p className="card-meta">Court: {judge.court || 'Unknown'}</p>
      <p className="card-body">Experience: {judge.experience || 'N/A'}</p>
    </article>
  );
}
