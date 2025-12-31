import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainSideBar from '../components/MainSideBar/MainSideBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useAuth from '../hooks/useAuth';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  BankOutlined,
  HeartOutlined,
  HeartFilled,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Tag, Button, Spin, message, Input, Avatar, Card } from 'antd';
import '../Styles/EventDetails.css';
import DonationForm from '../components/Donation/DonationForm';
import DonationList from '../components/Donation/DonationList';
const { TextArea } = Input;

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setEvent(data.event);
      } else {
        message.error('Event not found');
        navigate('/events');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      message.error('Failed to load event');
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = event.user_liked ? 'DELETE' : 'POST';
      
      await fetch(`http://localhost:5000/api/events/${id}/like`, {
        method: endpoint,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      fetchEventDetails();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleRSVP = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/events/${id}/rsvp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      message.success(`RSVP updated: ${status}`);
      fetchEventDetails();
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  // Handle successful donations
  const handleDonationSuccess = (donationData) => {
    console.log('Donation successful:', donationData);
    
    // Close the modal
    setShowDonationModal(false);
    
    // Refresh event data to show updated totals
    fetchEventDetails();
    
    // Show success message
    message.success(`Thank you for your donation! Receipt #${donationData.receipt_number}`);
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      message.warning('Please enter a comment');
      return;
    }

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem('token');
      
      await fetch(`http://localhost:5000/api/events/${id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment: comment.trim() })
      });
      
      message.success('Comment added!');
      setComment('');
      fetchEventDetails();
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  if (loading) {
    return (
      <>
        <Header />
        <MainSideBar collapsed={sidebarCollapsed} onToggleCollapse={handleToggleSidebar} />
        <div className="main-content-wrapper">
          <div className="event-details-page">
            <div className="loading-container">
              <Spin size="large" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <>
      <Header />
      <MainSideBar collapsed={sidebarCollapsed} onToggleCollapse={handleToggleSidebar} />
      
      <div className="main-content-wrapper">
        <div className="event-details-page">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/events')}
            style={{ marginBottom: 20 }}
          >
            Back to Events
          </Button>

          <Card className="event-details-card">
            {/* Event Header */}
            <div className="event-details-header">
              <div>
                <Tag color={eventTypeColors[event.event_type]}>
                  {eventTypeLabels[event.event_type]}
                </Tag>
                <h1>{event.title}</h1>
                <div className="mosque-info">
                  <BankOutlined />
                  <span>{event.mosque_name}</span>
                </div>
              </div>
            </div>
            

            {/* Event Info */}
            <div className="event-info">
              <div className="info-item">
                <CalendarOutlined />
                <span>{formatDate(event.event_date)}</span>
              </div>
              {event.event_time && (
                <div className="info-item">
                  <ClockCircleOutlined />
                  <span>{event.event_time}</span>
                </div>
              )}
              {event.location && (
                <div className="info-item">
                  <EnvironmentOutlined />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="event-description">
              <h3>About This Event</h3>
              <p>{event.description}</p>
            </div>

            {/* Stats */}
            <div className="event-stats">
              <div className="stat-item">
                <HeartFilled style={{ color: '#ff4d4f' }} />
                <span>{event.likes_count || 0} Likes</span>
              </div>
              <div className="stat-item">
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <span>{event.rsvps?.going?.length || 0} Going</span>
              </div>
              <div className="stat-item">
                <QuestionCircleOutlined style={{ color: '#faad14' }} />
                <span>{event.rsvps?.maybe?.length || 0} Maybe</span>
              </div>
              <div className="stat-item">
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                <span>{event.rsvps?.not_going?.length || 0} Not Going</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="event-actions">
              <Button
                type={event.user_liked ? 'primary' : 'default'}
                danger={event.user_liked}
                icon={event.user_liked ? <HeartFilled /> : <HeartOutlined />}
                onClick={handleLike}
                size="large"
              >
                {event.user_liked ? 'Unlike' : 'Like'}
              </Button>

              <Button
                type={event.user_rsvp === 'going' ? 'primary' : 'default'}
                icon={<CheckCircleOutlined />}
                onClick={() => handleRSVP('going')}
                size="large"
              >
                Going
              </Button>

              <Button
                type={event.user_rsvp === 'maybe' ? 'primary' : 'default'}
                icon={<QuestionCircleOutlined />}
                onClick={() => handleRSVP('maybe')}
                size="large"
              >
                Maybe
              </Button>

              <Button
                type={event.user_rsvp === 'not_going' ? 'primary' : 'default'}
                danger={event.user_rsvp === 'not_going'}
                icon={<CloseCircleOutlined />}
                onClick={() => handleRSVP('not_going')}
                size="large"
              >
                Not Going
              </Button>
            </div>
          </Card>

          {/* ===================================================== */}
          {/* Fundraising Section (ONLY for fundraising events) */}
          {/* ===================================================== */}
          {event.event_type === 'fundraising' && (
            <Card className="fundraising-section" style={{ marginTop: 20 }}>
              {/* Fundraising Progress Card */}
              <div className="fundraising-card">
                <h2>Fundraising Goal</h2>
                
                {/* Progress Bar */}
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
//  OLD - Divides by 100
width: `${Math.min(((event.current_donations_cents || 0 /100) / (event.fundraising_goal_cents || 1)) * 100, 100)}%`                      }}
                    />
                  </div>
                  
                  {/* Progress Text */}
                  <div className="progress-info">
                    <span className="raised">
${((event.current_donations_cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} raised                    </span>
                    <span className="goal">
                      of ${((event.fundraising_goal_cents || 0) /100).toLocaleString('en-US', { minimumFractionDigits: 2 })} goal
                    </span>
                  </div>
                </div>

                {/* Donate Button */}
                <Button
                  type="primary"
                  size="large"
                  className="donate-button"
                  onClick={() => setShowDonationModal(true)}
                  disabled={event.status === 'completed'}
                  block
                  style={{ 
                    marginTop: 20,
                    height: 50,
                    fontSize: 18,
                    fontWeight: 600,
                    background: event.status === 'completed' 
                      ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none'
                  }}
                >
                  {event.status === 'completed' ? '🎉 Goal Reached!' : '💝 Donate Now'}
                </Button>
              </div>

              {/* Donations List Component */}
              <div style={{ marginTop: 30 }}>
                <DonationList 
                  eventId={event.id}
                  key={event.id}
                />
              </div>
            </Card>
          )}

          {/* ===================================================== */}
          {/* Donation Modal (ONLY for fundraising events) */}
          {/* ===================================================== */}
          {event.event_type === 'fundraising' && (
            <DonationForm
              visible={showDonationModal}
              event={event}
              onSuccess={handleDonationSuccess}
              onCancel={() => setShowDonationModal(false)}
            />
          )}

          {/* Comments Section */}
          <Card className="comments-section" title={`Comments (${event.comments_count || 0})`} style={{ marginTop: 20 }}>
            {/* Add Comment */}
            <div className="add-comment">
              <Avatar icon={<UserOutlined />} />
              <div className="comment-input-wrapper">
                <TextArea
                  rows={3}
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmitComment}
                  loading={submittingComment}
                  disabled={!comment.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="comments-list">
              {event.comments && event.comments.length > 0 ? (
                event.comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <Avatar icon={<UserOutlined />} />
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{c.user_name}</span>
                        <span className="comment-date">
                          {new Date(c.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="comment-text">{c.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EventDetailsPage;