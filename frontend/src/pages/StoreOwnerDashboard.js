import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StoreOwnerDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/store-owner/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            alert('Failed to load dashboard data.');
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!dashboardData) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <button onClick={handleLogout} style={{ float: 'right', padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Store Owner Dashboard</h1>
            
            
            <h2 style={{ marginTop: '50px' }}>My Store's Average Rating</h2>
            <p style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#007bff' }}>
                {parseFloat(dashboardData.averageRating).toFixed(1)} / 5
            </p>
            
            <h3 style={{ marginTop: '30px' }}>Users Who Have Rated My Store</h3>
            {dashboardData.ratings.length === 0 ? <p>No ratings have been submitted yet.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>User Name</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>User Email</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.ratings.map((rating, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{rating.user_name}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{rating.user_email}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{rating.rating_value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StoreOwnerDashboard;