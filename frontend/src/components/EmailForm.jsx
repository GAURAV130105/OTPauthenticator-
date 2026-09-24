import React, { useState } from 'react';
import { authApi } from '../api/authApi';
import LoadingSpinner from './LoadingSpinner';

const EmailForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await authApi.sendOTP(email);
      onSuccess(email);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="title">Sign In</h2>
      <p className="subtitle">Enter your email to receive a 6-digit OTP</p>
      
      {error && <div className="error-msg">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoFocus
          />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <LoadingSpinner /> : 'Send OTP'}
        </button>
      </form>
    </div>
  );
};

export default EmailForm;
