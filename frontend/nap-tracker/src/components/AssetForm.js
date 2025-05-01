import React, { useState } from 'react';

const AssertForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            name: '',
            category: '',
            price: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    return (
        <div className="card mb-4">
            <div className="card-header"><strong>Add / Update Asset</strong></div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col">
                            <input type="text" className="form-control" placeholder="Asset name" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="col">
                            <select className="form-select" id="category" name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                <option value="Precious metals">Precious metals</option>
                                <option value="Indices">Indices</option>
                                <option value="Cryptocurrency">Cryptocurrency</option>
                                <option value="Commodities">Commodities</option>
                            </select>
                        </div>
                        <div className="col">
                            <input type="number" step="0.01" className="form-control" placeholder="Price" id="price" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="col">
                            <input type="date" className="form-control" id="date" name="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div className="col">
                            <button type="submit" className="btn btn-primary w-100">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssertForm;