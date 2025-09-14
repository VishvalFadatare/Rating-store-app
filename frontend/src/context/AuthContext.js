import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role, userId } = response.data;

            localStorage.setItem('token', token);
            setUser({ role, userId });
            setIsAuthenticated(true);
            
            // Return a success object
            return { success: true, role, userId };

        } catch (error) {
            // Log the error for debugging
            console.error('Login failed:', error);
            
            // Return a failure object with a clear error message
            return {
                success: false,
                error: error.response?.data?.message || 'Invalid credentials or server error.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ role: payload.role, userId: payload.userId });
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to parse token:', error);
                logout(); // Clear invalid token
            }
        }
        setLoading(false);
    }, []);

    const value = { user, isAuthenticated, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};