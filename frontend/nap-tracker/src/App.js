import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ViewPrices from './pages/ViewPrices';
import AssetDetails from './pages/AssetDetails';
import Layout from './components/Layout';
import DashboardWrapper from './components/DashboardWrapper';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequestResetPage from './pages/RequestResetPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/request-reset" element={<RequestResetPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardWrapper />
            </PrivateRoute>
          }
        />
        <Route
          path="/assets"
          element={
            <PrivateRoute>
              <Layout><ViewPrices /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/assets/:id"
          element={
            <PrivateRoute>
              <Layout><AssetDetails /></Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;