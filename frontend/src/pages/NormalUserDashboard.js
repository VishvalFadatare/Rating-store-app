import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; // Corrected import path
import { useNavigate } from 'react-router-dom';
import ChangePasswordForm from './ChangePasswordForm'; 

const NormalUserDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');

    const fetchStores = async () => {
        try {
            const response = await api.get(`/normal-user/stores?search=${search}`);
            setStores(response.data.stores);
        } catch (error) {
            console.error('Failed to fetch stores:', error);
            alert('Failed to load stores.');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStores();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleRatingSubmit = async (storeId, ratingValue) => {
        try {
            await api.post(`/normal-user/stores/${storeId}/ratings`, { ratingValue });
            alert('Rating submitted successfully!');
            fetchStores();
        } catch (error) {
            alert('Error submitting rating. You may have already rated this store.');
        }
    };

    const handleRatingUpdate = async (storeId, ratingValue) => {
        try {
            await api.patch(`/normal-user/stores/${storeId}/ratings`, { ratingValue });
            alert('Rating updated successfully!');
            fetchStores();
        } catch (error) {
            alert('Error updating rating.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
             <button onClick={handleLogout} style={{ float: 'right', padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Normal User Dashboard</h1>
           
            <input 
                type="text" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search for stores by name or address" 
                style={{ width: '100%', padding: '12px', marginTop: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px' }}
            />
            <ChangePasswordForm />
            <h2>Available Stores</h2>
            {stores.length === 0 ? <p>No stores found matching your criteria.</p> : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {stores.map(store => (
                        <div key={store.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{store.name}</h3>
                            <p style={{ margin: '0', color: '#555' }}><strong>Address:</strong> {store.address}</p>
                            <p style={{ margin: '5px 0', color: '#555' }}><strong>Overall Rating:</strong> <span style={{ fontWeight: 'bold', color: '#28a745' }}>{parseFloat(store.overall_rating).toFixed(1)} / 5</span></p>
                            <p style={{ margin: '5px 0', color: '#555' }}><strong>Your Rating:</strong> <span style={{ fontWeight: 'bold' }}>{store.user_submitted_rating ? `${store.user_submitted_rating} / 5` : 'Not rated' }</span></p>
                            <div style={{ marginTop: '10px' }}>
                                {[1, 2, 3, 4, 5].map(rating => (
                                    <button 
                                        key={rating}
                                        onClick={() => {
                                            if (store.user_submitted_rating) {
                                                handleRatingUpdate(store.id, rating);
                                            } else {
                                                handleRatingSubmit(store.id, rating);
                                            }
                                        }}
                                        style={{ 
                                            margin: '5px', 
                                            padding: '8px 12px', 
                                            cursor: 'pointer', 
                                            backgroundColor: store.user_submitted_rating === rating ? '#007bff' : '#f0f0f0',
                                            color: store.user_submitted_rating === rating ? 'white' : '#333',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {rating}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NormalUserDashboard;