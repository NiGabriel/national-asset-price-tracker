// LoginPage.js
import React from 'react';
import LoginForm from '../components/LoginForm';
import '../App.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-left">
        <div className="welcome-text">
          <h1>Welcome to <span className="highlight">NAP Tracker</span></h1>
          <p>Monitor national asset prices with transparency and precision.<br />Log in to explore insights and historical trends.</p>
        </div>
        <img
          src="data-monitoring.jpg"
          alt="Data Monitoring Illustration"
          className="illustration"
        />
        <p className="quote">“Data is the new oil. Transparency fuels progress.”</p>
      </div>

      <div className="login-right">
          <LoginForm />
          <small className="secured-text">🔒 Secured by G.E.R</small>
      </div>
    </div>
  );
};

export default LoginPage;