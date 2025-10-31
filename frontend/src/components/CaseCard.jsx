import React from 'react';

import { approveCase, declineCase } from '../api';

const CaseCard = ({ item, user, onDecline }) => {
  const handleApprove = async () => {
    try {
      await approveCase(item.id);
      // You might want to update the UI to reflect the change
    } catch (err) {
      console.error('Failed to approve case', err);
    }
  };

  const handleDecline = async () => {
    try {
      await declineCase(item.id);
      onDecline(item.id);
    } catch (err) {
      console.error('Failed to decline case', err);
    }
  };

  return (
    <div className="card">
      <div className="card-title">{item.title}</div>
      <div className="card-body">{item.description}</div>
      <div className="card-meta">Status: {item.status}</div>
      {user && user.role === 'lawyer' && item.status === 'pending' && (
        <div className="card-actions">
          <button className="btn primary" onClick={handleApprove}>Approve</button>
          <button className="btn" onClick={handleDecline}>Decline</button>
        </div>
      )}
    </div>
  );
};

export default CaseCard;
