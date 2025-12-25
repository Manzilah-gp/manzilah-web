import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeftOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    UserOutlined,
    BankOutlined,
    BookOutlined,
    LoadingOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { getEnrollmentDetails, withdrawFromCourse } from '../../../api/studentDashboard';
import './ViewCoursePage.css';

const ViewCoursePage = () => {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrollmentDetails();
    }, [enrollmentId]);

    const fetchEnrollmentDetails = async () => {
        setLoading(true);
        try {
            const response = await getEnrollmentDetails(enrollmentId);
            if (response.data.success) {
                setEnrollment(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching enrollment details:', error);
            alert('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!window.confirm(`Are you sure you want to withdraw from "${enrollment.name}"?`)) {
            return;
        }

        try {
            const response = await withdrawFromCourse(enrollmentId);
            if (response.data.success) {
                alert('Successfully withdrawn from course');
                navigate('/my-enrollments');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to withdraw from course');
        }
    };

    const formatPrice = (cents) => {
        return cents === 0 ? 'Free' : `₪${cents}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            active: { bg: '#d1fae5', text: '#10b981' },
            completed: { bg: '#dbeafe', text: '#3b82f6' },
            dropped: { bg: '#fee2e2', text: '#ef4444' }
        };
        return colors[status] || colors.active;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingOutlined style={{ fontSize: '48px' }} />
                <p>Loading course details...</p>
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className="error-container">
                <h2>Course not found</h2>
                <button onClick={() => navigate('/my-enrollments')} className="btn-primary">
                    Back to My Courses
                </button>
            </div>
        );
    }

    const statusColor = getStatusColor(enrollment.status);

    return (
        <div className="view-course-page">
            <div className="page-container">
                {/* Back Button */}
                <div className="back-button-container">
                    <button
                        onClick={() => navigate('/my-enrollments')}
                        className="back-button"
                    >
                        <ArrowLeftOutlined /> Back to My Courses
                    </button>
                </div>
                {/* Course Header */}
                <div className="course-header-card">

                    <div className="header-content">
                        <div className="header-left">
                            <h1 className="course-title">{enrollment.name}</h1>
                            <span
                                className="status-badge"
                                style={{
                                    backgroundColor: statusColor.bg,
                                    color: statusColor.text
                                }}
                            >
                                {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                            </span>
                        </div>
                        <div className="progress-circle">
                            <div className="progress-number">
                                {enrollment.completion_percentage || 0}%
                            </div>
                            <div className="progress-text">Complete</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="header-progress">
                        <div className="progress-bar-full">
                            <div
                                className="progress-fill"
                                style={{ width: `${enrollment.completion_percentage || 0}%` }}
                            />
                        </div>
                        <p className="progress-label">
                            Course Progress
                        </p>
                    </div>
                </div>

                <div className="content-grid">
                    {/* Main Content */}
                    <div className="main-content">
                        {/* Description */}
                        <div className="content-card">
                            <h2 className="card-title">
                                <BookOutlined /> Course Description
                            </h2>
                            <p className="description-text">
                                {enrollment.description || 'No description available for this course.'}
                            </p>
                        </div>

                        {/* Course Schedule */}
                        {enrollment.schedule && enrollment.schedule.length > 0 && (
                            <div className="content-card">
                                <h2 className="card-title">
                                    <ClockCircleOutlined /> Class Schedule
                                </h2>
                                <div className="schedule-list">
                                    {enrollment.schedule.map((slot, index) => (
                                        <div key={index} className="schedule-item">
                                            <div className="schedule-day">
                                                {slot.day_of_week.charAt(0).toUpperCase() + slot.day_of_week.slice(1)}
                                            </div>
                                            <div className="schedule-time">
                                                {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                            </div>
                                            {slot.location && (
                                                <div className="schedule-location">
                                                    <EnvironmentOutlined /> {slot.location}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Teacher Notes */}
                        {enrollment.teacher_notes && (
                            <div className="content-card">
                                <h2 className="card-title">
                                    <FileTextOutlined /> Teacher Notes
                                </h2>
                                <div className="notes-box">
                                    {enrollment.teacher_notes}
                                </div>
                            </div>
                        )}

                        {/* Course Materials Button (Placeholder) */}
                        <div className="content-card">
                            <h2 className="card-title">
                                <BookOutlined /> Course Materials
                            </h2>
                            <button className="materials-button" disabled>
                                Course Materials (Coming Soon)
                            </button>
                            <p className="coming-soon-text">
                                Course materials and assignments will be available soon
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="course-sidebar">
                        {/* Course Info */}
                        <div className="sidebar-card">
                            <h3 className="sidebar-title">Course Information</h3>
                            <div className="info-list">
                                <div className="info-row">
                                    <span className="info-label">Course Type</span>
                                    <span className="info-value">{enrollment.course_type}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Format</span>
                                    <span className="info-value">{enrollment.course_format}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Schedule</span>
                                    <span className="info-value">{enrollment.schedule_type}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Price</span>
                                    <span className="info-value">{formatPrice(enrollment.price_cents)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Enrolled On</span>
                                    <span className="info-value">{formatDate(enrollment.enrollment_date)}</span>
                                </div>
                                {enrollment.completed_at && (
                                    <div className="info-row">
                                        <span className="info-label">Completed On</span>
                                        <span className="info-value">{formatDate(enrollment.completed_at)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Teacher Info */}
                        <div className="sidebar-card">
                            <h3 className="sidebar-title">
                                <UserOutlined /> Teacher
                            </h3>
                            <div className="teacher-info">
                                <div className="teacher-avatar">
                                    {enrollment.teacher_name ? enrollment.teacher_name.charAt(0).toUpperCase() : 'T'}
                                </div>
                                <div>
                                    <p className="teacher-name">{enrollment.teacher_name || 'To Be Assigned'}</p>
                                    {enrollment.teacher_email && (
                                        <p className="teacher-contact">{enrollment.teacher_email}</p>
                                    )}
                                    {enrollment.teacher_phone && (
                                        <p className="teacher-contact">{enrollment.teacher_phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mosque Info */}
                        <div className="sidebar-card">
                            <h3 className="sidebar-title">
                                <BankOutlined /> Mosque
                            </h3>
                            <div className="mosque-info">
                                <p className="mosque-name">{enrollment.mosque_name}</p>
                                <p className="mosque-location">
                                    <EnvironmentOutlined /> {enrollment.region}, {enrollment.governorate}
                                </p>
                                {enrollment.mosque_address && (
                                    <p className="mosque-address">{enrollment.mosque_address}</p>
                                )}
                                {enrollment.mosque_contact && (
                                    <p className="mosque-contact">📞 {enrollment.mosque_contact}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {enrollment.status === 'active' && (
                            <div className="sidebar-card">
                                <button
                                    onClick={handleWithdraw}
                                    className="withdraw-button"
                                >
                                    Withdraw from Course
                                </button>
                                <p className="withdraw-note">
                                    You can withdraw from this course at any time
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ViewCoursePage;