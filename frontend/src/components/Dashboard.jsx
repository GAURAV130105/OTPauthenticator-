import React, { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = ({ email, token, onLogout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await authApi.getDashboard(token);
        setData(dashboardData);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="card loading-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '500px' }}>
      <div className="dashboard-header">
        <h2 className="title" style={{ marginBottom: '0.5rem' }}>Welcome Back! 🎉</h2>
        <div className="badge">Authenticated</div>
      </div>
      
      {error && <div className="error-msg">{error}</div>}
      
      <div className="dashboard-grid">
        <div className="info-card">
          <div className="info-label">Email</div>
          <div className="info-value">{email}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Authentication Status</div>
          <div className="info-value" style={{ color: '#22c55e' }}>Verified ✓</div>
        </div>
        <div className="info-card">
          <div className="info-label">Security</div>
          <div className="info-value">OTP Verified</div>
        </div>
        <div className="info-card">
          <div className="info-label">Access Level</div>
          <div className="info-value">{data?.access_level || 'Full Access'}</div>
        </div>
        {data && data.message && (
          <div className="info-card" style={{ gridColumn: '1 / -1' }}>
            <div className="info-label">Message from Server</div>
            <div className="info-value">{data.message}</div>
          </div>
        )}
      </div>
      
      <button onClick={onLogout} className="btn-secondary">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
