import { useState } from 'react';
import { createCase } from '../api';

const AddCase = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [hearingDate, setHearingDate] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await createCase(title, description, clientEmail, hearingDate);
      setSuccess('Case created successfully!');
      setTitle('');
      setDescription('');
      setClientEmail('');
      setHearingDate('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create case');
    }
  };

  return (
    <div className="add-case-form">
      <h2>Add New Case</h2>
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
          <label>Client Email</label>
          <input 
            type="email" 
            value={clientEmail} 
            onChange={(e) => setClientEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Hearing Date</label>
          <input 
            type="date" 
            value={hearingDate} 
            onChange={(e) => setHearingDate(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Add Case</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default AddCase;