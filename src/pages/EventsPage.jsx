import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSideBar from '../components/MainSideBar/MainSideBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/Events/EventCard';
import CreateEventModal from '../components/Events/CreateEventModal';
import EventInteractionsModal from '../components/Events/EventInteractionsModal';
import useAuth from '../hooks/useAuth';
import {
  PlusOutlined,
  CalendarOutlined,
  FilterOutlined,
  GlobalOutlined,
  BankOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { message, Select, Button, Spin, Radio } from 'antd';
import '../Styles/Events.css';
import EditEventModal from '../components/Events/EditEventModal';

const { Option } = Select;

function EventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [interactionsModalVisible, setInteractionsModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  const [filterType, setFilterType] = useState('all');
  const [filterScope, setFilterScope] = useState('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
  
  // Check user roles
  const isMosqueAdmin = user?.roles?.includes('mosque_admin');
  const isMinistryAdmin = user?.roles?.includes('ministry_admin');

  useEffect(() => {
    fetchEvents();
  }, [filterType, filterScope]);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/events';
      
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('event_type', filterType);
      if (filterScope !== 'all') params.append('filter', filterScope);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Failed to load events');
      setLoading(false);
    }
  };

  // Handle create event button click
  const handleCreateEvent = () => {
    setCreateModalVisible(true);
  };

  // Handle event created successfully
  const handleEventCreated = () => {
    setCreateModalVisible(false);
    fetchEvents();
    message.success('Event created successfully!');
  };

  // Handle like event
  const handleLike = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/events/${eventId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error liking event:', error);
    }
  };

  // Handle unlike event
  const handleUnlike = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/events/${eventId}/like`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error unliking event:', error);
    }
  };

  // Handle RSVP to event
  const handleRSVP = async (eventId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      fetchEvents();
      message.success(`RSVP updated: ${status}`);
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  // Handle view interactions button click
  const handleViewInteractions = (eventId) => {
    setSelectedEventId(eventId);
    setInteractionsModalVisible(true);
  };

  // Handle view event details
  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Toggle sidebar collapsed state
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle edit event button click
const handleEditEvent = (event) => {
  console.log('Edit event:', event);
  setSelectedEventForEdit(event);
  setEditModalVisible(true);
};

// Handle event updated successfully
const handleEventUpdated = () => {
  setEditModalVisible(false);
  setSelectedEventForEdit(null);
  fetchEvents();
  message.success('Event updated and resubmitted for approval!');
};

  // Check if event belongs to current user
  const isMyEvent = (event) => {
    return event.created_by === user?.id;
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <MainSideBar collapsed={sidebarCollapsed} onToggleCollapse={handleToggleSidebar} />
        <div className="main-content-wrapper">
          <div className="events-page">
            <div className="loading-container">
              <Spin size="large" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <MainSideBar collapsed={sidebarCollapsed} onToggleCollapse={handleToggleSidebar} />
      
      <div className="main-content-wrapper">
        <div className="events-page">
          {/* Page Header */}
          <div className="events-header">
            <div className="events-title-section">
              <CalendarOutlined className="page-icon" />
              <h1>Events & Activities</h1>
            </div>
            
            <div className="header-buttons">
              {/* Mosque Admin - Create Event Button */}
              {isMosqueAdmin && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateEvent}
                  size="large"
                >
                  Create New Event
                </Button>
              )}

              {/* Ministry Admin - Review Fundraising Button */}
              {isMinistryAdmin && (
                <Button
                  icon={<DollarOutlined />}
                  onClick={() => navigate('/fundraising-approvals')}
                  size="large"
                  style={{
                    background: '#fff7e6',
                    borderColor: '#ffa940',
                    color: '#fa8c16',
                    fontWeight: 500,
                    marginLeft: isMosqueAdmin ? 12 : 0
                  }}
                >
                  Review Fundraising Events
                </Button>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div className="events-filters">
            {isMosqueAdmin && (
              <div className="filter-item scope-filter">
                <FilterOutlined className="filter-icon" />
                <span>Show:</span>
                <Radio.Group 
                  value={filterScope} 
                  onChange={(e) => setFilterScope(e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button value="all">
                    <GlobalOutlined /> All Events
                  </Radio.Button>
                  <Radio.Button value="my_mosque">
                    <BankOutlined /> My Mosque Events
                  </Radio.Button>
                </Radio.Group>
              </div>
            )}

            <div className="filter-item">
              <FilterOutlined className="filter-icon" />
              <span>Event Type:</span>
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: 200 }}
              >
                <Option value="all">All</Option>
                <Option value="religious">Religious</Option>
                <Option value="educational">Educational</Option>
                <Option value="social">Social</Option>
                <Option value="fundraising">Fundraising</Option>
              </Select>
            </div>
          </div>

          {/* Filter Info */}
          {isMosqueAdmin && filterScope === 'my_mosque' && (
            <div className="filter-info">
              <p>
                <BankOutlined /> Showing events from your mosque only
              </p>
            </div>
          )
          }

          {/* Events Grid */}
          <div className="events-grid">
            {events.length > 0 ? (
         events.map(event => (
  <EventCard
    key={event.id}
    event={event}
    onLike={handleLike}
    onUnlike={handleUnlike}
    onRSVP={handleRSVP}
    onView={handleViewEvent}
    onViewInteractions={handleViewInteractions}
    onEdit={handleEditEvent}  // ← ADD THIS LINE
    isMosqueAdmin={isMosqueAdmin}
    isMyEvent={isMyEvent(event)}
  />
))
            ) : (
              <div className="no-events">
                <CalendarOutlined style={{ fontSize: 64, color: '#ccc' }} />
                <p>No events available at the moment</p>
                {filterScope !== 'all' && (
                  <Button 
                    type="link" 
                    onClick={() => setFilterScope('all')}
                  >
                    Show all events
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {createModalVisible && (
        <CreateEventModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onSuccess={handleEventCreated}
        />
      )}

      {/* Event Interactions Modal */}
      {interactionsModalVisible && (
        <EventInteractionsModal
          visible={interactionsModalVisible}
          onClose={() => {
            setInteractionsModalVisible(false);
            setSelectedEventId(null);
          }}
          eventId={selectedEventId}
        />
      )}
{/* Edit Event Modal */}
{editModalVisible && (
  <EditEventModal
    visible={editModalVisible}
    onClose={() => {
      setEditModalVisible(false);
      setSelectedEventForEdit(null);
    }}
    onSuccess={handleEventUpdated}
    event={selectedEventForEdit}
  />
)}
      <Footer />
    </>
  );
}

export default EventsPage;