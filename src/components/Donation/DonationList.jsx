// =====================================================
/*
Statistics card (total, average, count)
List of donations with donor names
Anonymous donor handling
Formatted dates and amounts
*/
// =====================================================

import React, { useState, useEffect } from 'react';
import { List, Avatar, Card, Empty, Spin, message, Tag } from 'antd';
import { HeartFilled, UserOutlined } from '@ant-design/icons';
import './DonationList.css';

const DonationList = ({ eventId }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Fetch donations when component mounts
  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, [eventId]);

  // Fetch all donations for this event
  const fetchDonations = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/donations/event/${eventId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setDonations(data.donations);
      } else {
        message.error('Failed to load donations');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      message.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch donation statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/donations/event/${eventId}/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="donation-list-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="donation-list-container">
      {/* Statistics Card */}
      {stats && donations.length > 0 && (
        <Card className="donation-stats" bordered={false}>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.total_donations}</div>
              <div className="stat-label">Total Donations</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                ${(stats.total_amount_cents / 100).toFixed(2)}
              </div>
              <div className="stat-label">Total Raised</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                ${(stats.average_amount_cents / 100).toFixed(2)}
              </div>
              <div className="stat-label">Average Donation</div>
            </div>
          </div>
        </Card>
      )}

      {/* Donations List */}
      <Card 
        title={
          <div className="list-header">
            <HeartFilled style={{ color: '#ff4d4f', marginRight: 8 }} />
            Recent Donations
          </div>
        }
        bordered={false}
        className="donations-card"
      >
        {donations.length === 0 ? (
          <Empty 
            description="No donations yet" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={donations}
            renderItem={(donation) => (
              <List.Item className="donation-item">
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={<UserOutlined />} 
                      style={{ 
                        backgroundColor: donation.is_anonymous ? '#999' : '#1890ff' 
                      }}
                    >
                      {!donation.is_anonymous && donation.full_name?.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <div className="donor-info">
                      <span className="donor-name">
                        {donation.is_anonymous 
                          ? 'Anonymous Donor' 
                          : `${donation.full_name} `
                        }
                      </span>
                      <Tag color="green" className="amount-tag">
                        ${(donation.amount_cents / 100).toFixed(2)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="donation-details">
                      {donation.donor_message && (
                        <div className="donor-message">
                          "{donation.donor_message}"
                        </div>
                      )}
                      <div className="donation-date">
                        {formatDate(donation.created_at)}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default DonationList;