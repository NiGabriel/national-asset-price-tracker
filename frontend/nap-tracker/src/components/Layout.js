import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children, onAddAsset }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="d-flex">
      <Sidebar onAddAsset={onAddAsset} />
      <div className="flex-grow-1" style={{ marginLeft: '20px' }}>
        <div className="bg-primary text-white py-2 px-4 shadow mb-3 d-flex justify-content-between align-items-center" style={{ marginLeft: '200px' }}>
          <h4 className="mb-0">National Asset Price Tracker</h4>
          <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
        <div className="px-4">{children}</div>
      </div>
    </div>
  );
};

export default Layout;