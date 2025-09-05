import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SeekerAccountManager = () => {
  const [hasSeeker, setHasSeeker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [seekerData, setSeekerData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    checkSeekerAccount();
  }, []);

  const checkSeekerAccount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/seeker-account');
      if (response.data.exists) {
        setHasSeeker(true);
        setSeekerData(response.data.seekerAccount);
      }
    } catch (error) {
      setHasSeeker(false);
    }
  };

  const createSeekerAccount = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/create-seeker-account');
      setHasSeeker(true);
      setSeekerData(response.data.seekerAccount);
      setMessage('Seeker account created successfully!');
    } catch (error) {
      setMessage('Error creating seeker account: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const accessSeekerDashboard = async () => {
    try {
      // Get seeker account token
      const response = await axios.post('http://localhost:5000/api/auth/seeker-login', {
        donorEmail: user.email
      });
      
      // Store original donor token and switch to seeker token
      localStorage.setItem('originalUserType', 'donor');
      localStorage.setItem('donorToken', localStorage.getItem('token'));
      localStorage.setItem('token', response.data.token);
      
      // Update axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      window.location.href = '/seeker-dashboard';
    } catch (error) {
      setMessage('Error accessing seeker account: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const returnToDonorAccount = () => {
    // Clear seeker mode and return to donor dashboard
    localStorage.removeItem('originalUserType');
    localStorage.removeItem('donorAccountData');
    window.location.href = '/donor-dashboard';
  };

  return (
    <div className="seeker-account-container">
      <div className="section-header">
        <h3>Seeker Account Management</h3>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {!hasSeeker ? (
        <div className="no-seeker-account">
          <div className="info-card">
            <div className="card-icon">🩸</div>
            <h4>Create Seeker Account</h4>
            <p>
              As a donor, you can also create a seeker account to request blood when needed. 
              This allows you to access seeker features while maintaining your donor profile.
            </p>
            <button 
              className="create-seeker-btn"
              onClick={createSeekerAccount}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Seeker Account'}
            </button>
          </div>
        </div>
      ) : (
        <div className="has-seeker-account">
          <div className="seeker-info-card">
            <div className="card-header">
              <h4>✅ Seeker Account Active</h4>
              <span className="status-badge">Active</span>
            </div>
            
            <div className="account-details">
              <p><strong>Name:</strong> {seekerData?.name || user?.name}</p>
              <p><strong>Email:</strong> {seekerData?.email || user?.email}</p>
              <p><strong>Blood Group:</strong> {seekerData?.bloodGroup || user?.bloodGroup || 'Not set'}</p>
              <p><strong>Created:</strong> {seekerData?.createdAt ? new Date(seekerData.createdAt).toLocaleDateString() : 'Today'}</p>
            </div>

            <div className="seeker-actions">
              <button 
                className="access-seeker-btn"
                onClick={accessSeekerDashboard}
              >
                Access Seeker Dashboard
              </button>
            </div>
          </div>

          <div className="seeker-features">
            <h4>Seeker Account Features</h4>
            <ul>
              <li>🔍 Search for available blood donations</li>
              <li>📋 Create and manage blood requests</li>
              <li>🔔 Receive notifications from donors</li>
              <li>🤖 Access AI help for blood-related queries</li>
              <li>🚨 Emergency services and hospital locator</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerAccountManager;