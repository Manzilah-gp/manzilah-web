import React from 'react';
import {
  HeartOutlined,
  HeartFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  CommentOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  BankOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Tag, Button } from 'antd';
import './EventCard.css';
import './RejectionBanner.css';

// EventCard component with rejection notification and edit functionality
const EventCard = ({ event, onLike, onUnlike, onRSVP, onView, onViewInteractions, onEdit, isMosqueAdmin, isMyEvent }) => {
  const {
    id,
    title,
    description,
    event_date,
    event_time,
    location,
    event_type,
    mosque_name,
    likes_count,
    going_count,
    not_going_count,
    maybe_count,
    comments_count,
    user_liked,
    user_rsvp,
    approval_status,
    rejection_reason,
  } = event;

  const eventTypeColors = {
    religious: '#52c41a',
    educational: '#1890ff',
    social: '#722ed1',
    fundraising: '#fa8c16'
  };

  const eventTypeLabels = {
    religious: 'Religious',
    educational: 'Educational',
    social: 'Social',
    fundraising: 'Fundraising'
  };

  // Format date helper function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle like/unlike button click
  const handleLikeClick = () => {
    if (user_liked) {
      onUnlike(id);
    } else {
      onLike(id);
    }
  };

  // Handle RSVP button click
  const handleRSVPClick = (rsvpStatus) => {
    onRSVP(id, rsvpStatus);
  };

  return (
    <div className="event-card">
      
      {/* Rejection Banner - Shows only for rejected events */}
      {approval_status === 'rejected' && (
        <div className="rejection-banner">
          <div className="rejection-banner-header">
            <CloseCircleOutlined className="rejection-banner-icon" />
            <h4 className="rejection-banner-title">Event Rejected by Ministry</h4>
          </div>
          
          {rejection_reason && (
            <div className="rejection-reason-box">
              <div className="rejection-reason-label">
                <ExclamationCircleOutlined /> Reason for Rejection:
              </div>
              <p className="rejection-reason-text">
                {rejection_reason}
              </p>
            </div>
          )}
          
          <p className="rejection-help-text">
            💡 Please update your event according to the feedback above and resubmit for approval.
          </p>
          
          {/* Edit & Resubmit Button for rejected events */}
          {isMyEvent && (
            <Button
              type="primary"
              danger
              onClick={() => onEdit(event)}
              style={{ marginTop: '12px', width: '100%' }}
            >
              ✏️ Edit & Resubmit Event
            </Button>
          )}
        </div>
      )}

      {/* Pending Approval Notice - Shows for pending fundraising events */}
      {approval_status === 'pending' && event_type === 'fundraising' && (
        <div className="pending-banner">
          <div className="pending-banner-header">
            <ClockCircleOutlined className="pending-banner-icon" />
            <h4 className="pending-banner-title">Awaiting Ministry Approval</h4>
          </div>
          <p className="pending-help-text">
            ⏳ This fundraising event is pending approval from the ministry. You will be notified once reviewed.
          </p>
        </div>
      )}

      {/* Event Card Header */}
      <div className="event-card-header">
        <div className="event-type-badge">
          <Tag color={eventTypeColors[event_type]}>
            {eventTypeLabels[event_type]}
          </Tag>
        </div>
        <div className="event-mosque">
          <BankOutlined />
          <span>{mosque_name}</span>
        </div>
      </div>

      {/* Event Content */}
      <div className="event-card-content">
        <h3 className="event-title">{title}</h3>
        <p className="event-description">
          {description?.length > 150 
            ? `${description.substring(0, 150)}...` 
            : description}
        </p>

        <div className="event-details">
          <div className="event-detail-item">
            <CalendarOutlined className="detail-icon" />
            <span>{formatDate(event_date)}</span>
          </div>
          
          {event_time && (
            <div className="event-detail-item">
              <ClockCircleOutlined className="detail-icon" />
              <span>{event_time}</span>
            </div>
          )}
          
          {location && (
            <div className="event-detail-item">
              <EnvironmentOutlined className="detail-icon" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Event Stats */}
      <div className="event-stats">
        <div className="stat-item">
          {user_liked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
          <span>{likes_count || 0} Likes</span>
        </div>
        <div className="stat-item">
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <span>{going_count || 0} Going</span>
        </div>
        <div className="stat-item">
          <CommentOutlined />
          <span>{comments_count || 0} Comments</span>
        </div>
      </div>

      {/* Event Actions */}
      <div className="event-actions">
        <button
          className={`action-btn ${user_liked ? 'liked' : ''}`}
          onClick={handleLikeClick}
        >
          {user_liked ? <HeartFilled /> : <HeartOutlined />}
          <span>Like</span>
        </button>

        <button
          className={`action-btn ${user_rsvp === 'going' ? 'rsvp-going' : ''}`}
          onClick={() => handleRSVPClick('going')}
        >
          <CheckCircleOutlined />
          <span>Going</span>
        </button>

        <button
          className={`action-btn ${user_rsvp === 'maybe' ? 'rsvp-maybe' : ''}`}
          onClick={() => handleRSVPClick('maybe')}
        >
          <QuestionCircleOutlined />
          <span>Maybe</span>
        </button>

        <button
          className={`action-btn ${user_rsvp === 'not_going' ? 'rsvp-not-going' : ''}`}
          onClick={() => handleRSVPClick('not_going')}
        >
          <CloseCircleOutlined />
          <span>Not Going</span>
        </button>
      </div>

      {/* View Interactions Button - Only for mosque admin's own events */}
      {isMosqueAdmin && isMyEvent && (
        <Button
          type="default"
          icon={<TeamOutlined />}
          onClick={() => onViewInteractions(id)}
          className="view-interactions-btn"
          block
          style={{ 
            marginTop: '12px',
            marginBottom: '8px',
            marginLeft: '16px',
            marginRight: '16px',
            borderColor: '#1890ff',
            color: '#1890ff'
          }}
        >
          View Interactions & Attendees
        </Button>
      )}

      {/* View Details Button */}
      <Button
        type="link"
        onClick={() => onView(id)}
        className="view-details-btn"
      >
        View Details & Comments →
      </Button>
    </div>
  );
};

export default EventCard;