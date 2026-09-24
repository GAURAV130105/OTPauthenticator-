import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

const handleApiError = (error) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (data.detail) {
      if (typeof data.detail === 'string') throw new Error(data.detail);
      if (Array.isArray(data.detail)) throw new Error(data.detail[0].msg || 'An error occurred');
    }
    if (data.message) throw new Error(data.message);
  }
  throw new Error(error.message || 'An unexpected error occurred');
};

export const authApi = {
  sendOTP: async (email) => {
    try {
      const response = await api.post('/api/auth/send-otp', { email });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  verifyOTP: async (email, otp) => {
    try {
      const response = await api.post('/api/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  resendOTP: async (email) => {
    try {
      const response = await api.post('/api/auth/resend-otp', { email });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getDashboard: async (token) => {
    try {
      const response = await api.get('/api/protected/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getProfile: async (token) => {
    try {
      const response = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};
