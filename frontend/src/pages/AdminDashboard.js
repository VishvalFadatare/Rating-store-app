import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [showAddStoreForm, setShowAddStoreForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'normal_user' });
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            alert('Failed to fetch stats.');
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users);
        } catch (error) {
            alert('Failed to fetch users.');
        }
    };

    const fetchStores = async () => {
        try {
            const response = await api.get('/admin/stores');
            setStores(response.data.stores);
        } catch (error) {
            alert('Failed to fetch stores.');
        }
    };

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchStores();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', newUser);
            alert('User added successfully!');
            fetchUsers();
            setNewUser({ name: '', email: '', password: '', address: '', role: 'normal_user' });
        } catch (error) {
            alert('Failed to add user. Check for duplicate email.');
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/stores', newStore);
            alert('Store added successfully!');
            fetchStores();
            setNewStore({ name: '', email: '', address: '', ownerId: '' });
        } catch (error) {
            console.error('Error:', error.response?.data?.message || 'Server error');
            alert('Server error adding store.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <button onClick={handleLogout} style={{ float: 'right', padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Admin Dashboard</h1>
            
            
            <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'space-around' }}>
                <p><strong>Total Users:</strong> {stats.totalUsers}</p>
                <p><strong>Total Ratings:</strong> {stats.totalRatings}</p>
                <p><strong>Total Ratings: </strong> {stats.totalRatings}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setShowAddUserForm(!showAddUserForm)} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {showAddUserForm ? 'Hide Add User Form' : 'Add New User'}
                </button>
                <button onClick={() => setShowAddStoreForm(!showAddStoreForm)} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {showAddStoreForm ? 'Hide Add Store Form' : 'Add New Store'}
                </button>
            </div>
            
            {showAddUserForm && (
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h2>Add New User</h2>
                    <form onSubmit={handleAddUser} style={{ display: 'grid', gap: '10px' }}>
                        <input type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Name" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="Password" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <input type="text" value={newUser.address} onChange={e => setNewUser({ ...newUser, address: e.target.value })} placeholder="Address" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="normal_user">Normal User</option>
                            <option value="store_owner">Store Owner</option>
                            <option value="system_administrator">System Administrator</option>
                        </select>
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
                    </form>
                </div>
            )}
            
            {showAddStoreForm && (
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h2>Add New Store</h2>
                    <form onSubmit={handleAddStore} style={{ display: 'grid', gap: '10px' }}>
                        <input type="text" value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} placeholder="Store Name" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <input type="email" value={newStore.email} onChange={e => setNewStore({ ...newStore, email: e.target.value })} placeholder="Store Email" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <input type="text" value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })} placeholder="Store Address" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <input type="text" value={newStore.ownerId} onChange={e => setNewStore({ ...newStore, ownerId: e.target.value })} placeholder="Owner UUID" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
                    </form>
                </div>
            )}

            <div style={{ margin: '20px 0' }}>
                <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>User List</h2>
                 <input
                    type="text"
                    placeholder="Search by Name or Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ margin: '10px 0', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th> {/* Added ID header */}
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Address</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Role</th>
                        </tr>
                    </thead>
                     <tbody>
                        {users
                            .filter(
                                (user) =>
                                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((user) => (
                                 <tr key={user.id}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.id}</td> 
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.address}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
                            </tr>

                            ))}
                    </tbody>
                </table>
            </div>

            <div style={{ margin: '20px 0' }}>
                <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Store List</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Address</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Avg. Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(store => (
                            <tr key={store.id}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{store.id}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{store.name}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{store.email}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{store.address}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{parseFloat(store.average_rating).toFixed(1)} / 5</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;