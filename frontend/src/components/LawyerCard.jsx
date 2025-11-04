
import React from 'react';

export default function LawyerCard({ lawyer }) {
  return (
    <article className="card lawyer-card">
      <h3 className="card-title">{lawyer.name}</h3>
      <p className="card-meta">Email: {lawyer.email}</p>
      <p className="card-body">Total Cases: {lawyer.total_cases}</p>
      <p className="card-body">Wins: {lawyer.wins}</p>
      <p className="card-body">Losses: {lawyer.losses}</p>
    </article>
  );
}
