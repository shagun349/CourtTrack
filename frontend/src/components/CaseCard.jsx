import React from 'react';
import { format } from 'date-fns';
import { approveCase, declineCase, flagCase } from '../api';

const CaseCard = ({ item, user, onDecline, onApprove, onFlag }) => {
  const handleApprove = async () => {
    try {
      await approveCase(item.id);
      onApprove(item.id);
    } catch (err) {
      console.error('Failed to approve case', err);
    }
  };

  const handleDecline = async () => {
    console.log('Decline button clicked for case ID:', item.id);
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
      onFlag(item.id, status);
    } catch (err) {
      console.error(`Failed to flag case as ${status}`, err);
    }
  };

  const rawHearing = item.hearing_date || item.hearingDate || item.hearing;
  const hearingDate = rawHearing ? new Date(rawHearing) : null;
  const hearingDatePassed = hearingDate && hearingDate < new Date();
  const hearingLabel = hearingDate ? format(hearingDate, 'dd-MM-yyyy') : 'N/A';

  return (
    <div className="card case-card">
      <div className="card-title">{item.title}</div>
      <div className="card-body">{item.description}</div>
      <div className="card-meta">Status: {item.status}</div>
      <div className="card-meta">
        {user && user.role === 'lawyer' ? `Client: ${item.client_name}` : `Lawyer: ${item.lawyer_name}`}
      </div>
    
      {hearingDate && (
        <div className="card-meta">
          Hearing: {hearingLabel} {hearingDatePassed ? <span className="badge past">Past</span> : <span className="badge upcoming">Upcoming</span>}
        </div>
      )}
      {user && user.role === 'lawyer' && item.status === 'pending' && (
        <div className="card-actions">
          <button className="btn " onClick={handleApprove}>Approve</button>
          <button className="btn" onClick={handleDecline}>Decline</button>
        </div>
      )}
      {user && user.role === 'lawyer' && item.status === 'approved' && hearingDatePassed && (
        <div className="card-actions">
          <button className="btn " onClick={() => handleFlag('won')}>Mark as Won</button>
          <button className="btn" onClick={() => handleFlag('lost')}>Mark as Lost</button>
        </div>
      )}
    </div>
  );
};

export default CaseCard;
