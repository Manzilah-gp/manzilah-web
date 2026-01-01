
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Get auth token
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No token found, Socket.io will not connect');
      return;
    }

    // Initialize Socket.io connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Socket.io connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket.io disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket.io connection error:', error.message);
      setIsConnected(false);
    });

    // User status events
    socket.on('user:online', ({ userId }) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])]);
    });

    socket.on('user:offline', ({ userId }) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    // Cleanup on unmount
    return () => {
      console.log(' Disconnecting Socket.io');
      socket.disconnect();
    };
  }, []);

  // Join conversation
  const joinConversation = (conversationId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('conversation:join', conversationId);
      console.log(`👥 Joined conversation ${conversationId}`);
    }
  };

  // Leave conversation
  const leaveConversation = (conversationId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('conversation:leave', conversationId);
      console.log(`👋 Left conversation ${conversationId}`);
    }
  };

  // Send message
  const sendMessage = (data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message:send', data);
    }
  };

  // Start typing indicator
  const startTyping = (conversationId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing:start', conversationId);
    }
  };

  // Stop typing indicator
  const stopTyping = (conversationId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing:stop', conversationId);
    }
  };

  // Mark message as read
  const markAsRead = (conversationId, messageId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message:read', { conversationId, messageId });
    }
  };

  // Subscribe to event
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  // Unsubscribe from event
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    on,
    off
  };
};

export default useSocket;