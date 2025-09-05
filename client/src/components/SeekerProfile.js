import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SeekerProfile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bloodGroup: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [randomNumber, setRandomNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bloodGroup: user.bloodGroup || ''
      });
      
      // Auto-save profile data from registration if not complete
      if (!user.isProfileComplete && user.name && user.email) {
        setIsEditing(true);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      setMessage('Phone number must be exactly 10 digits');
      return;
    }
    
    if (!window.confirm('This will change your profile information. Are you sure you want to continue?')) {
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.put('http://localhost:5000/api/seeker/profile', formData);
      setUser(response.data);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const generateRandomNumber = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleDeleteAccount = () => {
    const randomNum = generateRandomNumber();
    setRandomNumber(randomNum);
    setShowDeleteModal(true);
    setDeleteConfirmed(false);
    setUserInput('');
  };

  const confirmDeleteAccount = async () => {
    if (!deleteConfirmed) {
      setMessage('Please confirm account deletion by checking the checkbox');
      return;
    }

    if (userInput !== randomNumber) {
      setMessage('Incorrect verification number. Please try again.');
      return;
    }

    setDeleteLoading(true);
    try {
      await axios.delete('http://localhost:5000/api/auth/delete-account');
      logout();
      navigate('/');
    } catch (error) {
      setMessage('Error deleting account: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h3>Seeker Profile</h3>
        {!isEditing && (
          <div className="profile-actions">
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
            <button 
              className="delete-btn"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={true}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="10 digits only"
              maxLength="10"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div className="form-group">
            <label>Your Blood Group:</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              disabled={!isEditing}
              required
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            rows="3"
            required
          />
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h4>⚠️ Delete Account</h4>
              <button 
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <p><strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.</p>
              
              <div className="verification-section">
                <p>Please enter this verification number: <strong>{randomNumber}</strong></p>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter verification number"
                  maxLength="4"
                />
              </div>

              <div className="confirmation-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={deleteConfirmed}
                    onChange={(e) => setDeleteConfirmed(e.target.checked)}
                  />
                  I understand that this action cannot be undone and all my data will be permanently deleted.
                </label>
              </div>

              <div className="modal-actions">
                <button 
                  className="confirm-delete-btn"
                  onClick={confirmDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerProfile;