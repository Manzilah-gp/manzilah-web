import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    DollarOutlined,
    UserOutlined,
    EnvironmentOutlined,
    BookOutlined,
    CheckCircleOutlined,
    ScheduleOutlined
} from '@ant-design/icons';
import { getCourseById, deleteCourse } from '../../../../api/course';
import EnableMeetingToggle from '../../../../components/Course/EnableMeetingToggle';

import './ViewCourseView.css';

const ViewCourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [showStudentsModal, setShowStudentsModal] = useState(false);

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const response = await getCourseById(id);

            if (response.data) {
                setCourse(response.data);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            alert('Failed to load course data');
            navigate('/mosque-admin/courses');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/mosque-admin/courses/edit/${id}`);
    };

    const handleAssignTeacher = () => {
        navigate(`/mosque-admin/courses/assign-teacher/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${course.name}"? This action cannot be undone.`)) {
            try {
                setDeleting(true);
                await deleteCourse(id);
                alert('Course deleted successfully');
                navigate('/mosque-admin/courses');
            } catch (error) {
                alert('Failed to delete course');
            } finally {
                setDeleting(false);
            }
        }
    };

    const formatPrice = (cents) => {
        return cents > 0 ? `$${(cents / 100).toFixed(2)}` : 'Free';
    };

    const getCourseTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'memorization':
                return 'purple';
            case 'tajweed':
                return 'blue';
            case 'feqh':
                return 'green';
            default:
                return 'gray';
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px'
            }}>
                <div className="spinner" style={{
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3b82f6',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div style={{ padding: '32px' }}>
                <div style={{
                    backgroundColor: '#fed7d7',
                    color: '#9b2c2c',
                    padding: '16px',
                    borderRadius: '8px'
                }}>
                    Course not found
                </div>
            </div>
        );
    }

    return (
        <div className="view-course-container" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            padding: '32px 16px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header with Actions */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '32px'
                }}>
                    <button
                        onClick={() => navigate('/mosque-admin/courses')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            padding: '8px 0',
                            fontSize: '16px'
                        }}
                    >
                        <ArrowLeftOutlined />
                        Back to Courses
                    </button>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleEdit}
                            style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <EditOutlined />
                            Edit Course
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#dc2626',
                                border: '1px solid #dc2626',
                                borderRadius: '8px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                opacity: deleting ? 0.5 : 1
                            }}
                        >
                            <DeleteOutlined />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Course Header Card */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    marginBottom: '24px',
                    borderLeft: '5px solid #3b82f6'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: '700',
                                color: '#1f2937'
                            }}>
                                {course.name}
                            </h1>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{
                                    backgroundColor: course.is_active ? '#10b981' : '#ef4444',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '9999px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    {course.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <span style={{
                                    backgroundColor: getCourseTypeColor(course.course_type) === 'purple' ? '#8b5cf6' :
                                        getCourseTypeColor(course.course_type) === 'blue' ? '#3b82f6' :
                                            getCourseTypeColor(course.course_type) === 'green' ? '#10b981' : '#6b7280',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '9999px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    {course.course_type}
                                </span>
                                {course.target_gender && (
                                    <span style={{
                                        backgroundColor: course.target_gender === 'male' ? '#3b82f6' : '#ec4899',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}>
                                        {course.target_gender === 'male' ? '♂ Male Only' : '♀ Female Only'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {course.description && (
                            <p style={{
                                color: '#6b7280',
                                fontSize: '18px',
                                lineHeight: '1.6'
                            }}>
                                {course.description}
                            </p>
                        )}

                        <div style={{
                            display: 'flex',
                            gap: '24px',
                            flexWrap: 'wrap',
                            borderTop: '1px solid #e5e7eb',
                            paddingTop: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CalendarOutlined style={{ color: '#6b7280' }} />
                                <span style={{ color: '#6b7280', fontSize: '16px' }}>
                                    {course.course_format === 'short' ? 'Short Course' : 'Long Course'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <EnvironmentOutlined style={{ color: '#6b7280' }} />
                                <span style={{ color: '#6b7280', fontSize: '16px', textTransform: 'capitalize' }}>
                                    {course.schedule_type}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <DollarOutlined style={{ color: '#6b7280' }} />
                                <span style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '600' }}>
                                    {formatPrice(course.price_cents)}
                                </span>
                            </div>

                            {course.memorization_level && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <BookOutlined style={{ color: '#6b7280' }} />
                                    <span style={{ color: '#6b7280', fontSize: '16px' }}>
                                        {course.memorization_level}
                                    </span>
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <TeamOutlined style={{ color: '#6b7280' }} />
                                <span style={{ color: '#6b7280', fontSize: '16px', textTransform: 'capitalize' }}>
                                    Age: {course.target_age_group || 'All'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats and Details */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                    marginBottom: '24px'
                }}>
                    {/* Teacher Information */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#1f2937',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <UserOutlined />
                            Assigned Teacher
                        </h2>

                        {course.teacher_id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3b82f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '20px'
                                    }}>
                                        {course.teacher_name?.charAt(0) || 'T'}
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#1f2937'
                                        }}>
                                            {course.teacher_name}
                                        </h3>
                                        {course.teacher_email && (
                                            <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                                {course.teacher_email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {course.teacher_phone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontWeight: '600', color: '#374151' }}>Phone:</span>
                                        <span style={{ color: '#6b7280' }}>{course.teacher_phone}</span>
                                    </div>
                                )}

                                <button
                                    onClick={handleAssignTeacher}
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: '#3b82f6',
                                        border: '1px solid #3b82f6',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        width: 'fit-content'
                                    }}
                                >
                                    Change Teacher
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
                                <div style={{
                                    backgroundColor: '#fffbeb',
                                    border: '1px solid #f59e0b',
                                    borderRadius: '8px',
                                    padding: '12px'
                                }}>
                                    <p style={{ color: '#92400e', fontSize: '14px' }}>
                                        No teacher assigned to this course yet
                                    </p>
                                </div>
                                <button
                                    onClick={handleAssignTeacher}
                                    style={{
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: 'fit-content'
                                    }}
                                >
                                    <TeamOutlined />
                                    Assign Teacher
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Class Schedule */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#1f2937',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <CalendarOutlined />
                            Class Schedule
                        </h2>
                        {course.course_start_date && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                <ScheduleOutlined style={{ width: '16px', height: '16px' }} />
                                <span style={{ fontSize: '14px' }}>Start: {new Date(course.course_start_date).toLocaleDateString()}</span>
                            </div>
                        )}
                        {course.course_end_date && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                <ScheduleOutlined style={{ width: '16px', height: '16px' }} />
                                <span style={{ fontSize: '14px' }}>End: {new Date(course.course_end_date).toLocaleDateString()}</span>
                            </div>
                        )}

                        {course.schedule && course.schedule.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {course.schedule.map((slot, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px 16px',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <ClockCircleOutlined style={{ color: '#3b82f6' }} />
                                            <span style={{
                                                fontWeight: '600',
                                                textTransform: 'capitalize',
                                                color: '#374151'
                                            }}>
                                                {slot.day_of_week}
                                            </span>
                                        </div>
                                        <span style={{
                                            fontWeight: '600',
                                            color: '#3b82f6',
                                            fontSize: '16px'
                                        }}>
                                            {slot.start_time} - {slot.end_time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                backgroundColor: '#eff6ff',
                                border: '1px solid #3b82f6',
                                borderRadius: '8px',
                                padding: '16px'
                            }}>
                                <p style={{ color: '#1e40af', fontSize: '14px' }}>
                                    No schedule set for this course
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <EnableMeetingToggle courseId={id} />


                {/* Students Card */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '24px'
                }}
                    onClick={() => setShowStudentsModal(true)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#1f2937',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px'
                            }}>
                                <TeamOutlined />
                                Enrolled Students
                            </h2>
                            <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                Click to view student details
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                color: '#3b82f6'
                            }}>
                                {course.enrolled_students || 0}
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                {course.max_students ? `/ ${course.max_students} max` : 'No limit'}
                            </p>
                        </div>
                    </div>
                </div>


                {/* Students Modal */}
                {showStudentsModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '16px'
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '80vh',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)'
                        }}>
                            <div style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                padding: '20px 24px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    margin: 0
                                }}>
                                    Enrolled Students
                                </h3>
                                <button
                                    onClick={() => setShowStudentsModal(false)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '20px'
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(80vh - 68px)' }}>
                                {course.enrolled_students > 0 ? (
                                    <div>
                                        <p style={{
                                            color: '#6b7280',
                                            marginBottom: '16px'
                                        }}>
                                            {course.enrolled_students} student(s) enrolled in this course
                                        </p>
                                        <div style={{
                                            backgroundColor: '#eff6ff',
                                            border: '1px solid #3b82f6',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            marginBottom: '16px'
                                        }}>
                                            <p style={{ color: '#1e40af', fontSize: '14px' }}>
                                                Student enrollment details will be available in the next update
                                            </p>
                                        </div>
                                        <div style={{
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '8px',
                                            padding: '20px',
                                            textAlign: 'center'
                                        }}>
                                            <p style={{ color: '#6b7280' }}>
                                                Student details coming soon...
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        backgroundColor: '#fffbeb',
                                        border: '1px solid #f59e0b',
                                        borderRadius: '8px',
                                        padding: '16px'
                                    }}>
                                        <p style={{ color: '#92400e' }}>
                                            No students enrolled in this course yet
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewCourseView;