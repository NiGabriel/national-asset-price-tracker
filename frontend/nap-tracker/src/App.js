import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ViewPrices from './pages/ViewPrices';
import AssetDetails from './pages/AssetDetails';
import Layout from './components/Layout';
import DashboardWrapper from './components/DashboardWrapper';
import LoginPage from './pages/LoginPage'; // Adjust the import path as necessary
import RegisterPage from './pages/RegisterPage'; // Adjust the import path as necessary
import RequestResetPage from './pages/RequestResetPage'; // Adjust the import path as necessary
import ResetPasswordPage from './pages/ResetPasswordPage'; // Adjust the import path as necessary

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/assets" element={<Layout><ViewPrices /></Layout>} />
        <Route path="/assets/:id" element={<Layout><AssetDetails /></Layout>} />
        <Route path="/request-reset" element={<RequestResetPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
