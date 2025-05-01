import React from 'react';
import { Link } from 'react-router-dom';

const mockAssets = [
    { id: 1, name: 'Gold', category: 'Previous Metals', price: 1500 },
    { id: 2, name: 'Silver', category: 'Precious Metals', price: 1400 },
    { id: 3, name: 'S&P 500', category: 'Indices', price: 3400 },
];

const ViewPrices = () => (
    <div className="container" style={{ marginLeft: '170px' }}>
        <h3 className="mt-4 mb-3">All Assets</h3>
        <div style={{ maxWidth: '1200px' }}>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Asset Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mockAssets.map((asset) => (
                        <tr key={asset.id}>
                            <td>{asset.name}</td>
                            <td>{asset.category}</td>
                            <td>${asset.price.toLocaleString()}</td>
                            <td>
                                <Link to={`/assets/${asset.id}`} className="btn btn-sm btn-outline-primary">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default ViewPrices;