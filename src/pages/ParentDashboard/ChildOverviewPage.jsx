// ============================================
// ChildOverviewPage - Parent View
// Detailed overview of one child with all their courses
// Shows child info and all enrollments
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Progress, Tag, Spin, message, Empty } from 'antd';
import { 
    ArrowLeftOutlined, 
    BookOutlined, 
    TrophyOutlined,
    CalendarOutlined,
    UserOutlined 
} from '@ant-design/icons';
import { getChildOverview } from '../../api/parentProgressApi';
import './ChildOverviewPage.css';

const ChildOverviewPage = () => {
    const { childId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [childData, setChildData] = useState(null);

    useEffect(() => {
        fetchChildOverview();
    }, [childId]);

    /**
     * Fetch complete overview for this child
     */
    const fetchChildOverview = async () => {
        setLoading(true);
        try {
            const response = await getChildOverview(childId);
            if (response.data.success) {
                setChildData(response.data.data);
            }
        } catch (error) {
            if (error.response?.status === 403) {
                message.error('You do not have access to this child');
                navigate('/parent/children');
            } else {
                message.error('Failed to load child overview');
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Navigate to course progress view
     */
    const handleViewProgress = (enrollmentId) => {
        navigate(`/parent/progress/${enrollmentId}`);
    };

    /**
     * Get color for progress based on percentage
     */
    const getProgressColor = (percentage) => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 50) return '#f59e0b';
        return '#ef4444';
    };

    /**
     * Get status color for enrollment
     */
    const getStatusColor = (status) => {
        const colors = {
            active: 'success',
            completed: 'blue',
            dropped: 'error',
            pending: 'warning'
        };
        return colors[status] || 'default';
    };

    if (loading) {
        return (
            <div className="child-overview-page">
                <div className="loading-container">
                    <Spin size="large" tip="Loading child overview..." />
                </div>
            </div>
        );
    }

    if (!childData || !childData.child) {
        return (
            <div className="child-overview-page">
                <Empty description="Child not found" />
            </div>
        );
    }

    const { child, enrollments } = childData;

    return (
        <div className="child-overview-page">
            {/* Page Header */}
            <div className="page-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/parent/children')}
                    size="large"
                >
                    Back to Children
                </Button>
            </div>

            {/* Child Information Card */}
            <Card className="child-info-card">
                <div className="child-profile">
                    <div className="child-avatar-large">
                        {child.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="child-details">
                        <h1 className="child-name">{child.full_name}</h1>
                        <div className="child-meta">
                            <span className="meta-item">
                                <UserOutlined /> {child.age} years old
                            </span>
                            <span className="meta-item">
                                <CalendarOutlined /> Born {new Date(child.dob).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="contact-info">
                            <p>{child.email}</p>
                            {child.phone && <p>{child.phone}</p>}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Enrollments Section */}
            <div className="section-header">
                <h2>
                    <BookOutlined /> Course Enrollments
                </h2>
                <p className="section-subtitle">
                    {enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled
                </p>
            </div>

            {enrollments.length === 0 ? (
                <Card className="empty-enrollments">
                    <Empty 
                        description="No course enrollments yet"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            ) : (
                <Row gutter={[24, 24]} className="enrollments-grid">
                    {enrollments.map(enrollment => (
                        <Col xs={24} md={12} lg={8} key={enrollment.enrollment_id}>
                            <Card className="enrollment-card">
                                {/* Course Header */}
                                <div className="course-header">
                                    <h3 className="course-name">{enrollment.course_name}</h3>
                                    <Tag color={getStatusColor(enrollment.status)}>
                                        {enrollment.status.toUpperCase()}
                                    </Tag>
                                </div>

                                {/* Course Type Badge */}
                                <div className="course-type">
                                    <span className="type-badge">
                                        {enrollment.course_type}
                                    </span>
                                </div>

                                {/* Teacher & Mosque Info */}
                                <div className="course-info">
                                    {enrollment.teacher_name && (
                                        <p className="info-line">
                                            <strong>Teacher:</strong> {enrollment.teacher_name}
                                        </p>
                                    )}
                                    {enrollment.mosque_name && (
                                        <p className="info-line">
                                            <strong>Mosque:</strong> {enrollment.mosque_name}
                                        </p>
                                    )}
                                    <p className="info-line">
                                        <strong>Enrolled:</strong> {new Date(enrollment.enrollment_date).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Progress Section */}
                                <div className="progress-section">
                                    <div className="progress-header">
                                        <span className="progress-label">Progress</span>
                                        <span 
                                            className="progress-percentage"
                                            style={{ color: getProgressColor(enrollment.progress || 0) }}
                                        >
                                            {enrollment.progress || 0}%
                                        </span>
                                    </div>
                                    <Progress
                                        percent={enrollment.progress || 0}
                                        strokeColor={getProgressColor(enrollment.progress || 0)}
                                        showInfo={false}
                                        strokeWidth={10}
                                    />
                                </div>

                                {/* Course-Specific Stats */}
                                {enrollment.course_type === 'memorization' ? (
                                    <div className="course-stats">
                                        <div className="stat-item">
                                            <span className="stat-label">Current Page</span>
                                            <span className="stat-value">{enrollment.current_page || 0}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Exams Passed</span>
                                            <span className="stat-value">{enrollment.exams_passed || 0}/5</span>
                                        </div>
                                        {enrollment.is_graduated && (
                                            <div className="graduated-badge">
                                                <TrophyOutlined /> Graduated
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="course-stats">
                                        <div className="stat-item">
                                            <span className="stat-label">Present</span>
                                            <span className="stat-value">{enrollment.present_count || 0}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Total Sessions</span>
                                            <span className="stat-value">{enrollment.total_sessions || 0}</span>
                                        </div>
                                    </div>
                                )}

                                {/* View Progress Button */}
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    onClick={() => handleViewProgress(enrollment.enrollment_id)}
                                    className="view-progress-btn"
                                >
                                    View Detailed Progress
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default ChildOverviewPage;