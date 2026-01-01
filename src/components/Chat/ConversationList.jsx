import React from 'react';
import { List, Avatar, Badge, Button, Input, Empty, Spin } from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import './Chat.css';

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onNewChat,
  onlineUsers,
  loading
}) => {
  const [searchText, setSearchText] = React.useState('');

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv =>
    conv.display_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Check if user is online
  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="conversation-list">
      {/* Header */}
      <div className="conversation-header">
        <h2>Messages</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onNewChat}
        >
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="conversation-search">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search conversations..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : filteredConversations.length === 0 ? (
        <Empty description="No conversations yet" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type="primary" onClick={onNewChat}>Start a Conversation</Button>
        </Empty>
      ) : (
        <List
          dataSource={filteredConversations}
          renderItem={(conv) => (
            <List.Item
              className={`conversation-item ${
                selectedConversation?.id === conv.id ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conv)}
            >
              <List.Item.Meta
                avatar={
                  <Badge
                    dot
                    status={
                      conv.type === 'private' && isOnline(conv.display_id)
                        ? 'success'
                        : 'default'
                    }
                  >
                    <Avatar icon={<UserOutlined />}>
                      {conv.display_name?.[0]?.toUpperCase()}
                    </Avatar>
                  </Badge>
                }
                title={
                  <div className="conversation-title">
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.display_name}
                    </span>
                    {/* LARGE VISIBLE UNREAD BADGE */}
                    {conv.unread_count > 0 && (
                      <Badge 
                        count={conv.unread_count} 
                        style={{ 
                          backgroundColor: '#ff4d4f',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          minWidth: '22px',
                          height: '22px',
                          lineHeight: '22px',
                          boxShadow: '0 2px 8px rgba(255, 77, 79, 0.5)'
                        }}
                      />
                    )}
                  </div>
                }
                description={
                  <div className="conversation-preview">
                    <span className="last-message">
                      {conv.last_message || 'No messages yet'}
                    </span>
                    {conv.last_message_at && (
                      <span className="timestamp">
                        {formatDistanceToNow(new Date(conv.last_message_at), {
                          addSuffix: true
                        })}
                      </span>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ConversationList;