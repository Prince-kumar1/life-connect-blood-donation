import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const DonorAccountManager = () => {
  const [hasDonor, setHasDonor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [donorData, setDonorData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    checkDonorAccount();
  }, []);

  const checkDonorAccount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/donor-account');
      if (response.data.exists) {
        setHasDonor(true);
        setDonorData(response.data.donorAccount);
      }
    } catch (error) {
      setHasDonor(false);
    }
  };

  const createDonorAccount = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/create-donor-account');
      setHasDonor(true);
      setDonorData(response.data.donorAccount);
      setMessage('Donor account created successfully!');
    } catch (error) {
      setMessage('Error creating donor account: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const accessDonorDashboard = async () => {
    try {
      // Get donor account token
      const response = await axios.post('http://localhost:5000/api/auth/donor-login', {
        seekerEmail: user.email
      });
      
      // Store original seeker token and switch to donor token
      localStorage.setItem('originalUserType', 'seeker');
      localStorage.setItem('seekerToken', localStorage.getItem('token'));
      localStorage.setItem('token', response.data.token);
      
      // Update axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      window.location.href = '/donor-dashboard';
    } catch (error) {
      setMessage('Error accessing donor account: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="donor-account-container">
      <div className="section-header">
        <h3>Donor Account Management</h3>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {!hasDonor ? (
        <div className="no-donor-account">
          <div className="info-card">
            <div className="card-icon">🩸</div>
            <h4>Create Donor Account</h4>
            <p>
              As a seeker, you can also create a donor account to help others when you're able to donate. 
              This allows you to access donor features while maintaining your seeker profile.
            </p>
            <button 
              className="create-donor-btn"
              onClick={createDonorAccount}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Donor Account'}
            </button>
          </div>
        </div>
      ) : (
        <div className="has-donor-account">
          <div className="donor-info-card">
            <div className="card-header">
              <h4>✅ Donor Account Active</h4>
              <span className="status-badge">Active</span>
            </div>
            
            <div className="account-details">
              <p><strong>Name:</strong> {donorData?.name || user?.name}</p>
              <p><strong>Email:</strong> {donorData?.email || user?.email}</p>
              <p><strong>Blood Group:</strong> {donorData?.bloodGroup || user?.bloodGroup || 'Not set'}</p>
              <p><strong>Created:</strong> {donorData?.createdAt ? new Date(donorData.createdAt).toLocaleDateString() : 'Today'}</p>
            </div>

            <div className="donor-actions">
              <button 
                className="access-donor-btn"
                onClick={accessDonorDashboard}
              >
                Access Donor Dashboard
              </button>
            </div>
          </div>

          <div className="donor-features">
            <h4>Donor Account Features</h4>
            <ul>
              <li>🩸 Add and manage blood donations</li>
              <li>📋 View and respond to blood requests</li>
              <li>🔔 Receive notifications from seekers</li>
              <li>👤 Maintain donor profile and availability</li>
              <li>🚨 SOS button for emergency contacts</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorAccountManager;