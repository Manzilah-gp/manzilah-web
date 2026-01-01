import React, { useState } from 'react';
import { Modal, Tabs, Input, List, Avatar, Button, Form, message } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const NewChatModal = ({ visible, onClose, onConversationCreated }) => {
  const [activeTab, setActiveTab] = useState('private');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [form] = Form.useForm();

  // Search users
  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/users/search?q=${query}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setSearchResults(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create private chat
  const handleCreatePrivate = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/conversations/private`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ other_user_id: userId })
        }
      );

      const data = await response.json();
      if (data.success) {
        message.success('Chat created!');
        onConversationCreated({ id: data.conversation_id });
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      message.error('Failed to create chat');
    }
  };

  // Create group chat
  const handleCreateGroup = async (values) => {
    if (selectedUsers.length === 0) {
      message.error('Please select at least one member');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/conversations/group`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: values.groupName,
            description: values.description,
            member_ids: selectedUsers
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        message.success('Group created!');
        onConversationCreated({ id: data.conversation_id });
        form.resetFields();
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      message.error('Failed to create group');
    }
  };

  // Tab items using new Ant Design 5 syntax
  const tabItems = [
    {
      key: 'private',
      label: 'Private Chat',
      children: (
        <div>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search users..."
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <List
            loading={loading}
            dataSource={searchResults}
            locale={{ emptyText: 'Type at least 2 characters to search users' }}
            renderItem={(user) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    onClick={() => handleCreatePrivate(user.id)}
                  >
                    Chat
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={user.full_name}
                  description={user.email}
                />
              </List.Item>
            )}
          />
        </div>
      )
    },
    {
      key: 'group',
      label: 'Group Chat',
      children: (
        <Form form={form} onFinish={handleCreateGroup} layout="vertical">
          <Form.Item
            name="groupName"
            label="Group Name"
            rules={[{ required: true, message: 'Please enter group name' }]}
          >
            <Input placeholder="Enter group name" />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Optional description" rows={3} />
          </Form.Item>

          <Form.Item label="Search Members">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search users to add..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Form.Item>

          <List
            loading={loading}
            dataSource={searchResults}
            locale={{ emptyText: 'Search for users to add to the group' }}
            style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}
            renderItem={(user) => (
              <List.Item
                actions={[
                  <Button
                    type={selectedUsers.includes(user.id) ? 'default' : 'primary'}
                    onClick={() => {
                      setSelectedUsers(prev =>
                        prev.includes(user.id)
                          ? prev.filter(id => id !== user.id)
                          : [...prev, user.id]
                      );
                    }}
                  >
                    {selectedUsers.includes(user.id) ? 'Remove' : 'Add'}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={user.full_name}
                  description={user.email}
                />
              </List.Item>
            )}
          />

          <Button
            type="primary"
            htmlType="submit"
            block
            disabled={selectedUsers.length === 0}
          >
            Create Group ({selectedUsers.length} member{selectedUsers.length !== 1 ? 's' : ''})
          </Button>
        </Form>
      )
    }
  ];

  return (
    <Modal
      title="New Chat"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={tabItems}
      />
    </Modal>
  );
};

export default NewChatModal;