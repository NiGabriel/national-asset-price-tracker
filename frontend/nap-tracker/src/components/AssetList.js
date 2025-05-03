import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssetList = ({ onEdit, onDelete }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/assets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssets(response.data);
      } catch (err) {
        console.error('Failed to load assets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [API_URL]);

  const renderTrendColor = (trend) => {
    if (trend === 'Rising') return 'green';
    if (trend === 'Falling') return 'red';
    return 'gray';
  };

  return (
    <div className='mt-4'>
      <h5>Asset List</h5>
      {loading ? (
        <p>Loading assets...</p>
      ) : (
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
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>{asset.category?.name || 'N/A'}</td>
                <td style={{ color: renderTrendColor(asset.trend || 'Stable') }}>
                  ${asset.price.toFixed(2)}
                </td>
                <td>{asset.trend || 'Stable'}</td>
                <td>{asset.updatedAt || 'Not stated'}</td>
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
      )}
    </div>
  );
};

export default AssetList;