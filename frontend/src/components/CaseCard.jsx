import React from 'react';

export default function CaseCard({ item }) {
  return (
    <article className="card case-card">
      <h3 className="card-title">{item.title || 'Untitled case'}</h3>
      <p className="card-meta">Filed: {item.filed_date || 'N/A'}</p>
      <p className="card-body">{item.description || 'No description'}</p>
    </article>
  );
}
