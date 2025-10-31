import { useState } from 'react';
import { requestCase } from '../api';

const RequestCase = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lawyerEmail, setLawyerEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await requestCase(title, description, lawyerEmail);
      setSuccess('Case request sent successfully!');
      setTitle('');
      setDescription('');
      setLawyerEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send case request');
    }
  };

  return (
    <div className="request-case-form">
      <h2>Request a Case</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Lawyer Email</label>
          <input 
            type="email" 
            value={lawyerEmail} 
            onChange={(e) => setLawyerEmail(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Send Request</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default RequestCase;