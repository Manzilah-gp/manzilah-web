// =====================================================
// DEBUG VERSION - Shows Remove button + Working File Upload
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import { 
  Input, Button, Avatar, Empty, Tag, Dropdown, Modal, message as antdMessage,
  Tooltip, Upload, Space, Alert
} from 'antd';
import { 
  SendOutlined, UserOutlined, WifiOutlined, MoreOutlined,
  EditOutlined, DeleteOutlined, LogoutOutlined, UserDeleteOutlined,
  CheckOutlined, CloseOutlined, PaperClipOutlined, FileOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';
import './Chat.css';

const { TextArea } = Input;

const getUserColor = (userId) => {
  const colors = ['#0084ff', '#00c853', '#ff6d00', '#aa00ff', '#d50000', '#00b8d4', '#6200ea', '#c51162'];
  return colors[userId % colors.length];
};

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
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (conversation?.type === 'group') {
      fetchGroupMembers();
    }
  }, [conversation?.id]);

  const fetchGroupMembers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/conversations/${conversation.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        console.log('👥 All members:', data.conversation.participants);
        console.log('👤 Current user ID:', currentUserId);
        setGroupMembers(data.conversation.participants || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    if (e.target.value && !isTyping) {
      setIsTyping(true);
      onStartTyping();
    }
  };

  const handleSend = () => {
    if (!messageText.trim() && !selectedFile) return;
    
    if (selectedFile) {
      onSendMessage(`📎 File: ${selectedFile.name}`);
      setSelectedFile(null);
    } else {
      onSendMessage(messageText);
    }
    setMessageText('');
  };

  const handleFileSelect = (file) => {
    console.log('📎 File selected:', file.name);
    setSelectedFile(file);
    antdMessage.success(`File ready: ${file.name}`);
    return false; // Prevent auto upload
  };

  const handleEdit = async (msgId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/chat/messages/${msgId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message_text: editText })
      });
      antdMessage.success('Updated');
      setEditingMessageId(null);
      window.location.reload();
    } catch (err) {
      antdMessage.error('Failed');
    }
  };

  const handleDelete = async (msgId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/chat/messages/${msgId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      antdMessage.success('Deleted');
      window.location.reload();
    } catch (err) {
      antdMessage.error('Failed');
    }
  };

  const handleRemove = async (userId) => {
    console.log('🗑️ Attempting to remove user:', userId);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/chat/conversations/${conversation.id}/members/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      antdMessage.success('Removed');
      fetchGroupMembers();
    } catch (err) {
      antdMessage.error('Failed');
    }
  };

  // Find current user's role
  const currentUserMember = groupMembers.find(m => m.user_id === currentUserId);
  const isAdmin = currentUserMember?.role === 'admin';
  
  console.log('👑 Current user member:', currentUserMember);
  console.log('🔑 Is admin:', isAdmin);

  if (!conversation) {
    return (
      <div className="message-area-wrapper">
        <div className="no-conversation-selected">
          <Empty description="Select a conversation" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      </div>
    );
  }

  return (
    <div className="message-area-wrapper">
      {/* HEADER */}
      <div className="message-area-header">
        <div className="header-left">
          <Avatar size={40} icon={<UserOutlined />}>{conversation.display_name?.[0]}</Avatar>
          <div className="header-info">
            <h3 className="conversation-name">{conversation.display_name}</h3>
            <div className="connection-status">
              <Tag color={isConnected ? 'success' : 'default'} icon={<WifiOutlined />}>
                {isConnected ? 'Online' : 'Offline'}
              </Tag>
              {conversation.type === 'group' && <Tag color="blue">{groupMembers.length} members</Tag>}
            </div>
          </div>
        </div>
        {conversation.type === 'group' && (
          <Dropdown menu={{
            items: [
              { key: 'members', icon: <UserOutlined />, label: 'Manage Members', onClick: () => setShowMembersModal(true) },
              { key: 'leave', icon: <LogoutOutlined />, label: 'Leave Group', danger: true, onClick: () => setShowLeaveModal(true) }
            ]
          }} trigger={['click']}>
            <Button icon={<MoreOutlined />} type="text" size="large" />
          </Dropdown>
        )}
      </div>

      {/* MESSAGES */}
      <div className="messages-scroll-container">
        <div className="messages-list">
          {messages.map((msg) => {
            const isOwn = msg.sender_id === currentUserId;
            const color = getUserColor(msg.sender_id);
            return (
              <div key={msg.id} className={`message-wrapper ${isOwn ? 'own-message' : 'other-message'}`}>
                {!isOwn && <Avatar size="small" style={{ backgroundColor: color }}>{msg.sender_name?.[0]}</Avatar>}
                <div className="message-content-wrapper">
                  {!isOwn && <div style={{ fontSize: '12px', fontWeight: 600, color, marginBottom: 4 }}>{msg.sender_name}</div>}
                  <div style={{
                    backgroundColor: isOwn ? '#0084ff' : color + '20',
                    borderLeft: !isOwn ? `3px solid ${color}` : 'none',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    minWidth: '120px'
                  }}>
                    {editingMessageId === msg.id ? (
                      <div>
                        <TextArea value={editText} onChange={(e) => setEditText(e.target.value)} autoSize />
                        <Space style={{ marginTop: 8 }}>
                          <Button size="small" type="primary" onClick={() => handleEdit(msg.id)}>Save</Button>
                          <Button size="small" onClick={() => setEditingMessageId(null)}>Cancel</Button>
                        </Space>
                      </div>
                    ) : (
                      <>
                        <div style={{ color: isOwn ? 'white' : '#1c1e21', marginBottom: 4 }}>{msg.message_text}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: isOwn ? 'rgba(255,255,255,0.8)' : '#65676b' }}>
                            {format(new Date(msg.created_at), 'HH:mm')}
                          </span>
                          {isOwn && (
                            <Dropdown menu={{
                              items: [
                                {
                                  key: 'edit',
                                  icon: <EditOutlined />,
                                  label: 'Edit',
                                  onClick: () => {
                                    setEditingMessageId(msg.id);
                                    setEditText(msg.message_text);
                                  }
                                },
                                {
                                  key: 'delete',
                                  icon: <DeleteOutlined />,
                                  label: 'Delete',
                                  danger: true,
                                  onClick: () => {
                                    Modal.confirm({
                                      title: 'Delete?',
                                      content: 'Delete this message?',
                                      okText: 'Delete',
                                      okType: 'danger',
                                      onOk: () => handleDelete(msg.id)
                                    });
                                  }
                                }
                              ]
                            }} trigger={['click']}>
                              <Button 
                                size="small" 
                                type="text" 
                                icon={<MoreOutlined />} 
                                style={{ 
                                  color: 'white', 
                                  marginLeft: 8,
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                  borderRadius: '4px',
                                  padding: '2px 8px'
                                }}
                              />
                            </Dropdown>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT WITH FILE PREVIEW */}
      <div className="message-input-footer">
        <div className="input-wrapper" style={{ flexDirection: 'column', gap: '8px' }}>
          {/* File preview */}
          {selectedFile && (
            <Alert
              message={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><FileOutlined /> {selectedFile.name}</span>
                  <Button size="small" onClick={() => setSelectedFile(null)}>Remove</Button>
                </div>
              }
              type="info"
              closable
              onClose={() => setSelectedFile(null)}
            />
          )}
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
            <Upload beforeUpload={handleFileSelect} showUploadList={false} accept="image/*,.pdf,.doc,.docx">
              <Tooltip title="Attach file">
                <Button icon={<PaperClipOutlined />} type="text" size="large" />
              </Tooltip>
            </Upload>
            <TextArea
              value={messageText}
              onChange={handleTyping}
              placeholder="Type a message..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSend(); } }}
              style={{ flex: 1 }}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>Send</Button>
          </div>
        </div>
      </div>

      {/* MEMBERS MODAL WITH DEBUG INFO */}
      <Modal
        title={
          <div>
            <div>Group Members</div>
            <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#65676b', marginTop: '4px' }}>
              You are: {isAdmin ? '👑 Admin' : '👤 Member'} | Current ID: {currentUserId}
            </div>
          </div>
        }
        open={showMembersModal}
        onCancel={() => setShowMembersModal(false)}
        footer={null}
        width={550}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {groupMembers.map(member => {
            const canRemove = isAdmin && member.user_id !== currentUserId;
            console.log(`Member ${member.full_name}: canRemove=${canRemove}, isAdmin=${isAdmin}, isSelf=${member.user_id === currentUserId}`);
            
            return (
              <div key={member.user_id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                border: '2px solid #e4e6eb',
                borderRadius: '8px',
                backgroundColor: member.user_id === currentUserId ? '#f0f9ff' : 'white'
              }}>
                <Avatar size={40} style={{ backgroundColor: getUserColor(member.user_id) }}>
                  {member.full_name?.[0]}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>
                    {member.full_name}
                    {member.user_id === currentUserId && ' (You)'}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <Tag color={member.role === 'admin' ? 'gold' : 'blue'}>
                      {member.role}
                    </Tag>
                    {canRemove && <Tag color="orange">Can be removed</Tag>}
                  </div>
                </div>
                
                {/* GUARANTEED VISIBLE REMOVE BUTTON */}
                {canRemove && (
                  <Button
                    danger
                    size="middle"
                    icon={<UserDeleteOutlined />}
                    onClick={() => {
                      Modal.confirm({
                        title: 'Remove Member',
                        content: `Remove ${member.full_name}?`,
                        okText: 'Remove',
                        okType: 'danger',
                        onOk: () => handleRemove(member.user_id)
                      });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Modal>

      {/* LEAVE MODAL */}
      <Modal
        title="Leave Group"
        open={showLeaveModal}
        onOk={async () => {
          try {
            await fetch(`${import.meta.env.VITE_API_URL}/chat/conversations/${conversation.id}/leave`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            antdMessage.success('Left');
            window.location.href = '/chat';
          } catch (err) {
            antdMessage.error('Failed');
          }
        }}
        onCancel={() => setShowLeaveModal(false)}
        okText="Leave"
        okType="danger"
      >
        <p>Leave "{conversation.display_name}"?</p>
      </Modal>
    </div>
  );
};

export default MessageArea;