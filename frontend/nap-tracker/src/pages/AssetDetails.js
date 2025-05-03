import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import AssetModal from '../components/AssetModal';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';



ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AssetDetails = () => {
    const { id } = useParams();
    const [asset, setAsset] = useState(null);
    const [priceHistory, setPriceHistory] = useState([]);
    const [error, setError] = useState('');
    const API_URL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem('token');



    const [showModal, setShowModal] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
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


    useEffect(() => {
        const fetchAssetAndHistory = async () => {
            try {
                const assetRes = await axios.get(`${API_URL}/assets/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const historyRes = await axios.get(`${API_URL}/price-history`, {
                    params: { assetId: id },
                    headers: { Authorization: `Bearer ${token}` },
                });

                setAsset(assetRes.data.asset);
                setPriceHistory(historyRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchAssetAndHistory();
    }, [id, API_URL, token]);

    const handleDelete = async () => {
        const confirm = window.confirm('Are you sure you want to delete this asset?');
        if (!confirm) return;

        try {
            await axios.delete(`${API_URL}/assets/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            window.location.href = '/dashboard';
        } catch (err) {
            alert('Failed to delete asset');
            console.error(err);
        }
    };

    const handleEdit = () => {
        setEditingAsset(asset);
        setShowModal(true);
    };

    const handleSave = async (updatedAsset) => {
        const payload = {
          name: updatedAsset.name,
          price: parseFloat(updatedAsset.price),
          categoryId: parseInt(updatedAsset.categoryId),
          description: updatedAsset.description || '',
          imageUrl: updatedAsset.imageUrl || '',
          updatedAt: `${updatedAsset.updatedAt}T00:00:00`
        };
      
        try {
          await axios.put(`${API_URL}/assets/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setShowModal(false);
      
          // refresh asset
          const assetRes = await axios.get(`${API_URL}/assets/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAsset(assetRes.data.asset);
        } catch (err) {
          console.error("Failed to update asset:", err);
        }
      };
      



    const chartData = {
        labels: priceHistory.map((entry) => new Date(entry.recordedAt).toLocaleDateString()),
        datasets: [
            {
                label: 'Price Over Time',
                data: priceHistory.map((entry) => entry.price),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.3,
            },
        ],
    };

    if (error) return <div className="container" style={{ marginLeft: '200px' }}>{error}</div>;
    if (!asset) return <div className="container" style={{ marginLeft: '200px' }}>Loading...</div>;

    return (
        <div className="container" style={{ marginLeft: '170px' }}>
            <nav className="mt-3">
                <Link to="/dashboard">Dashboard</Link> / <Link to="/assets">Asset List</Link> / Asset Details
            </nav>

            <AssetModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onSave={handleSave}
                editingAsset={editingAsset}
                categories={categories}
            />


            <div className="card mt-4 px-3 py-2 shadow-sm" style={{ minHeight: 'auto' }}>
                <div className="d-flex justify-content-between">
                    <h4>{asset.name}</h4>
                    <div>
                        <button className="btn btn-outline-primary btn-sm me-2" onClick={handleEdit}>Edit</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
                <div className="mt-2">
                    <span className="badge bg-info text-dark">{asset?.category?.name || 'Uncategorized'}</span>
                </div>
                <p className="mt-3"><strong>Current Price:</strong> ${asset.price.toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(asset.updatedAt).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {asset.description || 'N/A'}</p>
            </div>

            <div className="card mt-4 p-4">
                <h5>Price History</h5>
                {priceHistory.length > 0 ? (
                    <Line data={chartData} />
                ) : (
                    <p className="text-muted">No price history available.</p>
                )}
            </div>
        </div>
    );
};

export default AssetDetails;