// src/pages/ResetPasswordPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';

const ResetPasswordPage = () => {
    const [params] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState({ message: '', error: false });
    const [loading, setLoading] = useState(false);
    const [showProgress, setShowProgress] = useState(false);

    const navigate = useNavigate();


    const token = params.get('token');
    const API_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', error: false });

        setLoading(true);
        setShowProgress(true);

        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, null, {
                params: {
                    token,
                    newPassword
                }
            });
            setStatus({ message: response.data, error: false });

            setTimeout(() => {
                navigate('/');
            }, 4000);

        } catch (err) {
            const message = err.response?.data || 'Reset failed';
            setStatus({ message, error: true });
            setLoading(false);
            setShowProgress(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h4 className="mb-3 text-primary">Reset Your Password</h4>
            {status.message && (
                <Alert variant={status.error ? 'danger' : 'success'}>
                    {status.message}
                    {!status.error && (
                        <div className="mt-2 text-muted" style={{ fontSize: '0.9em' }}>
                            Redirecting to login...
                        </div>
                    )}
                </Alert>
            )}

            {loading && (
                <div className="mb-3">
                    <ProgressBar animated now={100} variant="info" />
                </div>
            )}
            {status.message && <Alert variant={status.error ? 'danger' : 'success'}>{status.message}</Alert>}
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
                <Button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
                </Button>
            </Form>
        </div>
    );
};

export default ResetPasswordPage;