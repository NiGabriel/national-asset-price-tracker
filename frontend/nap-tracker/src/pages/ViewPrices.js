import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ViewPrices = () => {
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
        console.error('Failed to fetch assets', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [API_URL]);

  return (
    <div className="container" style={{ marginLeft: '170px' }}>
      <h3 className="mt-4 mb-3">All Assets</h3>

      {loading ? (
        <p>Loading assets...</p>
      ) : (
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
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.name}</td>
                  <td>{asset.category?.name || 'N/A'}</td>
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
      )}
    </div>
  );
};

export default ViewPrices;