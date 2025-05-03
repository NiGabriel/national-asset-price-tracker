import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import '../App.css';

const ResetPasswordPage = () => {
    const [params] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState({ message: '', error: false });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const token = params.get('token');
    const API_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', error: false });
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, null, {
                params: {
                    token,
                    newPassword
                }
            });
            setStatus({ message: '🎉 Password reset successful!', error: false });
            setTimeout(() => navigate('/'), 4000);
        } catch (err) {
            const message = err.response?.data || 'Reset failed';
            setStatus({ message, error: true });
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h3 className="auth-title text-primary">Reset Your Password</h3>
                <p className="auth-subtitle">Set a new password for your account.</p>

                {status.message && (
                    <Alert variant={status.error ? 'danger' : 'success'} className="text-center">
                        {status.message}
                        {!status.error && (
                            <div className="mt-2 small text-muted">Redirecting to login...</div>
                        )}
                    </Alert>
                )}

                {loading && <ProgressBar animated now={100} variant="success" className="mb-3" />}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                            disabled={loading}
                        />
                    </Form.Group>

                    <Button type="submit" className="w-100 btn btn-primary" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <Link to="/" className="text-decoration-none text-primary">← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;