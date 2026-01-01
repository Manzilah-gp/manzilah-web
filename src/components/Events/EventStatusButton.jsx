import React, { useState } from 'react';
import { Button, message, Modal, Tag } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const EventStatusButton = ({ event, onStatusChanged }) => {
  const [loading, setLoading] = useState(false);

  // Handle marking event as completed
  const handleMarkCompleted = () => {
    Modal.confirm({
      title: 'Mark Event as Completed',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to mark "${event.title}" as completed? This action will close the event.`,
      okText: 'Yes, Mark as Completed',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/events/${event.id}/complete`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const data = await response.json();

          if (data.success) {
            message.success('Event marked as completed successfully');
            onStatusChanged(); // Refresh the events list
          } else {
            message.error(data.message || 'Failed to mark event as completed');
          }
        } catch (error) {
          console.error('Error marking event as completed:', error);
          message.error('An error occurred');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Show different UI based on event status
  if (event.status === 'completed') {
    return (
      <Tag color="green" icon={<CheckCircleOutlined />} style={{ fontSize: '14px', padding: '4px 8px' }}>
        Completed
      </Tag>
    );
  }

  // For active/pending events, show the button
  return (
    <Button
      type="primary"
      icon={<CheckCircleOutlined />}
      onClick={handleMarkCompleted}
      loading={loading}
      style={{ 
        backgroundColor: '#52c41a', 
        borderColor: '#52c41a' 
      }}
    >
      Mark as Completed
    </Button>
  );
};

export default EventStatusButton;