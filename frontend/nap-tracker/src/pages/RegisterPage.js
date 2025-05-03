// RegisterPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import '../App.css';

const RegisterPage = () => {
    return (
        <div className="register-page">
            <div className="register-left">
                <div className="welcome-text">
                    <h1>Join <span className="highlight">NAP Tracker</span></h1>
                    <p>Track, monitor, and explore national assets with precision.<br />Your secure journey starts here.</p>
                </div>
                <img
                    src="signup.jpg"
                    alt="Signup Data Illustration"
                    className="illustration"
                />
                <p className="quote">“Empower your role in national transparency.”</p>
            </div>

            <div className="register-right">
                <div className="register-box">
                    <h2>Create an Account</h2>
                    <RegistrationForm />
                    <small className="secured-text">🔐 Secured By G.E.R</small>
                    <div className="mt-3">
                        <Link to="/" className="text-decoration-none text-primary">← Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;