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
        return cents === 0 ? 'Free' : `₪${cents}`;
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
                    <div className="enrollments-list">
                        {enrollments.map(enrollment => (
                            <div key={enrollment.enrollment_id} className="enrollment-card">
                                {/* Header */}
                                <div className="card-header">
                                    <div className="card-title-section">
                                        <div className="title-row">
                                            <h3>{enrollment.course_name}</h3>
                                            {getStatusBadge(enrollment.enrollment_status)}
                                        </div>
                                        <p className="teacher-info">
                                            <span style={{ fontWeight: '600' }}>Teacher:</span> {enrollment.teacher_name || 'TBA'}
                                        </p>
                                        <p className="mosque-info">
                                            🕌 {enrollment.mosque_name} • {enrollment.region}, {enrollment.governorate}
                                        </p>
                                    </div>
                                    <div className="progress-badge">
                                        <div className="progress-value">
                                            {enrollment.completion_percentage || 0}%
                                        </div>
                                        <div className="progress-label">Progress</div>
                                    </div>
                                </div>

                                {/* Description */}
                                {enrollment.description && (
                                    <p className="course-description">
                                        {enrollment.description.length > 150
                                            ? enrollment.description.substring(0, 150) + '...'
                                            : enrollment.description}
                                    </p>
                                )}

                                {/* Progress Bar */}
                                <div className="progress-bar-container">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${enrollment.completion_percentage || 0}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Course Info Grid */}
                                <div className="course-info-grid">
                                    <div className="info-item">
                                        <p className="info-label">Course Type</p>
                                        <p className="info-value">{enrollment.course_type}</p>
                                    </div>
                                    <div className="info-item">
                                        <p className="info-label">Enrolled</p>
                                        <p className="info-value">
                                            {new Date(enrollment.enrollment_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="info-item">
                                        <p className="info-label">Price</p>
                                        <p className="info-value">{formatPrice(enrollment.price_cents)}</p>
                                    </div>
                                    <div className="info-item">
                                        <p className="info-label">Schedule</p>
                                        <p className="info-value">{enrollment.schedule_type}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="card-actions">
                                    <button
                                        onClick={() => handleViewCourse(enrollment.enrollment_id)}
                                        className="btn-primary"
                                    >
                                        View Course
                                    </button>
                                    {enrollment.enrollment_status === 'active' && (
                                        <>
                                            <JoinMeetingButton
                                                courseId={enrollment.course_id}
                                                variant="secondary"
                                            />
                                            <button
                                                onClick={() => handleWithdraw(enrollment.enrollment_id, enrollment.course_name)}
                                                className="btn-danger"
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