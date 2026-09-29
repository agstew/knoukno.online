import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Nav from './components/Nav';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Price from './pages/Price';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TitleList from './pages/TitleList';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdvancedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, tier, authLoading } = useAuth();
  if (authLoading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin || tier === 'members' || tier === 'pro'
    ? children
    : <Navigate to="/price" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, authLoading } = useAuth();
  if (authLoading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <div className="app">
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/price" element={<Price />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/title" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/list" element={<AdvancedRoute><TitleList /></AdvancedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
