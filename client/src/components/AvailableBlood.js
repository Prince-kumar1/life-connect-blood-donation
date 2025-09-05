import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AvailableBlood = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [requestForm, setRequestForm] = useState({
    urgency: 'medium',
    location: '',
    contactPhone: '',
    message: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: '#28a745' },
    { value: 'medium', label: 'Medium', color: '#ffc107' },
    { value: 'high', label: 'High', color: '#fd7e14' },
    { value: 'emergency', label: 'Emergency', color: '#dc3545' }
  ];

  useEffect(() => {
    fetchAvailableBlood();
  }, []);

  useEffect(() => {
    if (filterBloodGroup) {
      setFilteredDonations(donations.filter(d => d.bloodGroup === filterBloodGroup));
    } else {
      setFilteredDonations(donations);
    }
  }, [donations, filterBloodGroup]);

  const fetchAvailableBlood = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/seeker/available-blood');
      setDonations(response.data);
    } catch (error) {
      setMessage('Error fetching available blood: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBlood = (donation) => {
    setSelectedDonor(donation);
    setRequestForm({
      urgency: 'medium',
      location: '',
      contactPhone: '',
      message: ''
    });
    setShowRequestForm(true);
  };

  const handleFormChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value
    });
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    if (!validatePhone(requestForm.contactPhone)) {
      setMessage('Phone number must be exactly 10 digits');
      return;
    }
    
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/seeker/request-blood', {
        bloodGroup: selectedDonor.bloodGroup,
        urgency: requestForm.urgency,
        location: requestForm.location,
        contactPhone: requestForm.contactPhone,
        message: requestForm.message,
        donorId: selectedDonor.donorId._id
      });

      setMessage('Blood request sent successfully!');
      setShowRequestForm(false);
      setSelectedDonor(null);
    } catch (error) {
      setMessage('Error sending request: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="available-blood-container">
      <div className="section-header">
        <h3>Available Blood Donations</h3>
        <div className="filter-section">
          <select
            value={filterBloodGroup}
            onChange={(e) => setFilterBloodGroup(e.target.value)}
            className="filter-select"
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <button className="refresh-btn" onClick={fetchAvailableBlood}>
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading available blood...</div>
      ) : (
        <div className="donations-grid">
          {filteredDonations.length === 0 ? (
            <div className="no-donations">
              <p>No blood donations available at the moment.</p>
            </div>
          ) : (
            filteredDonations.map(donation => (
              <div key={donation._id} className="donation-card">
                <div className="blood-group-badge">
                  {donation.bloodGroup}
                </div>
                
                <div className="donor-info">
                  <h4>{donation.donorId?.name}</h4>
                  {donation.donorEmail && donation.donorPhone ? (
                    <>
                      <p><strong>Email:</strong> {donation.donorEmail}</p>
                      <p><strong>Phone:</strong> {donation.donorPhone}</p>
                    </>
                  ) : (
                    <p><strong>Contact:</strong> <span style={{color: '#e74c3c'}}>Available on request</span></p>
                  )}
                  {donation.location && <p><strong>Location:</strong> {donation.location}</p>}
                  <p><strong>Available:</strong> 
                    <span className="available">Yes</span>
                  </p>
                </div>

                <button 
                  className="request-btn"
                  onClick={() => handleRequestBlood(donation)}
                >
                  Request Blood
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {showRequestForm && (
        <div className="modal-overlay">
          <div className="request-modal">
            <div className="modal-header">
              <h4>Request Blood from {selectedDonor?.donorId?.name}</h4>
              <button 
                className="close-btn"
                onClick={() => setShowRequestForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitRequest}>
              <div className="form-group">
                <label>Blood Group: <strong>{selectedDonor?.bloodGroup}</strong></label>
              </div>

              <div className="form-group">
                <label>Urgency Level:</label>
                <select
                  name="urgency"
                  value={requestForm.urgency}
                  onChange={handleFormChange}
                  required
                >
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Your Location:</label>
                <input
                  type="text"
                  name="location"
                  value={requestForm.location}
                  onChange={handleFormChange}
                  placeholder="Hospital/Address"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Phone:</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={requestForm.contactPhone}
                  onChange={handleFormChange}
                  placeholder="10 digits only"
                  maxLength="10"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="form-group">
                <label>Message (Optional):</label>
                <textarea
                  name="message"
                  value={requestForm.message}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Additional details about your requirement"
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowRequestForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableBlood;