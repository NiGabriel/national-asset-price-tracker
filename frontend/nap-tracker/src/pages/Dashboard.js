import React from 'react';
import Sidebar from '../components/Sidebar';
import AssetList from '../components/AssetList';
import PriceChart from '../components/PriceChart';
import AssetModal from '../components/AssetModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const Dashboard = ({ showModal, setShowModal, editingAsset, setEditingAsset }) => {


    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [assetToDelete, setAssetToDelete] = React.useState(null);

    const handleAdd = () => {
        setEditingAsset(null);
        setShowModal(true);
    }

    const handleEdit = (asset) => {
        setEditingAsset(asset);
        setShowModal(true);
    }

    const handleDelete = (asset) => {
        setAssetToDelete(asset);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        console.log('Confirmed delete:', assetToDelete);
        setShowDeleteModal(false);
        setAssetToDelete(null);
    };


    const handleSave = (asset) => {
        if (editingAsset) {
            // Update existing asset
            console.log('Updating asset:', asset);
        } else {
            // Add new asset
            console.log('Adding new asset:', asset);
        }
        setShowModal(false);
    }
    return (
        <div className="d-flex">
            {/* <Sidebar onAddAsset={handleAdd} /> */}
            <div className="container-fluid p-4" style={{ marginLeft: '200px' }}>
                {/* <div className="bg-primary text-white py-2 shadow">
                    <h1 className="mb-0 fs-3 ps-4">National Price Tracker</h1>
                </div> */}
                <PriceChart />
                {/* <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-success" onClick={handleAdd}>
                        Add Asset
                    </button>
                </div> */}

                <AssetModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    onSave={handleSave}
                    editingAsset={editingAsset}
                />

                <ConfirmDeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    asset={assetToDelete}
                />


                <AssetList onEdit={handleEdit} onDelete={handleDelete} />

            </div>
        </div>
    );
};

export default Dashboard