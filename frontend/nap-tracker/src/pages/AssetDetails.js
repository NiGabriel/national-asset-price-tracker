import React from 'react';
import { useParams, Link } from 'react-router-dom';

const mockAssets = {
    '1': { name: 'Gold', category: 'Precious Metals', price: 1895.5, date: '2024-01-15', desc: 'Refined gold asset.' },
    '2': { name: 'Silver', category: 'Precious Metals', price: 23.45, date: '2024-01-15', desc: 'Industrial silver.' },
    '3': { name: 'S&P 500', category: 'Indices', price: 4783.83, date: '2024-01-15', desc: '500 leading U.S. companies.' }
};

const AssetDetails = () => {
    const { id } = useParams();
    const asset = mockAssets[id];

    if (!asset) return <div className="container" style={{ marginLeft: '200px' }}>Asset not found</div>;

    return (
        <div className="container" style={{ marginLeft: '170px' }}>
            <nav className="mt-3">
                <Link to="/">Dashboard</Link> / <Link to="/assets">Asset List</Link> / Asset Details
            </nav>

            <div className="card mt-4 p-4 shadow-sm">
                <div className="d-flex justify-content-between">
                    <h4>{asset.name}</h4>
                    <div>
                        <button className="btn btn-outline-primary btn-sm me-2">Edit</button>
                        <button className="btn btn-outline-danger btn-sm">Delete</button>
                    </div>
                </div>
                <div className="mt-2">
                    <span className="badge bg-info text-dark">{asset.category}</span>
                </div>
                <p className="mt-3"><strong>Current Price:</strong> ${asset.price.toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {asset.date}</p>
                <p><strong>Description:</strong> {asset.desc}</p>
            </div>

            <div className="card mt-4 p-4">
                <h5>Price History</h5>
                <div className="row">
                    <div className="col-md-6">
                        <label>Date Range:</label>
                        <input type="date" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="invisible">to</label>
                        <input type="date" className="form-control" />
                    </div>
                </div>
                {/* Future: insert line chart here */}
            </div>
        </div>
    );
};

export default AssetDetails;