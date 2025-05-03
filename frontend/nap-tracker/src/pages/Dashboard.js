import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AssetList from '../components/AssetList';
import PriceChart from '../components/PriceChart';
import AssetModal from '../components/AssetModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const Dashboard = ({ showModal, setShowModal, editingAsset, setEditingAsset }) => {
    const [assets, setAssets] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);
    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetchAssets();
    }, []);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };

        fetchCategories();
    }, []);


    const fetchAssets = async () => {
        try {
            const res = await axios.get(`${API_URL}/assets`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssets(res.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const handleAdd = () => {
        setEditingAsset(null);
        setShowModal(true);
    };

    const handleEdit = (asset) => {
        setEditingAsset(asset);
        setShowModal(true);
    };

    const handleDelete = (asset) => {
        setAssetToDelete(asset);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/assets/${assetToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAssets();
        } catch (err) {
            console.error('Error deleting asset:', err);
        }
        setShowDeleteModal(false);
        setAssetToDelete(null);
    };

    const handleSave = async (asset) => {
        const payload = {
            name: asset.name,
            categoryId: parseInt(asset.categoryId, 10), 
            price: parseFloat(asset.price),
            updatedAt: `${asset.updatedAt}T00:00:00`,
            description: asset.description || '',
            imageUrl: asset.imageUrl || ''
        };
    
        console.log("Saving asset to API:", payload);
        console.log("Token:", token);
    
        try {
            if (editingAsset) {
                await axios.put(`${API_URL}/assets/${editingAsset.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${API_URL}/assets`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            fetchAssets();
            setShowModal(false);
        } catch (err) {
            console.error('Error saving asset:', err);
        }
    };
    

    return (
        <div className="d-flex">
            <div className="container-fluid p-4" style={{ marginLeft: '200px' }}>
                <PriceChart />

                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-success" onClick={handleAdd}>
                        Add Asset
                    </button>
                </div>

                <AssetModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    onSave={handleSave}
                    editingAsset={editingAsset}
                    categories={categories}
                />

                <ConfirmDeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    asset={assetToDelete}
                />

                <AssetList assets={assets} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default Dashboard;