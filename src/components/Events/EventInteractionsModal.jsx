import React, { useState, useEffect } from 'react';
import { Modal, Tabs, List, Avatar, Spin, Empty, Alert } from 'antd';
import {
  HeartOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  CloseCircleOutlined,
  CommentOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import './EventInteractionsModal.css';

const { TabPane } = Tabs;

const EventInteractionsModal = ({ visible, onClose, eventId }) => {
  const [loading, setLoading] = useState(true);
  const [interactions, setInteractions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && eventId) {
      fetchInteractions();
    }
  }, [visible, eventId]);

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('Fetching interactions for event:', eventId);
      
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/interactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setInteractions(data.interactions);
        console.log('Interactions loaded:', data.interactions);
      } else {
        setError(data.message || 'Failed to load interactions');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      setError('Network error: ' + error.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Modal
        title="Event Interactions"
        visible={visible}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#999' }}>Loading interactions...</p>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        title="Event Interactions"
        visible={visible}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        <Alert 
          message="Error Loading Interactions" 
          description={error}
          type="error"
          showIcon
        />
      </Modal>
    );
  }

  if (!interactions) {
    return (
      <Modal
        title="Event Interactions"
        visible={visible}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        <Empty description="No interaction data available" />
      </Modal>
    );
  }

  return (
    <Modal
      title="Event Interactions"
      visible={visible}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="event-interactions-modal"
    >
      <Tabs defaultActiveKey="rsvps">
        {/* RSVPs Tab */}
        <TabPane
          tab={
            <span>
              <CheckCircleOutlined /> Attendance ({interactions?.rsvps?.total_count || 0})
            </span>
          }
          key="rsvps"
        >
          <Tabs type="card">
            <TabPane
              tab={
                <span>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} /> Going ({interactions?.rsvps?.going?.length || 0})
                </span>
              }
              key="going"
            >
              {interactions?.rsvps?.going && interactions.rsvps.going.length > 0 ? (
                <List
                  dataSource={interactions.rsvps.going}
                  renderItem={(item) => (
                    <List.Item className="user-item">
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={item.full_name || 'Unknown User'}
                        description={
                          <div className="user-contact">
                            {item.phone_number && (
                              <span><PhoneOutlined /> {item.phone_number}</span>
                            )}
                            {item.email && (
                              <span><MailOutlined /> {item.email}</span>
                            )}
                          </div>
                        }
                      />
                      <div className="interaction-date">{formatDate(item.created_at)}</div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No one confirmed yet" />
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <QuestionCircleOutlined style={{ color: '#faad14' }} /> Maybe ({interactions?.rsvps?.maybe?.length || 0})
                </span>
              }
              key="maybe"
            >
              {interactions?.rsvps?.maybe && interactions.rsvps.maybe.length > 0 ? (
                <List
                  dataSource={interactions.rsvps.maybe}
                  renderItem={(item) => (
                    <List.Item className="user-item">
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={item.full_name || 'Unknown User'}
                        description={
                          <div className="user-contact">
                            {item.phone_number && (
                              <span><PhoneOutlined /> {item.phone_number}</span>
                            )}
                            {item.email && (
                              <span><MailOutlined /> {item.email}</span>
                            )}
                          </div>
                        }
                      />
                      <div className="interaction-date">{formatDate(item.created_at)}</div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No maybes yet" />
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> Not Going ({interactions?.rsvps?.not_going?.length || 0})
                </span>
              }
              key="not_going"
            >
              {interactions?.rsvps?.not_going && interactions.rsvps.not_going.length > 0 ? (
                <List
                  dataSource={interactions.rsvps.not_going}
                  renderItem={(item) => (
                    <List.Item className="user-item">
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={item.full_name || 'Unknown User'}
                        description={
                          <div className="user-contact">
                            {item.phone_number && (
                              <span><PhoneOutlined /> {item.phone_number}</span>
                            )}
                            {item.email && (
                              <span><MailOutlined /> {item.email}</span>
                            )}
                          </div>
                        }
                      />
                      <div className="interaction-date">{formatDate(item.created_at)}</div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No one declined yet" />
              )}
            </TabPane>
          </Tabs>
        </TabPane>

        {/* Likes Tab */}
        <TabPane
          tab={
            <span>
              <HeartOutlined /> Likes ({interactions?.likes?.count || 0})
            </span>
          }
          key="likes"
        >
          {interactions?.likes?.users && interactions.likes.users.length > 0 ? (
            <List
              dataSource={interactions.likes.users}
              renderItem={(item) => (
                <List.Item className="user-item">
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.full_name || 'Unknown User'}
                    description={
                      <div className="user-contact">
                        {item.phone_number && (
                          <span><PhoneOutlined /> {item.phone_number}</span>
                        )}
                        {item.email && (
                          <span><MailOutlined /> {item.email}</span>
                        )}
                      </div>
                    }
                  />
                  <div className="interaction-date">{formatDate(item.created_at)}</div>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No likes yet" />
          )}
        </TabPane>

        {/* Comments Tab */}
        <TabPane
          tab={
            <span>
              <CommentOutlined /> Comments ({interactions?.comments?.count || 0})
            </span>
          }
          key="comments"
        >
          {interactions?.comments?.list && interactions.comments.list.length > 0 ? (
            <List
              dataSource={interactions.comments.list}
              renderItem={(item) => (
                <List.Item className="comment-item">
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <div className="comment-header">
                        <span className="commenter-name">{item.full_name || 'Unknown User'}</span>
                        <span className="comment-date">{formatDate(item.created_at)}</span>
                      </div>
                    }
                    description={
                      <>
                        <p className="comment-text">{item.comment}</p>
                        <div className="user-contact">
                          {item.phone_number && (
                            <span><PhoneOutlined /> {item.phone_number}</span>
                          )}
                          {item.email && (
                            <span><MailOutlined /> {item.email}</span>
                          )}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No comments yet" />
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default EventInteractionsModal;