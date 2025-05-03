import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });

    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState('');

    const API_URL = process.env.REACT_APP_API_BASE_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResponseData(null);

        try {
            const response = await axios.post(`${API_URL}/auth/register`, null, {
                params: formData
            });
            setResponseData(response.data);
        } catch (err) {
            const message = err.response?.data?.Notice || 'Registration failed';
            setError(message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            {/* <h3 className="mb-3 text-primary">Register New User</h3> */}
            {error && <Alert variant="danger">{error}</Alert>}
            {responseData && (
                <Alert variant="success">
                    <p>{responseData.message}</p>
                    {/* <p><strong>2FA Secret:</strong> {responseData.totpSecret}</p> */}
                    <img src={responseData.qrUrl} alt="2FA QR Code" className="img-fluid mt-2" />
                </Alert>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control name="username" type="text" required value={formData.username} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" required value={formData.email} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" required value={formData.password} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="">Select role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </Form.Select>
                </Form.Group>

                <Button type="submit" className="w-100">Register</Button>
            </Form>
        </div>
    );
};

export default RegistrationForm;