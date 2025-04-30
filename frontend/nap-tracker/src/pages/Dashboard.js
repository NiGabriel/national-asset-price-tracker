import React from 'react';
import Sidebar from '../components/Sidebar';
import AssetList from '../components/AssetList';
import PriceChart from '../components/PriceChart';

const Dashboard = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="container-fluid p-4">
                <h1>National Price Tracker</h1>
                <PriceChart />
                <AssetList />
            </div>
        </div>
    );
};

export default Dashboard