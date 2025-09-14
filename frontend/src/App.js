import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import NormalUserDashboard from './pages/NormalUserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, loading, user } = useAuth();
    if (loading) { return <div>Loading...</div>; }
    if (!isAuthenticated) { return <Navigate to="/login" />; }
    if (requiredRole && user.role !== requiredRole) { return <div>Access Denied</div>; }
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/admin" element={<ProtectedRoute requiredRole="system_administrator"><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/user-dashboard" element={<ProtectedRoute requiredRole="normal_user"><NormalUserDashboard /></ProtectedRoute>} />
                        <Route path="/owner-dashboard" element={<ProtectedRoute requiredRole="store_owner"><StoreOwnerDashboard /></ProtectedRoute>} />
                        <Route path="*" element={<h2>404 Not Found</h2>} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;