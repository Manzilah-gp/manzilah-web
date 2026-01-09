import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSideBar from '../components/MainSideBar/MainSideBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useAuth from '../hooks/useAuth';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  BankOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DollarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Button, Spin, message, Modal, Input, Tag, Empty, Tabs } from 'antd';
import '../Styles/FundraisingApprovals.css';

const { TextArea } = Input;

// Using Ant Design v5 items syntax (no more TabPane deprecation warning)
function FundraisingApprovalsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [rejectedEvents, setRejectedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const isMinistryAdmin = user?.roles?.includes('ministry_admin');

  useEffect(() => {
    if (!isMinistryAdmin) {
      message.error('Access denied. Ministry admin only.');
      navigate('/');
      return;
    }
    fetchFundraisingEvents();
  }, [isMinistryAdmin]);

  // Fetch all fundraising events
  const fetchFundraisingEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/events?event_type=fundraising', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      console.log('=== FUNDRAISING EVENTS RESPONSE ===');
      console.log('Success:', data.success);
      console.log('Total events:', data.events?.length);
      console.log('All events:', data.events);

      if (data.success) {
        const pending = data.events.filter(e => e.approval_status === 'pending');
        const approved = data.events.filter(e => e.approval_status === 'approved');
        const rejected = data.events.filter(e => e.approval_status === 'rejected');

        console.log('Pending events:', pending.length, pending);
        console.log('Approved events:', approved.length, approved);
        console.log('Rejected events:', rejected.length, rejected);

        setPendingEvents(pending);
        setApprovedEvents(approved);
        setRejectedEvents(rejected);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Failed to load fundraising events');
      setLoading(false);
    }
  };

  // Approve event
  const handleApprove = async (eventId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/events/${eventId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        message.success('Fundraising event approved successfully!');
        fetchFundraisingEvents();
      } else {
        message.error(data.message || 'Failed to approve event');
      }
    } catch (error) {
      console.error('Error approving event:', error);
      message.error('Failed to approve event');
    } finally {
      setActionLoading(false);
    }
  };

  // Open reject modal
  const openRejectModal = (event) => {
    setSelectedEvent(event);
    setRejectionReason('');
    setRejectModalVisible(true);
  };

  // Reject event with reason
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      message.warning('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/events/${selectedEvent.id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      const data = await response.json();

      if (data.success) {
        message.success('Fundraising event rejected');
        setRejectModalVisible(false);
        setSelectedEvent(null);
        setRejectionReason('');
        fetchFundraisingEvents();
      } else {
        message.error(data.message || 'Failed to reject event');
      }
    } catch (error) {
      console.error('Error rejecting event:', error);
      message.error('Failed to reject event');
    } finally {
      setActionLoading(false);
    }
  };

  // Open view details modal
  const openViewModal = (event) => {
    setSelectedEvent(event);
    setViewModalVisible(true);
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  // Render event card component
  const renderEventCard = (event, showActions = false) => (
    <Card key={event.id} className="fundraising-event-card">
      <div className="event-header">
        <div>
          <Tag color="orange" icon={<DollarOutlined />}>
            Fundraising
          </Tag>
          {event.approval_status === 'approved' && (
            <Tag color="green" icon={<CheckCircleOutlined />}>Approved</Tag>
          )}
          {event.approval_status === 'rejected' && (
            <Tag color="red" icon={<CloseCircleOutlined />}>Rejected</Tag>
          )}
          {event.approval_status === 'pending' && (
            <Tag color="gold">Pending Approval</Tag>
          )}
        </div>
      </div>

      <h3 className="event-title">{event.title}</h3>

      <div className="event-info">
        <div className="info-row">
          <BankOutlined />
          <span>{event.mosque_name}</span>
        </div>
        <div className="info-row">
          <UserOutlined />
          <span>Created by: {event.creator_name}</span>
        </div>
        <div className="info-row">
          <CalendarOutlined />
          <span>{formatDate(event.event_date)}</span>
        </div>
        {event.event_time && (
          <div className="info-row">
            <ClockCircleOutlined />
            <span>{event.event_time}</span>
          </div>
        )}
        {event.location && (
          <div className="info-row">
            <EnvironmentOutlined />
            <span>{event.location}</span>
          </div>
        )}
      </div>

      <p className="event-description">
        {event.description?.length > 150
          ? `${event.description.substring(0, 150)}...`
          : event.description}
      </p>

      {event.rejection_reason && (
        <div className="rejection-reason">
          <strong>Rejection Reason:</strong>
          <p>{event.rejection_reason}</p>
        </div>
      )}

      <div className="event-actions">
        <Button
          icon={<EyeOutlined />}
          onClick={() => openViewModal(event)}
        >
          View Details
        </Button>

        {showActions && event.approval_status === 'pending' && (
          <>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApprove(event.id)}
              loading={actionLoading}
            >
              Approve
            </Button>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => openRejectModal(event)}
              loading={actionLoading}
            >
              Reject
            </Button>
          </>
        )}
      </div>
    </Card>
  );

  // Loading state
  if (loading) {
    return (
      <>
        <div className="events-page">
          <div className="loading-container">
            <Spin size="large" />
          </div>
        </div>
      </>
    );
  }

  // Define tabs items for Ant Design v5
  const tabItems = [
    {
      key: 'pending',
      label: (
        <span>
          <ClockCircleOutlined />
          Pending ({pendingEvents.length})
        </span>
      ),
      children: pendingEvents.length > 0 ? (
        <div className="events-grid">
          {pendingEvents.map(event => renderEventCard(event, true))}
        </div>
      ) : (
        <Empty
          description="No pending fundraising events"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ),
    },
    {
      key: 'approved',
      label: (
        <span>
          <CheckCircleOutlined />
          Approved ({approvedEvents.length})
        </span>
      ),
      children: approvedEvents.length > 0 ? (
        <div className="events-grid">
          {approvedEvents.map(event => renderEventCard(event, false))}
        </div>
      ) : (
        <Empty
          description="No approved fundraising events"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ),
    },
    {
      key: 'rejected',
      label: (
        <span>
          <CloseCircleOutlined />
          Rejected ({rejectedEvents.length})
        </span>
      ),
      children: rejectedEvents.length > 0 ? (
        <div className="events-grid">
          {rejectedEvents.map(event => renderEventCard(event, false))}
        </div>
      ) : (
        <Empty
          description="No rejected fundraising events"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ),
    },
  ];

  return (
    <>
      <div className="fundraising-approvals-page">
        <div className="page-header">
          <div className="title-section">
            <DollarOutlined className="page-icon" />
            <h1>Fundraising Events Approval</h1>
          </div>
          <p className="subtitle">Review and approve fundraising events from mosques</p>
        </div>

        {/* Ant Design v5 Tabs with items prop */}
        <Tabs
          defaultActiveKey="pending"
          className="approval-tabs"
          items={tabItems}
        />
      </div>


      {/* View Details Modal */}
      <Modal
        title="Event Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedEvent(null);
        }}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          selectedEvent?.approval_status === 'pending' && (
            <Button
              key="approve"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                handleApprove(selectedEvent.id);
                setViewModalVisible(false);
              }}
            >
              Approve
            </Button>
          ),
          selectedEvent?.approval_status === 'pending' && (
            <Button
              key="reject"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setViewModalVisible(false);
                openRejectModal(selectedEvent);
              }}
            >
              Reject
            </Button>
          ),
        ]}
        width={700}
      >
        {selectedEvent && (
          <div className="event-details-modal">
            <div className="detail-row">
              <strong>Title:</strong>
              <span>{selectedEvent.title}</span>
            </div>
            <div className="detail-row">
              <strong>Mosque:</strong>
              <span>{selectedEvent.mosque_name}</span>
            </div>
            <div className="detail-row">
              <strong>Created By:</strong>
              <span>{selectedEvent.creator_name}</span>
            </div>
            <div className="detail-row">
              <strong>Date:</strong>
              <span>{formatDate(selectedEvent.event_date)}</span>
            </div>
            {selectedEvent.event_time && (
              <div className="detail-row">
                <strong>Time:</strong>
                <span>{selectedEvent.event_time}</span>
              </div>
            )}
            {selectedEvent.location && (
              <div className="detail-row">
                <strong>Location:</strong>
                <span>{selectedEvent.location}</span>
              </div>
            )}
            <div className="detail-row">
              <strong>Status:</strong>
              <span>
                {selectedEvent.approval_status === 'pending' && <Tag color="gold">Pending</Tag>}
                {selectedEvent.approval_status === 'approved' && <Tag color="green">Approved</Tag>}
                {selectedEvent.approval_status === 'rejected' && <Tag color="red">Rejected</Tag>}
              </span>
            </div>
            <div className="detail-row full-width">
              <strong>Description:</strong>
              <p>{selectedEvent.description}</p>
            </div>
            {selectedEvent.rejection_reason && (
              <div className="detail-row full-width">
                <strong>Rejection Reason:</strong>
                <p style={{ color: '#ff4d4f' }}>{selectedEvent.rejection_reason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Reject Fundraising Event"
        open={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          setSelectedEvent(null);
          setRejectionReason('');
        }}
        onOk={handleReject}
        okText="Reject Event"
        okButtonProps={{ danger: true, loading: actionLoading }}
        cancelButtonProps={{ disabled: actionLoading }}
      >
        <p><strong>Event:</strong> {selectedEvent?.title}</p>
        <p><strong>Mosque:</strong> {selectedEvent?.mosque_name}</p>
        <div style={{ marginTop: 16 }}>
          <label><strong>Reason for Rejection:</strong></label>
          <TextArea
            rows={4}
            placeholder="Please provide a reason for rejecting this fundraising event..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            style={{ marginTop: 8 }}
          />
        </div>
      </Modal>
    </>
  );
}

export default FundraisingApprovalsPage;