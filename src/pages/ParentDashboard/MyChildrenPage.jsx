
// Shows list of all parent's children with enrollment summary
// Similar to AllStudentsPage but for parent's children only

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Progress, Tag, Spin, message } from 'antd';
import { SearchOutlined, UserOutlined, BookOutlined, TrophyOutlined } from '@ant-design/icons';
import { getMyChildren } from '../../api/parentProgressApi';
import './MyChildrenPage.css';

const MyChildrenPage = () => {
    const navigate = useNavigate();
    const [children, setChildren] = useState([]);
    const [filteredChildren, setFilteredChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        // Filter children based on search
        if (searchTerm.trim() === '') {
            setFilteredChildren(children);
        } else {
            const filtered = children.filter(child =>
                child.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                child.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredChildren(filtered);
        }
    }, [searchTerm, children]);

    const fetchChildren = async () => {
        setLoading(true);
        try {
            const response = await getMyChildren();
            if (response.data.success) {
                setChildren(response.data.data);
                setFilteredChildren(response.data.data);
            }
        } catch (error) {
            message.error('Failed to load children');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewChild = (childId) => {
        navigate(`/parent/children/${childId}`);
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 50) return '#f59e0b';
        return '#ef4444';
    };

    if (loading) {
        return (
            <div className="my-children-page">
                <div className="loading-container">
                    <Spin size="large" tip="Loading your children..." />
                </div>
            </div>
        );
    }

    return (
        <div className="my-children-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="header-content">
                    <UserOutlined className="header-icon" />
                    <div className="header-text">
                        <h1>My Children</h1>
                        <p>Track your children's learning progress and achievements</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-section">
                <Input
                    placeholder="Search by name or email..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="large"
                    className="search-input"
                />
                <div className="result-count">
                    <span>{filteredChildren.length} of {children.length} children</span>
                </div>
            </div>

            {/* Children Grid */}
            {filteredChildren.length === 0 ? (
                <div className="empty-state">
                    <UserOutlined className="empty-icon" />
                    <p className="empty-message">
                        {children.length === 0 ? 'No children found' : 'No matching children'}
                    </p>
                </div>
            ) : (
                <div className="children-grid">
                    {filteredChildren.map(child => (
                        <div key={child.child_id} className="child-card">
                            {/* Child Avatar & Name */}
                            <div className="child-header">
                                <div className="child-avatar">
                                    {child.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="child-info">
                                    <h3 className="child-name">{child.full_name}</h3>
                                    <p className="child-age">{child.age} years old</p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="contact-section">
                                <p className="contact-item">{child.email}</p>
                                {child.phone && <p className="contact-item">{child.phone}</p>}
                            </div>

                            {/* Enrollment Stats */}
                            <div className="stats-sectionn">
                                <div className="stat-item">
                                    <BookOutlined className="stat-icon active" />
                                    <div className="stat-content">
                                        <span className="stat-value">{child.active_enrollments}</span>
                                        <span className="stat-label">Active Courses</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <TrophyOutlined className="stat-icon completed" />
                                    <div className="stat-content">
                                        <span className="stat-value">{child.completed_enrollments}</span>
                                        <span className="stat-label">Completed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Average Progress */}
                            <div className="progress-section">
                                <div className="progress-header">
                                    <span className="progress-label">Average Progress</span>
                                    <span
                                        className="progress-percentage"
                                        style={{ color: getProgressColor(Math.round(child.avg_progress || 0)) }}
                                    >
                                        {Math.round(child.avg_progress || 0)}%
                                    </span>
                                </div>
                                <Progress
                                    percent={Math.round(child.avg_progress || 0)}
                                    strokeColor={getProgressColor(Math.round(child.avg_progress || 0))}
                                    showInfo={false}
                                    strokeWidth={10}
                                />
                            </div>

                            {/* View Details Button */}
                            <Button
                                type="primary"
                                block
                                size="large"
                                className="view-button"
                                onClick={() => handleViewChild(child.child_id)}
                            >
                                View Details
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyChildrenPage;