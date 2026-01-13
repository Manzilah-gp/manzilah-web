import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOutlined,
    SearchOutlined,
    TrophyOutlined,
    BankOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { getMyEnrollments, getStudentStats, withdrawFromCourse, getChildren } from '../../../api/studentDashboard';
import JoinMeetingButton from '../../../components/Course/JoinMeetingButton';
import './MyEnrollmentsPage.css';
import useAuth from '../../../hooks/useAuth';

const MyEnrollmentsPage = () => {
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [stats, setStats] = useState({
        totalEnrollments: 0,
        activeCourses: 0,
        completedCourses: 0,
        mosquesCount: 0,
        avgProgress: 0
    });
    const [initialLoading, setInitialLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchChildren();
        fetchData(true);
    }, []);

    useEffect(() => {
        if (!initialLoading) {
            fetchData(true);
        }
    }, [filter, searchTerm, selectedChild]);

    const fetchChildren = async () => {
        try {
            const response = await getChildren();
            if (response.data.success) {
                setChildren(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    const fetchData = async (isUpdate = false) => {
        if (!isUpdate) setInitialLoading(true);
        else setFetching(true);

        try {
            // Fetch both stats and enrollments
            const [statsRes, enrollmentsRes] = await Promise.all([
                getStudentStats(selectedChild),
                getMyEnrollments(
                    filter === 'all' ? '' : filter,
                    searchTerm,
                    selectedChild
                )
            ]);

            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }

            if (enrollmentsRes.data.success) {
                setEnrollments(enrollmentsRes.data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setInitialLoading(false);
            setFetching(false);
        }
    };

    const handleWithdraw = async (enrollmentId, courseName) => {
        if (!window.confirm(`Are you sure you want to withdraw from "${courseName}"?`)) {
            return;
        }

        try {
            const response = await withdrawFromCourse(enrollmentId);
            if (response.data.success) {
                alert('Successfully withdrawn from course');
                fetchData(); // Refresh data
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to withdraw from course');
        }
    };

    const handleViewCourse = (enrollmentId) => {
        navigate(`/course/${enrollmentId}`);
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: { color: '#10b981', bg: '#d1fae5', text: 'Active' },
            completed: { color: '#3b82f6', bg: '#dbeafe', text: 'Completed' },
            dropped: { color: '#ef4444', bg: '#fee2e2', text: 'Dropped' }
        };
        const badge = badges[status] || badges.active;

        return (
            <span className="status-badge" style={{
                backgroundColor: badge.bg,
                color: badge.color
            }}>
                {badge.text}
            </span>
        );
    };

    const formatPrice = (cents) => {
        return cents === 0 ? 'Free' : `$${cents}`;
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <LoadingOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <p>Loading your courses...</p>
            </div>
        );
    }

    return (
        <div className="student-dashboard">
            <div className="dashboard-container">
                {/* Header */}
                <div className="dashboard-header">
                    <h1>My Enrollments</h1>
                    <p>Track your Quranic learning journey</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Total Courses</p>
                                <p className="stat-value">{stats.totalEnrollments}</p>
                            </div>
                            <BookOutlined className="stat-icon" style={{ color: '#667eea' }} />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Active</p>
                                <p className="stat-value" style={{ color: '#10b981' }}>{stats.activeCourses}</p>
                            </div>
                            <CheckCircleOutlined className="stat-icon" style={{ color: '#10b981' }} />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Completed</p>
                                <p className="stat-value" style={{ color: '#3b82f6' }}>{stats.completedCourses}</p>
                            </div>
                            <TrophyOutlined className="stat-icon" style={{ color: '#3b82f6' }} />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Mosques</p>
                                <p className="stat-value" style={{ color: '#f59e0b' }}>{stats.mosquesCount}</p>
                            </div>
                            <BankOutlined className="stat-icon" style={{ color: '#f59e0b' }} />
                        </div>
                    </div>
                </div>


                <div className="filters-container">
                    <div className="filters-content">
                        {/* Child Filter */}
                        {children.length > 0 && (
                            <div className="child-select-container" style={{ marginRight: '16px' }}>
                                <select
                                    value={selectedChild}
                                    onChange={(e) => setSelectedChild(e.target.value)}
                                    className="child-select"
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        backgroundColor: 'white',
                                        fontSize: '14px',
                                        color: '#374151',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="">My Enrollments</option>
                                    {children.map(child => (
                                        <option key={child.id} value={child.id}>
                                            {child.full_name}'s Courses
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Search */}
                        <div className="search-box">
                            <SearchOutlined className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by course name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="filter-buttons">
                            {['all', 'active', 'completed', 'dropped'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`filter-btn ${filter === status ? 'active' : ''}`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enrollments List */}
                {enrollments.length === 0 ? (
                    <div className="empty-state">
                        <ExclamationCircleOutlined style={{ fontSize: '64px', color: '#d1d5db' }} />
                        <h3>No courses found</h3>
                        <p>
                            {filter === 'all'
                                ? "You haven't enrolled in any courses yet"
                                : `No ${filter} courses found`}
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '24px'
                    }}>
                        {enrollments.map(enrollment => (
                            <div
                                key={enrollment.enrollment_id}
                                className="enrollment-card"
                                style={{
                                    borderRadius: '24px',
                                    border: '2px solid #e5e7eb',
                                    padding: '24px',
                                    backgroundColor: 'white',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div>
                                    {/* Header: Title, Level, Price */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                fontSize: '18px',
                                                fontWeight: '700',
                                                color: '#000',
                                                marginBottom: '8px',
                                                lineHeight: '1.4'
                                            }}>
                                                {enrollment.course_name}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                                {getStatusBadge(enrollment.enrollment_status)}
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '9999px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: '#f3f4f6',
                                                    color: '#374151'
                                                }}>
                                                    {enrollment.course_type}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>
                                                {formatPrice(enrollment.price_cents)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {enrollment.description && (
                                        <p style={{
                                            color: '#6b7280',
                                            fontSize: '14px',
                                            lineHeight: '1.5',
                                            marginBottom: '16px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {enrollment.description}
                                        </p>
                                    )}

                                    {/* Teacher & Location Info */}
                                    <div style={{ marginBottom: '16px', fontSize: '14px', color: '#4b5563' }}>
                                        <div style={{ marginBottom: '4px' }}>
                                            <span style={{ fontWeight: '600' }}>Teacher:</span> {enrollment.teacher_name || 'TBA'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <BankOutlined style={{ color: '#f59e0b' }} />
                                            <span>{enrollment.mosque_name} • {enrollment.region}</span>
                                        </div>
                                    </div>

                                    {/* Details Grid (Schedule, Enrolled Date, etc) */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px',
                                        marginBottom: '20px',
                                        paddingTop: '16px',
                                        borderTop: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                            <CheckCircleOutlined />
                                            <span style={{ fontSize: '14px' }}>
                                                Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                            <TrophyOutlined />
                                            <span style={{ fontSize: '14px' }}>{enrollment.schedule_type}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar Section */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                                                Progress
                                            </span>
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                                                {enrollment.completion_percentage || 0}%
                                            </span>
                                        </div>
                                        <div style={{
                                            height: '6px',
                                            backgroundColor: '#e5e7eb',
                                            borderRadius: '9999px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${enrollment.completion_percentage || 0}%`,
                                                backgroundColor: '#3b82f6',
                                                borderRadius: '9999px',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons - Single Row */}
                                <div className="card-actions" style={{
                                    display: 'grid',
                                    gridTemplateColumns: enrollment.enrollment_status === 'active' ? '1fr auto auto' : '1fr',
                                    gap: '8px',
                                    marginTop: 'auto',
                                    alignItems: 'center'
                                }}>
                                    <button
                                        onClick={() => handleViewCourse(enrollment.enrollment_id)}
                                        className="btn-primary"
                                        style={{
                                            height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        View Course
                                    </button>
                                    {enrollment.enrollment_status === 'active' && (
                                        <>
                                            {enrollment.is_online_enabled ? (
                                                <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <JoinMeetingButton
                                                        courseId={enrollment.course_id}
                                                        variant="secondary"
                                                    />
                                                </div>
                                            ) : null}
                                            <button
                                                onClick={() => handleWithdraw(enrollment.enrollment_id, enrollment.course_name)}
                                                className="btn-danger"
                                                style={{
                                                    height: '40px',
                                                    // padding: '0 16px',
                                                    display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', padding: '10px 20px',
                                                    borderRadius: '8px',
                                                    fontSize: '16px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Withdraw
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default MyEnrollmentsPage;