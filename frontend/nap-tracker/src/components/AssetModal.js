import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AssetModal = ({ show, handleClose, onSave, editingAsset, categories }) => {
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        price: '',
        updatedAt: new Date().toISOString().split('T')[0],
        description: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (editingAsset) {
            setFormData({
                name: editingAsset.name || '',
                categoryId: editingAsset.category?.id || '',
                price: editingAsset.price || '',
                updatedAt: editingAsset.updatedAt ? editingAsset.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
                description: editingAsset.description || '',
                imageUrl: editingAsset.imageUrl || ''
            });
        } else {
            setFormData({
                name: '',
                categoryId: '',
                price: '',
                updatedAt: new Date().toISOString().split('T')[0],
                description: '',
                imageUrl: ''
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
    };
    

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{editingAsset ? 'Edit Asset' : 'Add Asset'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Asset Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter asset name" name="name" value={formData.name} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            {categories && categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" step="0.01" placeholder="Enter price" name="price" value={formData.price} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Updated</Form.Label>
                        <Form.Control type="date" name="updatedAt" value={formData.updatedAt} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleChange} placeholder="Optional description" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Optional image URL" />
                    </Form.Group>

                    <Button type="submit" className="btn btn-primary w-100">Save</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AssetModal;