import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BloodDonate = () => {
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    donorEmail: '',
    donorPhone: '',
    location: '',
    isAvailable: true,
    showContactDetails: false,
    countryCode: '+91',
    locationState: '',
    locationCity: ''
  });

  const countryCodes = [
    { code: '+91', country: 'India', digits: 10 },
    { code: '+1', country: 'USA/Canada', digits: 10 },
    { code: '+44', country: 'UK', digits: 10 },
    { code: '+61', country: 'Australia', digits: 9 },
    { code: '+81', country: 'Japan', digits: 10 }
  ];

  const statesAndCities = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam']
  };
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blood/my-donations');
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Combine country code with phone number and format location
      const submitData = {
        ...formData,
        donorPhone: formData.countryCode + formData.donorPhone,
        location: `${formData.location}, ${formData.locationCity}, ${formData.locationState}`
      };
      
      if (editingId) {
        await axios.put(`http://localhost:5000/api/blood/donation/${editingId}`, submitData);
        setMessage('Blood donation updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/blood/donate', submitData);
        setMessage('Blood donation added successfully!');
      }
      
      resetForm();
      fetchDonations();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (donation) => {
    setFormData({
      bloodGroup: donation.bloodGroup,
      donorEmail: donation.donorEmail,
      donorPhone: donation.donorPhone,
      location: donation.location || '',
      isAvailable: donation.isAvailable,
      showContactDetails: donation.showContactDetails || false
    });
    setEditingId(donation._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this blood donation?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blood/donation/${id}`);
        setMessage('Blood donation removed successfully!');
        fetchDonations();
      } catch (error) {
        setMessage('Error removing donation: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      bloodGroup: '',
      donorEmail: '',
      donorPhone: '',
      location: '',
      isAvailable: true,
      showContactDetails: false,
      countryCode: '+91',
      locationState: '',
      locationCity: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="blood-donate-container">
      <div className="section-header">
        <h3>Blood Donations</h3>
        <button 
          className="add-btn"
          onClick={() => setShowForm(true)}
        >
          Add Blood Donation
        </button>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <h4>{editingId ? 'Edit Blood Donation' : 'Add Blood Donation'}</h4>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Blood Group:</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="donorEmail"
                    value={formData.donorEmail}
                    onChange={handleChange}
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                    title="Please enter a valid email address"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number:</label>
                  <div className="phone-input-group">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="country-code-select"
                    >
                      {countryCodes.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.code} ({country.country})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="donorPhone"
                      value={formData.donorPhone}
                      onChange={handleChange}
                      placeholder={`${countryCodes.find(c => c.code === formData.countryCode)?.digits} digits`}
                      maxLength={countryCodes.find(c => c.code === formData.countryCode)?.digits}
                      pattern="[0-9]*"
                      className="phone-number-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location State:</label>
                  <select
                    name="locationState"
                    value={formData.locationState}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        locationState: e.target.value,
                        locationCity: ''
                      });
                    }}
                    required
                  >
                    <option value="">Select State</option>
                    {Object.keys(statesAndCities).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location City:</label>
                  <select
                    name="locationCity"
                    value={formData.locationCity}
                    onChange={handleChange}
                    disabled={!formData.locationState}
                    required
                  >
                    <option value="">Select City</option>
                    {formData.locationState && statesAndCities[formData.locationState].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Street Address:</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Street, area, landmark"
                  />
                </div>
              </div>

              <div className="checkbox-section">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                    />
                    <span>Available for donation</span>
                  </label>
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="showContactDetails"
                      checked={formData.showContactDetails}
                      onChange={handleChange}
                    />
                    <span>Allow other users to see my phone number and email</span>
                  </label>
                  <small className="checkbox-help">
                    If unchecked, only blood group and location will be visible to other users
                  </small>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
                </button>
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="donations-list">
        {donations.length === 0 ? (
          <p>No blood donations added yet.</p>
        ) : (
          donations.map(donation => (
            <div key={donation._id} className="donation-card">
              <div className="donation-info">
                <h4>Blood Group: {donation.bloodGroup}</h4>
                {donation.showContactDetails ? (
                  <>
                    <p><strong>Email:</strong> {donation.donorEmail}</p>
                    <p><strong>Phone:</strong> {donation.donorPhone}</p>
                  </>
                ) : (
                  <p><strong>Contact:</strong> <span style={{color: '#666'}}>Hidden (Privacy enabled)</span></p>
                )}
                {donation.location && <p><strong>Location:</strong> {donation.location}</p>}
                <p><strong>Status:</strong> 
                  <span className={donation.isAvailable ? 'available' : 'unavailable'}>
                    {donation.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </p>
                <p><strong>Added:</strong> {new Date(donation.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="donation-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(donation)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(donation._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BloodDonate;