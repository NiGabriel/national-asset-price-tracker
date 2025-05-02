// src/pages/RequestResetPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RequestResetPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ message: '', error: false });
    const [loading, setLoading] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', error: false });

        setLoading(true);
        setShowProgress(true);


        try {
            const response = await axios.post(`${API_URL}/auth/request-reset`, null, {
                params: { email }
            });
            //   setStatus({ message: response.data, error: false });
            setStatus({ message: 'Reset link sent to your email', error: false });

            setTimeout(() => {
                navigate('/');
            }, 4000);
        } catch (err) {
            const message = err.response?.data || 'Reset request failed';
            setStatus({ message, error: true });
            setLoading(false);
            setShowProgress(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h4 className="mb-3 text-primary">Request Password Reset</h4>
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
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        disabled={loading}
                    />
                </Form.Group>
                <Button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Send Reset Link'}
                </Button>
            </Form>
        </div>
    );
};

export default RequestResetPage;