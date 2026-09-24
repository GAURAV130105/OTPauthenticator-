import React, { useState } from 'react';
import EmailForm from './components/EmailForm';
import OTPForm from './components/OTPForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(null);

  const handleSendOTPSuccess = (emailAddress) => {
    setEmail(emailAddress);
    setStep('otp');
  };

  const handleVerifySuccess = (authToken) => {
    setToken(authToken);
    setStep('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setEmail('');
    setStep('email');
  };

  const handleBackToEmail = () => {
    setStep('email');
  };

  return (
    <div className="app">
      {step === 'email' && <EmailForm onSuccess={handleSendOTPSuccess} />}
      {step === 'otp' && (
        <OTPForm 
          email={email} 
          onSuccess={handleVerifySuccess} 
          onBack={handleBackToEmail} 
        />
      )}
      {step === 'dashboard' && (
        <Dashboard 
          email={email} 
          token={token} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;
