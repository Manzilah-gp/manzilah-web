/**
 * FINAL FIXED UserCalendar Component
 * 
 * Fixes:
 * 1. Navigation to event details (was causing logout)
 * 2. Timezone shifting dates by 1 day
 * 3. Proper mobile responsive design
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Tag, Spin, Empty } from "antd";
import { 
  CalendarOutlined, 
  EnvironmentOutlined,
  BankOutlined,
  CheckCircleOutlined 
} from "@ant-design/icons";
import "../Styles/Calender.css";

/**
 * UserCalendar Component
 * Displays events in a FullCalendar interface
 */
function UserCalendar({ 
  events = [], 
  loading = false,
  title = "Your Schedule",
  subtitle,
  onEventClick,
  showAttendingBadge = false,
  emptyMessage = "No events scheduled",
  height = "auto"
}) {
  const navigate = useNavigate();  // Use React Router navigate instead of window.location
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Debug logging when events change
  useEffect(() => {
    console.log('📅 Calendar Component - Events Updated:');
    console.log('  Events count:', events?.length || 0);
    
    if (events && events.length > 0) {
      console.log('  First event:');
      console.log('    Title:', events[0].title);
      console.log('    Start:', events[0].start);
      console.log('    AllDay:', events[0].allDay);
    }
  }, [events]);

  /**
   * Get color for event type
   */
  const getEventColor = (eventType) => {
    const colors = {
      religious: '#52c41a',
      educational: '#1890ff',
      social: '#722ed1',
      fundraising: '#fa8c16'
    };
    return colors[eventType] || '#1890ff';
  };

  /**
   * Get human-readable label for event type
   */
  const getEventTypeLabel = (eventType) => {
    const labels = {
      religious: 'Religious',
      educational: 'Educational',
      social: 'Social',
      fundraising: 'Fundraising'
    };
    return labels[eventType] || eventType;
  };

  /**
   * Handle event click in calendar
   */
  const handleEventClick = (info) => {
    console.log('🖱️ Event clicked:', info.event.title);
    
    const event = info.event;
    
    // If custom handler provided, use it
    if (onEventClick) {
      onEventClick({
        id: event.id,
        title: event.title,
        date: event.start,
        allDay: event.allDay,
        ...event.extendedProps
      });
      return;
    }

    // Default behavior: show modal
    const eventData = {
      id: event.id,
      title: event.title,
      date: event.start,
      allDay: event.allDay,
      ...event.extendedProps
    };
    
    console.log('📋 Opening modal with data:', eventData);
    setSelectedEvent(eventData);
    setDetailsModalVisible(true);
  };

  /**
   * Navigate to full event details page
   * FIXED: Use React Router navigate instead of window.location.href
   * This prevents the app from doing a full page reload which logs the user out
   */
  const handleViewFullDetails = () => {
    if (selectedEvent && selectedEvent.id) {
      console.log('🔗 Navigating to event:', selectedEvent.id);
      
      // Close modal first
      setDetailsModalVisible(false);
      
      // Use React Router navigation (keeps user logged in)
      navigate(`/events/${selectedEvent.id}`);
    }
  };

  /**
   * Format date and time for display
   * FIXED: Handle timezone properly to prevent date shifting
   */
  const formatDateTime = (date, time, allDay) => {
    // If date is a string (from extendedProps), use it directly
    let dateObj;
    
    if (typeof date === 'string') {
      // Parse without timezone conversion
      // If format is YYYY-MM-DD, treat as local date
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = date.split('-');
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    const dateStr = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (allDay) {
      return `${dateStr} (All Day)`;
    }
    
    return `${dateStr} at ${time || dateObj.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  return (
    <div className="calendar-section">
      {/* Calendar Header */}
      <div className="calendar-header">
        <h3 className="calendar-title">
          <CalendarOutlined /> {title}
        </h3>
        {subtitle && (
          <p className="calendar-subtitle">
            {subtitle}
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#8c8c8c' }}>Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="calendar-empty-state">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={emptyMessage}
          />
        </div>
      ) : (
        /* FullCalendar Component */
        <FullCalendar
          // Required plugins
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          
          // Initial view
          initialView="dayGridMonth"
          
          // Header toolbar configuration
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          
          // Pass events array
          events={events}
          
          // Event handlers
          eventClick={handleEventClick}
          
          // Calendar height
          height={height}
          
          // Time formatting
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
          
          // Disable editing
          editable={false}
          selectable={false}
          
          // Custom event rendering
          eventContent={(arg) => {
            return (
              <div className="calendar-event-content">
                <div className="event-time">{arg.timeText}</div>
                <div className="event-title">{arg.event.title}</div>
              </div>
            );
          }}
          
          // Additional display options
          dayMaxEvents={true}
          moreLinkText="more"
          navLinks={true}
          
          // Week/day view settings
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={true}
          
          // CRITICAL: Don't let FullCalendar do timezone conversions
          timeZone="local"
        />
      )}

      {/* Event Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarOutlined />
            <span>Event Details</span>
          </div>
        }
        open={detailsModalVisible}
        onCancel={() => {
          console.log('❌ Closing modal');
          setDetailsModalVisible(false);
        }}
        footer={[
          <button
            key="close"
            className="btn-secondary"
            onClick={() => setDetailsModalVisible(false)}
          >
            Close
          </button>,
          selectedEvent && selectedEvent.id && (
            <button
              key="details"
              className="btn-primary"
              onClick={handleViewFullDetails}
            >
              View Full Details
            </button>
          )
        ]}
        width={600}
      >
        {selectedEvent && (
          <div className="event-details-content">
            {/* Event Title */}
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>
              {selectedEvent.title}
            </h3>
            
            {/* Event Type Tag */}
            {selectedEvent.event_type && (
              <div style={{ marginBottom: 12 }}>
                <Tag color={getEventColor(selectedEvent.event_type)}>
                  {getEventTypeLabel(selectedEvent.event_type)}
                </Tag>
              </div>
            )}

            {/* Date & Time - Use event_date from extendedProps instead of date object */}
            <div className="event-detail-row">
              <CalendarOutlined style={{ color: '#1890ff' }} />
              <strong>Date & Time:</strong>
              <span>
                {formatDateTime(
                  selectedEvent.event_date || selectedEvent.date, 
                  selectedEvent.event_time, 
                  selectedEvent.allDay
                )}
              </span>
            </div>

            {/* Location */}
            {selectedEvent.location && (
              <div className="event-detail-row">
                <EnvironmentOutlined style={{ color: '#52c41a' }} />
                <strong>Location:</strong>
                <span>{selectedEvent.location}</span>
              </div>
            )}

            {/* Mosque Name */}
            {selectedEvent.mosque_name && (
              <div className="event-detail-row">
                <BankOutlined style={{ color: '#722ed1' }} />
                <strong>Mosque:</strong>
                <span>{selectedEvent.mosque_name}</span>
              </div>
            )}

            {/* Description */}
            {selectedEvent.description && (
              <div className="event-detail-row" style={{ 
                flexDirection: 'column', 
                alignItems: 'flex-start' 
              }}>
                <strong>Description:</strong>
                <p style={{ margin: '8px 0 0', color: '#595959' }}>
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* Attending Badge */}
            {showAttendingBadge && (
              <div style={{ 
                marginTop: 16, 
                padding: 12, 
                background: '#f6ffed', 
                borderRadius: 8,
                border: '1px solid #b7eb8f'
              }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <span style={{ color: '#52c41a', fontWeight: 500 }}>
                  You're attending this event
                </span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default UserCalendar;