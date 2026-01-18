import React, { useState, useEffect } from 'react';
import { Layout, message as antdMessage, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import ConversationList from '../../components/Chat/ConversationList';
import MessageArea from '../../components/Chat/MessageArea';
import NewChatModal from '../../components/Chat/NewChatModal';
import { useSocket } from '../../hooks/useSocket';
import Header from '../../components/Header';
import './ChatPage.css';

const { Sider, Content } = Layout;

const ChatPage = () => {
  // State
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showSidebar, setShowSidebar] = useState(false); // Mobile sidebar toggle

  // Socket.io hook
  const {
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
  } = useSocket();

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Socket.io event listeners
  useEffect(() => {
    on('message:new', handleNewMessage);
    on('typing:start', handleTypingStart);
    on('typing:stop', handleTypingStop);
    on('message:deleted', handleMessageDeleted);
    on('group:created', handleGroupCreated);

    return () => {
      off('message:new', handleNewMessage);
      off('typing:start', handleTypingStart);
      off('typing:stop', handleTypingStop);
      off('message:deleted', handleMessageDeleted);
      off('group:created', handleGroupCreated);
    };
  }, [selectedConversation]);

  // Join selected conversation room
  useEffect(() => {
    if (selectedConversation) {
      joinConversation(selectedConversation.id);
      fetchMessages(selectedConversation.id);

      return () => {
        leaveConversation(selectedConversation.id);
      };
    }
  }, [selectedConversation]);

  // API Functions
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setConversations(data.conversations);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      antdMessage.error('Failed to load conversations');
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/conversations/${conversationId}/messages`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
        await markMessagesAsRead(conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      antdMessage.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (messageText) => {
    if (!selectedConversation || !messageText.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          message_text: messageText
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        sendMessage({
          conversationId: selectedConversation.id,
          messageId: data.message.id,
          message: data.message
        });
        updateConversationLastMessage(selectedConversation.id, data.message);
      } else {
        antdMessage.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      antdMessage.error('Failed to send message');
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/chat/messages/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ conversation_id: conversationId })
      });

      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Socket.io Event Handlers
  const handleNewMessage = (data) => {
    const { conversationId, message } = data;

    if (selectedConversation?.id === conversationId) {
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
      markMessagesAsRead(conversationId);
    } else {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: (conv.unread_count || 0) + 1 }
            : conv
        )
      );
    }

    updateConversationLastMessage(conversationId, message);
  };

  const handleTypingStart = ({ conversationId, userId }) => {
    if (selectedConversation?.id === conversationId) {
      setTypingUsers(prev => new Set([...prev, userId]));
    }
  };

  const handleTypingStop = ({ conversationId, userId }) => {
    if (selectedConversation?.id === conversationId) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleMessageDeleted = ({ messageId }) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const handleGroupCreated = () => {
    fetchConversations();
    antdMessage.success('You were added to a new group!');
  };

  const updateConversationLastMessage = (conversationId, message) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
            ...conv,
            last_message: message.message_text,
            last_message_at: message.created_at,
            updated_at: message.created_at
          }
          : conv
      ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    );
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowSidebar(false); // Hide sidebar on mobile after selection
  };

  const handleConversationCreated = (newConversation) => {
    fetchConversations();
    setShowNewChatModal(false);

    if (newConversation.id) {
      setTimeout(() => {
        const conv = conversations.find(c => c.id === newConversation.id);
        if (conv) {
          setSelectedConversation(conv);
        }
      }, 500);
    }
  };

  return (
    <>
      <Header />
      <div className="chat-page-container">
        <Header />
        {/* Mobile Toggle Button */}
        <Button
          className="mobile-toggle-btn"
          icon={<MenuOutlined />}
          onClick={() => setShowSidebar(!showSidebar)}
          type="primary"
        >
          Chats
        </Button>

        <Layout className="chat-layout">
          {/* Sidebar with mobile toggle */}
          <Sider
            width={350}
            theme="light"
            className={`conversation-sidebar ${showSidebar ? 'show-mobile' : ''}`}
            breakpoint="lg"
            collapsedWidth="0"
          >
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              onNewChat={() => setShowNewChatModal(true)}
              onlineUsers={onlineUsers}
              loading={loading}
            />
          </Sider>

          {/* Overlay for mobile */}
          {showSidebar && (
            <div
              className="mobile-overlay"
              onClick={() => setShowSidebar(false)}
            />
          )}

          <Content className="message-content-area">
            <MessageArea
              conversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onStartTyping={() => startTyping(selectedConversation?.id)}
              onStopTyping={() => stopTyping(selectedConversation?.id)}
              typingUsers={typingUsers}
              isConnected={isConnected}
            />
          </Content>
        </Layout>
      </div>

      <NewChatModal
        visible={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onConversationCreated={handleConversationCreated}
      />
    </>
  );
};

export default ChatPage;
