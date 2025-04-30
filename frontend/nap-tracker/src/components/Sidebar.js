import React from 'react';

const Sidebar = () => (
    <div className="bg-light border-end vh-100 p-3" style={{ width: '200px' }}>
        <h5>NAP Tracker</h5>
        <ul className="nav flex-column">
            <li className="nav-item my-2"><a href="#" className="nav-link">Dashboard</a></li>
            <li className="nav-item my-2"><a href="#" className="nav-link">Add Asset</a></li>
            <li className="nav-item my-2"><a href="#" className="nav-link">View Price</a></li>
        </ul>
    </div>
);

export default Sidebar;