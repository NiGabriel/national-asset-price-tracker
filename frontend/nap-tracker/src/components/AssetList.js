import React from 'react';

const assert = [
    { name: 'Gold', category: 'Precious metals', price: 1500, trend: 'Rising', date: '2025-01-20' },
    { name: 'Silver', category: 'Precious metals', price: 25, trend: 'Stable', date: '2025-01-20' },
    { name: 'S&P 500', category: 'Indices', price: 1000, trend: 'Falling', date: '2025-01-20' },
    { name: 'Copper', category: 'Base metals', price: 4, trend: 'Rising', date: '2025-01-20' },
    { name: 'Crude Oil', category: 'Commodities', price: 2, trend: 'Stable', date: '2025-01-20' },
    { name: 'Nickel', category: 'Base metals', price: 8, trend: 'Falling', date: '2025-01-20' },
];

const AssetList = ({ onEdit, onDelete }) => (
    <div className='mt-4'>
        <h5>Asset List</h5>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Asset Name</th>
                    <th>Category</th>
                    <th>Current Price</th>
                    <th>Trend</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {assert.map((asset, index) => (
                    <tr key={index}>
                        <td>{asset.name}</td>
                        <td>{asset.category}</td>
                        <td style={{ color: asset.trend === 'Rising' ? 'green' : 'red' }}>
                            ${asset.price.toFixed(2)}
                        </td>
                        <td>{asset.trend}</td>
                        <td>{asset.date}</td>
                        <td>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(asset)}>
                                Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(asset)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default AssetList;