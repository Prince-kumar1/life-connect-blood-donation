import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/seeker/my-requests');
      setRequests(response.data);
    } catch (error) {
      setMessage('Error fetching requests: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#28a745';
      case 'completed': return '#17a2b8';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="my-requests-container">
      <div className="section-header">
        <h3>My Blood Requests</h3>
        <button className="refresh-btn" onClick={fetchMyRequests}>
          Refresh
        </button>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading your requests...</div>
      ) : (
        <div className="requests-list">
          {requests.length === 0 ? (
            <div className="no-requests">
              <p>You haven't made any blood requests yet.</p>
              <p>Go to "Available Blood" section to request blood from donors.</p>
            </div>
          ) : (
            requests.map(request => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div className="blood-group-info">
                    <h4>Blood Group: {request.bloodGroup}</h4>
                    <span 
                      className="urgency-badge"
                      style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                    >
                      {request.urgency.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="status-info">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {getStatusIcon(request.status)} {request.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="request-details">
                  <div className="detail-row">
                    <p><strong>Location:</strong> {request.location}</p>
                    <p><strong>Contact:</strong> {request.contactPhone}</p>
                  </div>
                  
                  {request.message && (
                    <p><strong>Message:</strong> {request.message}</p>
                  )}
                  
                  <p><strong>Requested:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                  
                  {request.acceptedBy && (
                    <div className="donor-info">
                      <h5>Accepted by:</h5>
                      <p><strong>Name:</strong> {request.acceptedBy.name}</p>
                      <p><strong>Email:</strong> {request.acceptedBy.email}</p>
                      <p><strong>Phone:</strong> {request.acceptedBy.phone}</p>
                    </div>
                  )}
                </div>

                {request.status === 'accepted' && (
                  <div className="action-note">
                    <p className="success-note">
                      🎉 Great! Your request has been accepted. Please contact the donor to coordinate the donation.
                    </p>
                  </div>
                )}

                {request.status === 'completed' && (
                  <div className="action-note">
                    <p className="completed-note">
                      ✅ Request completed successfully. Thank you for using our service!
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyRequests;