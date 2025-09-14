import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', formData);
            alert('Signup successful! Please login to continue.');
            navigate('/login');
        } catch (error) {
            const message = error.response?.data?.message || 'Something went wrong during signup.';
            alert(message);
        }
    };

    return (
         <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
           
            <div style={{
                backgroundColor: "#007bff",
                color: "black",
                padding: "20px",
                textAlign: "left",
                fontSize: "22px",
                fontWeight: "bold"
            }}>
                Store Rating Application
            </div>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5'
        }}>
            <div style={{
                padding: '40px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '300px',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name (20-60 chars)"
                        required
                        style={{
                            width: 'calc(100% - 20px)',
                            padding: '10px',
                            margin: '10px 0',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        style={{
                            width: 'calc(100% - 20px)',
                            padding: '10px',
                            margin: '10px 0',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password (8-16 chars, 1 uppercase, 1 special)"
                        required
                        style={{
                            width: 'calc(100% - 20px)',
                            padding: '10px',
                            margin: '10px 0',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address (max 400 chars)"
                        required
                        style={{
                            width: 'calc(100% - 20px)',
                            padding: '10px',
                            margin: '10px 0',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Sign Up
                    </button>
                </form>
                <p style={{ marginTop: '20px' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
            </div>
        </div>
    );
};

export default SignupPage;