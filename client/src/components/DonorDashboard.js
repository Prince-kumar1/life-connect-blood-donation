import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DonorProfile from './DonorProfile';
import BloodDonate from './BloodDonate';
import BloodRequests from './BloodRequests';
import SOSButton from './SOSButton';
import EmergencyServices from './EmergencyServices';
import SeekerAccountManager from './SeekerAccountManager';

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard" style={{background: 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)'}}>
      <nav className="navbar" style={{background: '#2c3e50'}}>
        <div className="nav-brand">
          <h2 style={{color: '#ecf0f1'}}>Life Connect - Donor Dashboard</h2>
        </div>
        
        <div className="nav-menu">
          <button 
            className={activeTab === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'profile' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={activeTab === 'donate' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('donate')}
          >
            Blood Donate
          </button>
          <button 
            className={activeTab === 'requests' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('requests')}
          >
            Blood Requests
          </button>
          <button 
            className={activeTab === 'emergency' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('emergency')}
          >
            Emergency
          </button>
          {localStorage.getItem('originalUserType') === 'seeker' && (
            <button 
              className="return-seeker-btn"
              onClick={() => {
                // Restore seeker token and return to seeker dashboard
                const seekerToken = localStorage.getItem('seekerToken');
                if (seekerToken) {
                  localStorage.setItem('token', seekerToken);
                  axios.defaults.headers.common['Authorization'] = `Bearer ${seekerToken}`;
                  localStorage.removeItem('seekerToken');
                  localStorage.removeItem('originalUserType');
                  window.location.href = '/seeker-dashboard';
                }
              }}
            >
              🔄 Return to Seeker
            </button>
          )}
          {localStorage.getItem('originalUserType') !== 'seeker' && (
            <button 
              className={activeTab === 'seeker-account' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveTab('seeker-account')}
            >
              Seeker Account
            </button>
          )}
          <SOSButton />
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h3>Welcome, {user?.name}!</h3>
          <p>Thank you for being a blood donor. Your contribution saves lives.</p>
        </div>

        <div className="tab-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-home">
              <div className="welcome-hero">
                <h2>🩸 Welcome to Life Connect, {user?.name}!</h2>
                <p className="hero-subtitle">Thank you for being a life-saving blood donor</p>
              </div>
              
              <div className="dashboard-cards">
                <div className="info-card">
                  <div className="card-icon">🎯</div>
                  <h3>Our Mission</h3>
                  <p>Connecting blood donors with those in need through a seamless, real-time platform that saves lives every day.</p>
                </div>
                
                <div className="info-card">
                  <div className="card-icon">🤝</div>
                  <h3>How It Works</h3>
                  <p>Register your blood donations, respond to urgent requests, and help patients get the blood they need quickly and efficiently.</p>
                </div>
                
                <div className="info-card">
                  <div className="card-icon">🚨</div>
                  <h3>Emergency Ready</h3>
                  <p>Access emergency services, find nearby hospitals and blood banks, and use our SOS feature for critical situations.</p>
                </div>
              </div>
              
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn" onClick={() => setActiveTab('donate')}>
                    🩸 Add Blood Donation
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('requests')}>
                    📋 View Blood Requests
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('emergency')}>
                    🚨 Emergency Services
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'profile' && <DonorProfile />}
          {activeTab === 'donate' && <BloodDonate />}
          {activeTab === 'requests' && <BloodRequests />}
          {activeTab === 'emergency' && <EmergencyServices />}
          {activeTab === 'seeker-account' && <SeekerAccountManager />}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;