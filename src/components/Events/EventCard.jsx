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
} from '@ant-design/icons';
import { Tag, Button } from 'antd';
import './EventCard.css';

const EventCard = ({ event, onLike, onUnlike, onRSVP, onView, onViewInteractions, isMosqueAdmin, isMyEvent }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLikeClick = () => {
    if (user_liked) {
      onUnlike(id);
    } else {
      onLike(id);
    }
  };

  const handleRSVPClick = (rsvpStatus) => {
    onRSVP(id, rsvpStatus);
  };

  return (
    <div className="event-card">
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