// =====================================================
// MESSAGE AREA - COMPLETE FIXED VERSION
// File: frontend/src/pages/Chatting/MessageArea.jsx
// With proper header, scrollable messages, and fixed input footer
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Avatar, Empty, Tag } from 'antd';
import { SendOutlined, UserOutlined, WifiOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import './Chat.css';

const { TextArea } = Input;

const MessageArea = ({
  conversation,
  messages,
  onSendMessage,
  onStartTyping,
  onStopTyping,
  typingUsers,
  isConnected
}) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

  // Reset scroll when conversation changes
  useEffect(() => {
    if (messagesContainerRef.current && conversation) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [conversation?.id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current && conversation) {
      const container = messagesContainerRef.current;
      const lastMessage = messagesEndRef.current;
      
      // Always scroll to bottom when new messages come in
      lastMessage.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, conversation?.id]);

  // Handle typing
  const handleTyping = (e) => {
    const text = e.target.value;
    setMessageText(text);

    // Trigger typing indicator
    if (text && !isTyping) {
      setIsTyping(true);
      onStartTyping();
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of no activity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onStopTyping();
    }, 3000);
  };

  // Handle send message
  const handleSend = () => {
    if (!messageText.trim()) return;

    onSendMessage(messageText);
    setMessageText('');
    setIsTyping(false);
    onStopTyping();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Scroll to bottom after sending
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Handle Enter key (Shift+Enter for new line)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // No conversation selected
  if (!conversation) {
    return (
      <div className="message-area-wrapper">
        <div className="no-conversation-selected">
          <Empty 
            description="Select a conversation to start messaging"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="message-area-wrapper">
      {/* ===================================================== */}
      {/* HEADER - Fixed at top */}
      {/* ===================================================== */}
      <div className="message-area-header">
        <div className="header-left">
          <Avatar size={40} icon={<UserOutlined />}>
            {conversation.display_name?.[0]?.toUpperCase()}
          </Avatar>
          <div className="header-info">
            <h3 className="conversation-name">{conversation.display_name}</h3>
            <div className="connection-status">
              {isConnected ? (
                <Tag color="success" icon={<WifiOutlined />}>Online</Tag>
              ) : (
                <Tag color="default">Connecting...</Tag>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* MESSAGES - Scrollable area */}
      {/* ===================================================== */}
      <div className="messages-scroll-container" ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <div className="no-messages-placeholder">
            <Empty 
              description="No messages yet. Start the conversation!"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, index) => {
              const isOwnMessage = msg.sender_id === currentUserId;
              const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
              const showName = !isOwnMessage && showAvatar;

              return (
                <div
                  key={msg.id}
                  className={`message-wrapper ${isOwnMessage ? 'own-message' : 'other-message'}`}
                >
                  {!isOwnMessage && showAvatar && (
                    <Avatar 
                      size="small" 
                      icon={<UserOutlined />}
                      className="message-avatar"
                    >
                      {msg.sender_name?.[0]?.toUpperCase()}
                    </Avatar>
                  )}
                  
                  <div className="message-content-wrapper">
                    {showName && (
                      <div className="message-sender-name">{msg.sender_name}</div>
                    )}
                    
                    <div className="message-bubble">
                      <div className="message-text">{msg.message_text}</div>
                      <div className="message-timestamp">
                        {format(new Date(msg.created_at), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {typingUsers.size > 0 && (
              <div className="typing-indicator-wrapper">
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-text">typing...</span>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ===================================================== */}
      {/* INPUT FOOTER - Fixed at bottom */}
      {/* ===================================================== */}
      <div className="message-input-footer">
        <div className="input-wrapper">
          <TextArea
            value={messageText}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={!isConnected}
            className="message-textarea"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!messageText.trim() || !isConnected}
            className="send-button"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;