import React, { useState } from 'react';
import api from '../services/api';

const ChangePasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await api.patch('/auth/change-password', { newPassword });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Password change failed:', error);
      setMessage(error.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Change Password</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="new-password">New Password:</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirm-password">Confirm New Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Change Password
        </button>
        {message && <p style={{ marginTop: '10px', color: newPassword === confirmPassword ? 'green' : 'red' }}>{message}</p>}
      </form>
    </div>
  );
};

export default ChangePasswordForm;