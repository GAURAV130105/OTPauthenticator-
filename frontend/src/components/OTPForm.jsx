import React, { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import LoadingSpinner from './LoadingSpinner';

const OTPForm = ({ email, onSuccess, onBack }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.verifyOTP(email, otp);
      setSuccess('OTP verified successfully!');
      setTimeout(() => {
        onSuccess(data.access_token || data.token); // Adjust based on actual backend response format
      }, 1000);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    setError('');
    setSuccess('');
    setResendLoading(true);
    
    try {
      await authApi.resendOTP(email);
      setSuccess('OTP resent successfully');
      setTimeLeft(60);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="title">Verify OTP</h2>
      <p className="subtitle">
        We sent a code to <br />
        <span style={{ color: '#f8fafc', fontWeight: '500' }}>{email}</span>
      </p>
      
      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="input"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              if (val.length <= 6) setOtp(val);
            }}
            disabled={loading || success}
            autoFocus
            maxLength={6}
            style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.25rem' }}
          />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading || otp.length !== 6 || success}>
          {loading ? <LoadingSpinner /> : 'Verify OTP'}
        </button>
      </form>
      
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button 
          onClick={handleResend} 
          className="btn-secondary" 
          disabled={timeLeft > 0 || resendLoading || success}
        >
          {resendLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>
          ) : timeLeft > 0 ? (
            `Resend OTP (${timeLeft}s)`
          ) : (
            'Resend OTP'
          )}
        </button>
        <button onClick={onBack} className="btn-secondary" style={{ border: 'none' }} disabled={loading || success}>
          Back to Email
        </button>
      </div>
    </div>
  );
};

export default OTPForm;
