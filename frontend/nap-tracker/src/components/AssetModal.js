import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AssetModal = ({ show, handleClose, onSave, editingAsset }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (editingAsset) {
            setFormData(editingAsset);
        } else {
            setFormData({
                name: '',
                category: '',
                price: '',
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [editingAsset]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{editingAsset ? 'Edit Asset' : 'Add Asset'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Asset Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter asset name" name="name" value={formData.name} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="Precious metals">Precious metals</option>
                            <option value="Indices">Indices</option>
                            <option value="Cryptocurrency">Cryptocurrency</option>
                            <option value="Commodities">Commodities</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" step="0.01" placeholder="Enter price" name="price" value={formData.price} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AssetModal;