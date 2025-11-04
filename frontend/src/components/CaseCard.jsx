import React from 'react';

import { approveCase, declineCase, flagCase } from '../api';

const CaseCard = ({ item, user, onDecline, onApprove }) => {
  const handleApprove = async () => {
    try {
      await approveCase(item.id);
      onApprove(item.id);
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

  const handleFlag = async (status) => {
    try {
      await flagCase(item.id, status);
      // You might want to update the UI to reflect the change
    } catch (err) {
      console.error(`Failed to flag case as ${status}`, err);
    }
  };

  const rawHearing = item.hearing_date || item.hearingDate || item.hearing;
  const hearingDate = rawHearing ? new Date(rawHearing) : null;
  const hearingDatePassed = hearingDate && hearingDate < new Date();
  const hearingLabel = hearingDate ? hearingDate.toLocaleDateString() : null;

  return (
    <div className="card case-card">
      <div className="card-title">{item.title}</div>
      <div className="card-body">{item.description}</div>
      <div className="card-meta">Status: {item.status}</div>
      {hearingDate && (
        <div className="card-meta">
          Hearing: {hearingLabel} {hearingDatePassed ? <span className="badge past">Past</span> : <span className="badge upcoming">Upcoming</span>}
        </div>
      )}
      {user && user.role === 'lawyer' && item.status === 'pending' && (
        <div className="card-actions">
          <button className="btn primary" onClick={handleApprove}>Approve</button>
          <button className="btn" onClick={handleDecline}>Decline</button>
        </div>
      )}
      {user && user.role === 'lawyer' && item.status === 'approved' && hearingDatePassed && (
        <div className="card-actions">
          <button className="btn primary" onClick={() => handleFlag('won')}>Mark as Won</button>
          <button className="btn" onClick={() => handleFlag('lost')}>Mark as Lost</button>
        </div>
      )}
    </div>
  );
};

export default CaseCard;
