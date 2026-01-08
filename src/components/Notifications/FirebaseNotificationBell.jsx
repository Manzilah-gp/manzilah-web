import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, List, Button, Empty, message as antdMessage } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Firestore imports
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  limit 
} from 'firebase/firestore';

// Messaging imports
import { getToken, onMessage } from 'firebase/messaging';

// Firebase config
import { db, messaging } from '../../config/firebase';

// CSS
import './NotificationBell.css';

const FirebaseNotificationBell = () => {
  // Add console log immediately
  console.log('🔔 ========== NotificationBell Component Loaded ==========');
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Get current user ID from JWT token
  let currentUserId = null;
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    console.log('🎫 Token exists:', !!token);
    
    if (token) {
      try {
        // Decode JWT token (format: header.payload.signature)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        console.log('📄 Token payload:', payload);
        
        // Try different possible field names
        currentUserId = payload?.id || payload?.userId || payload?.user_id || payload?.sub;
        console.log('✅ User ID from token:', currentUserId);
      } catch (e) {
        console.error('⚠️ Could not decode token:', e);
      }
    } else {
      console.error('❌ No token found in localStorage');
    }
  } catch (err) {
    console.error('❌ Error getting user ID:', err);
  }

  useEffect(() => {
    console.log('🔄 useEffect triggered');
    
    if (!currentUserId) {
      console.error('❌ No current user ID found');
      return;
    }

    console.log('✅ Starting notification setup for user:', currentUserId);

    // Request notification permission
    requestNotificationPermission();

    // Listen to Firestore notifications
    try {
      console.log('👂 Setting up Firestore listener...');
      
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', currentUserId.toString()),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          console.log('📊 Firestore snapshot received');
          console.log('📄 Snapshot size:', snapshot.size);
          
          const notifs = [];
          let unread = 0;

          snapshot.forEach((doc) => {
            const data = doc.data();
            console.log('📝 Notification:', doc.id, data);
            notifs.push({ id: doc.id, ...data });
            if (!data.isRead) unread++;
          });

          console.log('✅ Total notifications:', notifs.length);
          console.log('🔴 Unread count:', unread);

          setNotifications(notifs);
          setUnreadCount(unread);
        },
        (error) => {
          console.error('❌ Firestore listener error:', error);
          setError(error.message);
        }
      );

      // Listen to foreground messages
      try {
        const unsubscribeMessage = onMessage(messaging, (payload) => {
          console.log('📬 Foreground message received:', payload);
          antdMessage.info({
            content: payload.notification.body,
            duration: 4
          });
        });

        return () => {
          console.log('🧹 Cleaning up listeners');
          unsubscribe();
          unsubscribeMessage();
        };
      } catch (msgError) {
        console.error('❌ Messaging setup error:', msgError);
        // Continue without messaging
        return () => {
          console.log('🧹 Cleaning up Firestore listener');
          unsubscribe();
        };
      }
    } catch (err) {
      console.error('❌ Error setting up listeners:', err);
      setError(err.message);
    }
  }, [currentUserId]);

  const requestNotificationPermission = async () => {
    console.log('🔐 Requesting notification permission...');
    
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.error('❌ This browser does not support notifications');
        return;
      }

      console.log('📢 Current permission:', Notification.permission);

      const permission = await Notification.requestPermission();
      console.log('📢 Permission result:', permission);
      
      if (permission === 'granted') {
        console.log('✅ Permission granted, getting FCM token...');
        
        try {
          const token = await getToken(messaging, {
            vapidKey: 'BPgFVd2sWgvjv1d76d1Ns94fJGPNMdaezR4RdOgRcXlPjDZC_AJ5zq-M93T7UqkEg5Rgu0jz4qe1hLnBPRgGH4w'
          });

          console.log('🎫 FCM Token:', token);

          // Save token to backend
          const response = await fetch(`${import.meta.env.VITE_API_URL}/firebase-notifications/fcm-token`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fcmToken: token })
          });

          const data = await response.json();
          console.log('💾 Save token response:', data);
          
        } catch (tokenError) {
          console.error('❌ Error getting/saving FCM token:', tokenError);
        }
      } else {
        console.warn('⚠️ Notification permission denied');
      }
    } catch (error) {
      console.error('❌ Error in requestNotificationPermission:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    console.log('✓ Marking as read:', notificationId);
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/firebase-notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const markAllAsRead = async () => {
    console.log('✓✓ Marking all as read');
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/firebase-notifications/read-all`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    console.log('🗑️ Deleting notification:', notificationId);
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/firebase-notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (error) {
      console.error('Delete notification error:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    console.log('🖱️ Notification clicked:', notification);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
    setOpen(false);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      message: '💬',
      course: '📚',
      payment: '💳',
      system: '🔔',
      group: '👥'
    };
    return icons[type] || '🔔';
  };

  const dropdownContent = (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        {notifications.length > 0 && (
          <Button size="small" type="link" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      {error && (
        <div style={{ padding: '20px', color: 'red' }}>
          Error: {error}
        </div>
      )}
      
      {notifications.length === 0 ? (
        <Empty 
          description="No notifications"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '40px 20px' }}
        />
      ) : (
        <List
          className="notification-list"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className={`notification-item ${!item.isRead ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(item)}
              actions={[
                !item.isRead && (
                  <Button
                    size="small"
                    type="text"
                    icon={<CheckOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(item.id);
                    }}
                  />
                ),
                <Button
                  size="small"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                />
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  <div className="notification-icon">
                    {getNotificationIcon(item.type)}
                  </div>
                }
                title={
                  <div className="notification-title">
                    {item.title}
                    {!item.isRead && <span className="unread-dot"></span>}
                  </div>
                }
                description={
                  <>
                    <div className="notification-message">{item.message}</div>
                    <div className="notification-time">
                      {item.createdAt && item.createdAt.toDate ? 
                        formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true }) :
                        'Just now'
                      }
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
      
      <div className="notification-footer">
        <Button type="link" onClick={() => {
          navigate('/notifications');
          setOpen(false);
        }}>
          View all notifications
        </Button>
      </div>
    </div>
  );

  console.log('🎨 Rendering bell, unread count:', unreadCount);

  return (
    <Dropdown
      overlay={dropdownContent}
      trigger={['click']}
      open={open}
      onOpenChange={(visible) => {
        console.log('🔽 Dropdown', visible ? 'opened' : 'closed');
        setOpen(visible);
      }}
      placement="bottomRight"
      overlayClassName="notification-dropdown-overlay"
    >
      <Badge count={unreadCount} offset={[-5, 5]} size="small">
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: '20px', color: 'white' }} />}
          className="notification-bell-button"
          onClick={() => console.log('🔔 Bell button clicked')}
        />
      </Badge>
    </Dropdown>
  );
};

export default FirebaseNotificationBell;