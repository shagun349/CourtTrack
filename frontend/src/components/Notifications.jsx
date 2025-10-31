import { useState, useEffect } from 'react';
import { fetchNotifications, markNotificationsAsRead } from '../api';

const Notifications = ({ onMarkAsRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        setError('Failed to load notifications');
      }
    };

    loadNotifications();
  }, []);

  const handleMarkAsRead = async () => {
    try {
      await markNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      onMarkAsRead();
    } catch (err) {
      setError('Failed to mark notifications as read');
    }
  };

  return (
    <div className="notifications-list">
      <h2>Notifications</h2>
      {error && <div className="error">{error}</div>}
      <button onClick={handleMarkAsRead} disabled={notifications.every(n => n.is_read)}>
        Mark All as Read
      </button>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} className={notification.is_read ? 'read' : 'unread'}>
            {notification.message}
          </li>
        ))}
        {notifications.length === 0 && <li>No notifications</li>}
      </ul>
    </div>
  );
};

export default Notifications;