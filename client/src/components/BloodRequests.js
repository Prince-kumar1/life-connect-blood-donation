import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/requests/all');
      setRequests(response.data);
    } catch (error) {
      setMessage('Error fetching requests: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/accept/${requestId}`);
      setMessage('Request accepted successfully!');
      fetchRequests();
    } catch (error) {
      setMessage('Error accepting request: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        await axios.put(`http://localhost:5000/api/requests/reject/${requestId}`);
        setMessage('Request rejected successfully!');
        fetchRequests();
      } catch (error) {
        setMessage('Error rejecting request: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const handleCompleteRequest = async (requestId) => {
    if (window.confirm('Mark this request as completed?')) {
      try {
        await axios.delete(`http://localhost:5000/api/requests/${requestId}`);
        setMessage('Request marked as completed!');
        fetchRequests();
      } catch (error) {
        setMessage('Error completing request: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return '#ff4444';
      case 'high': return '#ff8800';
      case 'medium': return '#ffaa00';
      case 'low': return '#00aa00';
      default: return '#666';
    }
  };

  return (
    <div className="blood-requests-container">
      <div className="section-header">
        <h3>Blood Requests</h3>
        <button className="refresh-btn" onClick={fetchRequests}>
          Refresh
        </button>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : (
        <div className="requests-list">
          {requests.length === 0 ? (
            <div className="no-requests">
              <p>No pending blood requests at the moment.</p>
            </div>
          ) : (
            requests.map(request => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h4>Blood Group: {request.bloodGroup}</h4>
                  <span 
                    className="urgency-badge"
                    style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                  >
                    {request.urgency.toUpperCase()}
                  </span>
                </div>

                <div className="request-info">
                  <p><strong>Seeker:</strong> {request.seekerId?.name}</p>
                  <p><strong>Contact:</strong> {request.contactPhone}</p>
                  <p><strong>Location:</strong> {request.location}</p>
                  {request.message && (
                    <p><strong>Message:</strong> {request.message}</p>
                  )}
                  <p><strong>Requested:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-${request.status}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </p>
                </div>

                <div className="request-actions">
                  {request.status === 'pending' && (
                    <>
                      <button 
                        className="accept-btn"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept Request
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Reject Request
                      </button>
                    </>
                  )}
                  
                  {request.status === 'accepted' && (
                    <button 
                      className="complete-btn"
                      onClick={() => handleCompleteRequest(request._id)}
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BloodRequests;