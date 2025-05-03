import React, { useState } from 'react';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import { useLocation } from 'react-router-dom';
import AssetDetails from '../pages/AssetDetails';


const DashboardWrapper = () => {
  const location = useLocation();
  const editAsset = location.state?.editAsset || null;

  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const handleAdd = () => {
    setEditingAsset(null);
    setShowModal(true);
  };

  return (
    <Layout onAddAsset={handleAdd}>
      <Dashboard
        showModal={showModal}
        setShowModal={setShowModal}
        editingAsset={editingAsset}
        setEditingAsset={setEditingAsset}
      />

      <AssetDetails
        showModal={showModal}
        setShowModal={setShowModal}
        editingAsset={editingAsset}
        setEditingAsset={setEditingAsset}
      />
    </Layout>
  );
};

export default DashboardWrapper;