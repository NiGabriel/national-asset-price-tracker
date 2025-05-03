import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onAddAsset }) => (
    <div className="bg-light border-end vh-100 p-3 position-fixed" style={{ width: '200px' }}>
        <h5>NAP Tracker</h5>
        <ul className="nav flex-column">
            <li className="nav-item my-2">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item my-2">
                <button className="nav-link" onClick={onAddAsset}>
                    Add Asset
                </button>
            </li>
            <li className="nav-item my-2">
                <Link to="/assets" className="nav-link">View Price</Link>
            </li>
        </ul>
    </div>
);

export default Sidebar;