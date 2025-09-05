import React, { useState, useEffect } from 'react';

const Notifications = ({ notifications, setUnreadCount }) => {
  const [localNotifications, setLocalNotifications] = useState([]);

  useEffect(() => {
    fetchRealNotifications();
  }, []);

  const fetchRealNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const notifications = await response.json();
        
        // If no real notifications, show demo notifications
        if (notifications.length === 0) {
          const demoNotifications = [
            {
              _id: 'demo1',
              type: 'request_accepted',
              title: 'Blood Request Accepted!',
              message: 'Your blood request for A+ has been accepted by John Doe.',
              createdAt: new Date(Date.now() - 1000 * 60 * 30),
              read: false,
              relatedUserId: {
                name: 'John Doe',
                phone: '+1234567890',
                email: 'john@example.com'
              }
            },

          ];
          setLocalNotifications(demoNotifications);
        } else {
          setLocalNotifications(notifications);
        }
      } else {
        setLocalNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLocalNotifications([]);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setLocalNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      
      const unreadCount = localNotifications.filter(n => !n.read && n._id !== notificationId).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setLocalNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'request_accepted': return '✅';
      case 'request_rejected': return '❌';
      case 'request_sent': return '📤';
      case 'new_request': return '📤';
      case 'request_completed': return '🎉';
      case 'new_donor': return '🩸';
      default: return '📢';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="notifications-container">
      <div className="section-header">
        <h3>Notifications</h3>
        {localNotifications.some(n => !n.read) && (
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            Mark All as Read
          </button>
        )}
      </div>

      {/* Accepted Requests Section */}
      <div className="notification-section">
        <h4 className="section-title">✅ Accepted Requests</h4>
        <div className="notifications-list">
          {localNotifications.filter(n => n.type === 'request_accepted' || n.type === 'request_completed').length === 0 ? (
            <div className="no-notifications">
              <p>No accepted requests yet.</p>
            </div>
          ) : (
            localNotifications
              .filter(n => n.type === 'request_accepted' || n.type === 'request_completed')
              .map(notification => (
                <div 
                  key={notification._id} 
                  className={`notification-card ${!notification.read ? 'unread' : 'read'}`}
                  onClick={() => !notification.read && markAsRead(notification._id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4>{notification.title}</h4>
                      <span className="notification-time">
                        {getTimeAgo(new Date(notification.createdAt))}
                      </span>
                    </div>
                    
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    
                    {notification.relatedUserId && (
                      <div className="donor-contact-info">
                        <h5>Donor Contact:</h5>
                        <p><strong>Name:</strong> {notification.relatedUserId.name}</p>
                        <p><strong>Phone:</strong> {notification.relatedUserId.phone}</p>
                        <p><strong>Email:</strong> {notification.relatedUserId.email}</p>
                      </div>
                    )}
                    
                    {!notification.read && (
                      <div className="unread-indicator">
                        <span className="unread-dot"></span>
                        New
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <div className="notification-settings">
        <h4>Notification Preferences</h4>
        <div className="settings-options">
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            Email notifications for accepted requests
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            SMS notifications for urgent updates
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            New donor alerts in your area
          </label>
        </div>
      </div>
    </div>
  );
};

export default Notifications;