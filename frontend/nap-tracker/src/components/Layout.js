import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, onAddAsset }) => (

  
  <div className="d-flex">
    <Sidebar onAddAsset={onAddAsset}/>
    <div className="flex-grow-1" style={{ marginLeft: '20px' }}>
      <div className="bg-primary text-white py-2 px-4 shadow mb-3">
        <h4 className="mb-0" style={{ marginLeft: '200px' }}>National Asset Price Tracker</h4>
      </div>
      <div className="px-4">{children}</div>
    </div>
  </div>
);

export default Layout;