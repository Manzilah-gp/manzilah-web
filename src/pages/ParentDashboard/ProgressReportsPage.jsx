// ============================================
// ProgressReportsPage - Parent Dashboard
// Overview of all children's progress and achievements
// Shows summary statistics and recent milestones
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Timeline, Progress, Spin, message, Button } from 'antd';
import { 
    UserOutlined, 
    BookOutlined, 
    TrophyOutlined, 
    ClockCircleOutlined,
    RightOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getChildrenProgressSummary } from '../../api/parentProgressApi';
import './ProgressReportsPage.css';

const ProgressReportsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        fetchSummary();
    }, []);

    /**
     * Fetch progress summary for all children
     */
    const fetchSummary = async () => {
        setLoading(true);
        try {
            const response = await getChildrenProgressSummary();
            if (response.data.success) {
                setSummary(response.data.data);
            }
        } catch (error) {
            message.error('Failed to load progress summary');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="progress-reports-page">
                <div className="loading-container">
                    <Spin size="large" tip="Loading progress reports..." />
                </div>
            </div>
        );
    }

    const { summary: stats, recentMilestones } = summary || {};

    /**
     * Get milestone icon based on type
     */
    const getMilestoneIcon = (type) => {
        if (type === 'graduation' || type === 'final_exam') {
            return '🎓';
        }
        if (type.includes('exam')) {
            return '📝';
        }
        return '✓';
    };

    return (
        <div className="progress-reports-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>📊 Progress Reports</h1>
                        <p>Overview of all your children's learning progress and achievements</p>
                    </div>
                    <Button 
                        type="primary" 
                        size="large"
                        icon={<UserOutlined />}
                        onClick={() => navigate('/parent/children')}
                    >
                        View All Children
                    </Button>
                </div>
            </div>

            {/* Summary Statistics */}
            <Row gutter={[24, 24]} className="stats-row">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card children-card">
                        <Statistic
                            title="Total Children"
                            value={stats?.total_children || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3b82f6' }}
                        />
                        <div className="stat-description">
                            Children in your account
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card enrollments-card">
                        <Statistic
                            title="Active Enrollments"
                            value={stats?.active_enrollments || 0}
                            prefix={<BookOutlined />}
                            valueStyle={{ color: '#10b981' }}
                        />
                        <div className="stat-description">
                            Currently enrolled courses
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card graduated-card">
                        <Statistic
                            title="Graduated"
                            value={stats?.graduated_count || 0}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: '#f59e0b' }}
                        />
                        <div className="stat-description">
                            Completed courses
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card progress-card">
                        <div className="progress-stat">
                            <span className="progress-stat-title">Average Progress</span>
                            <Progress
                                type="circle"
                                percent={Math.round(stats?.avg_progress || 0)}
                                strokeColor={{
                                    '0%': '#ef4444',
                                    '50%': '#f59e0b',
                                    '100%': '#10b981'
                                }}
                                width={100}
                                strokeWidth={8}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Recent Milestones Timeline */}
            <Card className="milestones-card" title={
                <div className="milestones-header">
                    <span>🏆 Recent Achievements</span>
                    <ClockCircleOutlined className="clock-icon" />
                </div>
            }>
                {recentMilestones && recentMilestones.length > 0 ? (
                    <Timeline
                        className="milestones-timeline"
                        items={recentMilestones.map(milestone => ({
                            color: milestone.score >= 90 ? 'green' : 'blue',
                            children: (
                                <div className="milestone-item">
                                    <div className="milestone-icon">
                                        {getMilestoneIcon(milestone.milestone_type)}
                                    </div>
                                    <div className="milestone-content">
                                        <div className="milestone-header">
                                            <strong className="child-name">{milestone.child_name}</strong>
                                            <span className="milestone-date">
                                                {dayjs(milestone.achieved_at).format('MMM D, YYYY')}
                                            </span>
                                        </div>
                                        <p className="milestone-course">{milestone.course_name}</p>
                                        <div className="milestone-details">
                                            <span className="milestone-type">
                                                {milestone.milestone_type.replace('_', ' ').toUpperCase()}
                                            </span>
                                            {milestone.score !== null && milestone.score !== undefined && (
                                                <span className={`milestone-score ${milestone.score >= 90 ? 'passed' : 'failed'}`}>
                                                    Score: {milestone.score}/100
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        }))}
                    />
                ) : (
                    <div className="no-milestones">
                        <TrophyOutlined className="empty-icon" />
                        <p>No recent achievements yet</p>
                        <p className="empty-subtitle">
                            Exam results and graduations will appear here
                        </p>
                    </div>
                )}
            </Card>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <Card 
                        className="action-card"
                        hoverable
                        onClick={() => navigate('/parent/children')}
                    >
                        <UserOutlined className="action-icon" />
                        <h4>View Children</h4>
                        <p>See all your children's profiles</p>
                        <RightOutlined className="arrow-icon" />
                    </Card>

                    <Card 
                        className="action-card"
                        hoverable
                        onClick={() => navigate('/parent/children-enrollments')}
                    >
                        <BookOutlined className="action-icon" />
                        <h4>All Enrollments</h4>
                        <p>View all course enrollments</p>
                        <RightOutlined className="arrow-icon" />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProgressReportsPage;