// =====================================================
// AdminEventManagement.jsx - Component for mosque admin to manage events
// Shows in admin's profile/dashboard
// Includes fundraising goal management for fundraising events
// FIXED: Proper button spacing with flexbox
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Tag,
  message,
  Space,
  Spin,
  Modal,
  Popconfirm,
  Empty
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import ManageFundraisingGoal from '../Donation/ManageFundraisingGoal';
import './AdminEventManagement.css';
import EventStatusButton from '../Events/EventStatusButton';

const AdminEventManagement = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all events for this mosque admin
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/my-mosque-events`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setEvents(data.events || []);
      } else {
        message.error('Failed to load events');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Failed to load events');
      setLoading(false);
    }
  };

  // Handle manage fundraising goal button click
  const handleManageGoal = (event) => {
    setSelectedEvent(event);
    setShowGoalModal(true);
  };

  // Handle successful goal update
  const handleGoalUpdateSuccess = () => {
    setShowGoalModal(false);
    setSelectedEvent(null);
    fetchEvents(); // Refresh events list
    message.success('Fundraising goal updated successfully!');
  };

  // Handle view event details
  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Handle edit event
  const handleEditEvent = (eventId) => {
    navigate(`/events/edit/${eventId}`);
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        message.success('Event deleted successfully');
        fetchEvents(); // Refresh list
      } else {
        message.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      message.error('Failed to delete event');
    }
  };

  // Handle create new event
  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Event type colors
  const eventTypeColors = {
    religious: '#52c41a',
    educational: '#1890ff',
    social: '#722ed1',
    fundraising: '#fa8c16'
  };

  // Event type labels
  const eventTypeLabels = {
    religious: 'Religious',
    educational: 'Educational',
    social: 'Social',
    fundraising: 'Fundraising'
  };

  // Status colors
  const statusColors = {
    upcoming: 'blue',
    ongoing: 'green',
    completed: 'default',
    cancelled: 'red'
  };

  if (loading) {
    return (
      <div className="admin-events-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="admin-event-management">
      {/* Header with Create Button */}
      <div className="admin-events-header">
        <div>
          <h2>Manage Events</h2>
          <p>Create and manage events for your mosque</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreateEvent}
        >
          Create New Event
        </Button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <Card>
          <Empty
            description="No events yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateEvent}>
              Create Your First Event
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="admin-events-grid">
          {events.map((event) => (
            <Card
              key={event.id}
              className="admin-event-card"
              hoverable
            >
              {/* Event Header */}
              <div className="admin-event-header">
                <div className="event-header-left">
                  <Tag color={eventTypeColors[event.event_type]}>
                    {eventTypeLabels[event.event_type]}
                  </Tag>
                  <Tag color={statusColors[event.status]}>
                    {event.status}
                  </Tag>
                </div>
              </div>

              {/* Event Title */}
              <h3 className="admin-event-title">{event.title}</h3>

              {/* Event Info */}
              <div className="admin-event-info">
                <div className="info-row">
                  <CalendarOutlined />
                  <span>{formatDate(event.event_date)}</span>
                </div>
                {event.location && (
                  <div className="info-row">
                    <EnvironmentOutlined />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="info-row">
                  <TeamOutlined />
                  <span>{event.rsvp_count || 0} RSVPs</span>
                </div>
              </div>

              {/* ===================================================== */}
              {/* Fundraising Info (ONLY for fundraising events) */}
              {/* ===================================================== */}
              {event.event_type === 'fundraising' && (
                <div className="fundraising-info">
                  <div className="fundraising-header">
                    <DollarOutlined />
                    <span>Fundraising Progress</span>
                  </div>
                  <div className="fundraising-amounts">
                    <span className="raised-amount">
                      ${(event.current_donations_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })} raised
                    </span>
                    <span className="goal-amount">
                      of ${(event.fundraising_goal_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </span>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="mini-progress-bar">
                    <div
                      className="mini-progress-fill"
                      style={{
                        width: `${Math.min((event.current_donations_cents / event.fundraising_goal_cents) * 100, 100)}%`
                      }}
                    />
                  </div>

                  {/* Progress Percentage */}
                  <div className="progress-percentage">
                    {Math.round((event.current_donations_cents / event.fundraising_goal_cents) * 100) || 0}% complete
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* Event Actions - FIXED with proper spacing */}
              {/* ===================================================== */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '16px'
              }}>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => handleViewEvent(event.id)}
                >
                  View
                </Button>

                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditEvent(event.id)}
                >
                  Edit
                </Button>

                {/* Manage Goal Button (ONLY for fundraising events) */}
                {event.event_type === 'fundraising' && (
                  <Button
                    type="primary"
                    icon={<DollarOutlined />}
                    onClick={() => handleManageGoal(event)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none'
                    }}
                  >
                    Manage Goal
                  </Button>
                )}

                {/* Mark as Completed Button */}
                <EventStatusButton
                  event={event}
                  onStatusChanged={() => fetchEvents()}
                />

                {/* Delete Button */}
                <Popconfirm
                  title="Delete this event?"
                  description="This action cannot be undone."
                  onConfirm={() => handleDeleteEvent(event.id)}
                  okText="Yes, Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ===================================================== */}
      {/* Fundraising Goal Management Modal */}
      {/* ===================================================== */}
      {showGoalModal && selectedEvent && (
        <ManageFundraisingGoal
          visible={showGoalModal}
          event={selectedEvent}
          onClose={() => {
            setShowGoalModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={handleGoalUpdateSuccess}
        />
      )}
    </div>
  );
};

export default AdminEventManagement;


