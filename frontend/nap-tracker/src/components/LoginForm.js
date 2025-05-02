import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const LoginForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '', code: '' });
    const [error, setError] = useState('');
    const [show2FAModal, setShow2FAModal] = useState(false);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_BASE_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            setError('Please enter both username and password');
            return;
        }

        setShow2FAModal(true);
    };

    const handle2FASubmit = async () => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, null, {
                params: {
                    username: formData.username,
                    password: formData.password,
                    code: formData.code,
                },
            });

            const { token } = response.data;
            localStorage.setItem('token', token);
            setShow2FAModal(false);
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.error || 'Login failed';
            setError(message);
            setShow2FAModal(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center mt-5">
            <div className="border p-4 shadow rounded w-100" style={{ maxWidth: '400px' }}>
                <h3 className="text-center mb-4 text-primary">Login to NAP Tracker</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleInitialSubmit}>
                    <Form.Group controlId="username" className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" className="w-100 btn btn-primary">
                        Proceed
                    </Button>

                    <div className="d-flex justify-content-between mt-3">
                        <a href="/register" className="text-decoration-none">Sign up</a>
                        <a href="/request-reset" className="text-decoration-none">Forgot password?</a>
                    </div>
                </Form>
            </div>

            <Modal show={show2FAModal} onHide={() => setShow2FAModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Two-Factor Authentication</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="code">
                        <Form.Label>Enter code from Authenticator App</Form.Label>
                        <Form.Control
                            type="number"
                            name="code"
                            placeholder="6-digit code"
                            value={formData.code}
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === 'Enter' && handle2FASubmit(e)}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow2FAModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handle2FASubmit}>
                        Verify & Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LoginForm;