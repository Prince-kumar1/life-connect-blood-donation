import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeekerProfile from './SeekerProfile';
import AvailableBlood from './AvailableBlood';
import MyRequests from './MyRequests';
import Notifications from './Notifications';
import AIChat from './AIChat';
import EmergencyServices from './EmergencyServices';
import DonorAccountManager from './DonorAccountManager';

const SeekerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [displayUser, setDisplayUser] = useState(user);

  useEffect(() => {
    // Update display user when user changes
    if (user) {
      setDisplayUser(user);
    }
    // Fetch notifications
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const notifications = await response.json();
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard" style={{background: 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)'}}>
      <nav className="navbar" style={{background: '#2c3e50'}}>
        <div className="nav-brand">
          <h2 style={{color: '#ecf0f1'}}>Life Connect - Seeker Dashboard</h2>
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
            className={activeTab === 'available' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('available')}
          >
            Available Blood
          </button>
          <button 
            className={activeTab === 'requests' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('requests')}
          >
            My Requests
          </button>
          <button 
            className={activeTab === 'notifications' ? 'nav-btn active notification-btn' : 'nav-btn notification-btn'}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          <button 
            className={activeTab === 'chat' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('chat')}
          >
            🤖 AI Help
          </button>
          <button 
            className={activeTab === 'emergency' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('emergency')}
          >
            🏥 Emergency
          </button>
          {localStorage.getItem('originalUserType') !== 'donor' && (
            <button 
              className={activeTab === 'donor-account' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveTab('donor-account')}
            >
              Donor Account
            </button>
          )}
          {localStorage.getItem('originalUserType') === 'donor' && (
            <button 
              className="return-donor-btn"
              onClick={() => {
                // Restore donor token and return to donor dashboard
                const donorToken = localStorage.getItem('donorToken');
                if (donorToken) {
                  localStorage.setItem('token', donorToken);
                  axios.defaults.headers.common['Authorization'] = `Bearer ${donorToken}`;
                  localStorage.removeItem('donorToken');
                  localStorage.removeItem('originalUserType');
                  window.location.href = '/donor-dashboard';
                }
              }}
            >
              🔄 Return to Donor
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h3>Welcome, {displayUser?.name || user?.name}!</h3>
          <p>Find blood donors and get help when you need it most.</p>
          {localStorage.getItem('originalUserType') === 'donor' && (
            <div className="donor-mode-notice">
              <p style={{color: '#17a2b8', fontWeight: 'bold', marginTop: '10px'}}>
                🔄 You are accessing seeker features from your donor account
              </p>
            </div>
          )}
        </div>

        <div className="tab-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-home">
              <div className="welcome-hero">
                <h2>💖 Welcome to Life Connect, {displayUser?.name || user?.name}!</h2>
                <p className="hero-subtitle">Find the blood you need quickly and safely</p>
              </div>
              
              <div className="dashboard-cards">
                <div className="info-card">
                  <div className="card-icon">🎯</div>
                  <h3>Our Mission</h3>
                  <p>Connecting blood seekers with verified donors through a secure, real-time platform that prioritizes urgent medical needs.</p>
                </div>
                
                <div className="info-card">
                  <div className="card-icon">🔍</div>
                  <h3>Find Blood</h3>
                  <p>Search available blood donations by type, location, and urgency. Send requests directly to donors and track your request status.</p>
                </div>
                
                <div className="info-card">
                  <div className="card-icon">🤖</div>
                  <h3>AI Assistant</h3>
                  <p>Get instant help with blood-related questions, emergency guidance, and personalized assistance from our AI helper.</p>
                </div>
              </div>
              
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn" onClick={() => setActiveTab('available')}>
                    🩸 Find Available Blood
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('chat')}>
                    🤖 AI Help Assistant
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('emergency')}>
                    🚨 Emergency Services
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'profile' && <SeekerProfile />}
          {activeTab === 'available' && <AvailableBlood />}
          {activeTab === 'requests' && <MyRequests />}
          {activeTab === 'notifications' && <Notifications notifications={notifications} setUnreadCount={setUnreadCount} />}
          {activeTab === 'chat' && <AIChat />}
          {activeTab === 'emergency' && <EmergencyServices />}
          {activeTab === 'donor-account' && <DonorAccountManager />}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;