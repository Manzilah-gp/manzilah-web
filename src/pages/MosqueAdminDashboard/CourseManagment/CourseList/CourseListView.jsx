import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    LaptopOutlined,
    HomeOutlined,
    GlobalOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FilterOutlined,
    MoreOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { getCoursesByMosque, deleteCourse, getMyMosqueId } from '../../../../api/course.js';
import useAuth from "../../../../hooks/useAuth.js";
import './CourseListView.css';

const CourseListView = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        format: 'all',
        scheduleType: 'all',
        courseType: 'all'
    });

    const getMosqueIdForAdmin = async () => {
        const adminId = user.id;
        const response = await getMyMosqueId(adminId);
        return response.data.mosqueId;
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const mosqueId = await getMosqueIdForAdmin();

            if (!mosqueId) {
                setError("Unable to determine mosque ID.");
                return;
            }

            const response = await getCoursesByMosque(mosqueId);
            setCourses(response.data || []);
            setFilteredCourses(response.data || []);
        } catch (err) {
            console.error('❌ Error fetching courses:', err);
            setError('Failed to load courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Apply filters and search
    useEffect(() => {
        let filtered = [...courses];

        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply filters
        if (filters.format !== 'all') {
            filtered = filtered.filter(c => c.course_format === filters.format);
        }

        if (filters.scheduleType !== 'all') {
            filtered = filtered.filter(c => c.schedule_type === filters.scheduleType);
        }

        if (filters.courseType !== 'all') {
            filtered = filtered.filter(c => c.course_type.toLowerCase() === filters.courseType.toLowerCase());
        }

        setFilteredCourses(filtered);
    }, [filters, searchTerm, courses]);

    const handleDeleteCourse = async (courseId, courseName) => {
        if (window.confirm(`Are you sure you want to delete "${courseName}"?`)) {
            try {
                await deleteCourse(courseId);
                alert(`${courseName} has been deleted successfully`);
                fetchCourses();
            } catch (err) {
                console.error('Error deleting course:', err);
                alert('Failed to delete course');
            }
        }
    };

    const formatPrice = (price) => {
        return price === 0 ? 'Free' : `₪ ${price}`;
    };

    const getScheduleIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'online':
                return <LaptopOutlined className="w-4 h-4" />;
            case 'onsite':
                return <HomeOutlined className="w-4 h-4" />;
            case 'hybrid':
                return <GlobalOutlined className="w-4 h-4" />;
            default:
                return <HomeOutlined className="w-4 h-4" />;
        }
    };

    const getDifficultyLabel = (level) => {
        if (level <= 2) return 'Beginner';
        if (level <= 4) return 'Intermediate';
        return 'Advanced';
    };

    if (loading) {
        return (
            <div className="page-loading" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                    <p style={{ color: '#666', marginTop: '16px' }}>Loading courses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
                <div style={{ backgroundColor: '#fed7d7', color: '#9b2c2c', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    {error}
                </div>
                <button
                    onClick={fetchCourses}
                    style={{ backgroundColor: '#3182ce', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px', textAlign: 'center', paddingTop: '64px', paddingBottom: '64px' }}>
                <CalendarOutlined style={{ fontSize: '96px', color: '#d1d5db', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '24px', color: '#374151', marginBottom: '8px' }}>No Courses Found</h2>
                <p style={{ color: '#6b7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                    You haven't created any courses yet. Create your first course to get started.
                </p>
                <button
                    style={{ backgroundColor: '#3b82f6', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => navigate('/mosque-admin/courses/create')}
                >
                    <PlusOutlined />
                    Create First Course
                </button>
            </div>
        );
    }

    return (
        <div className="course-list-container" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            padding: '32px 16px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '8px'
                    }}>
                        Course Management
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '18px' }}>
                        Manage your mosque's courses and teacher assignments
                    </p>
                </div>

                {/* Search and Filters */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <SearchOutlined style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af'
                            }} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px 12px 48px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    fontSize: '16px'
                                }}
                            />
                        </div>

                        {/* Filters */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FilterOutlined style={{ color: '#6b7280' }} />
                                <span style={{ fontWeight: '600', color: '#374151' }}>Filters:</span>
                            </div>

                            <select
                                value={filters.format}
                                onChange={(e) => setFilters({ ...filters, format: e.target.value })}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    minWidth: '140px'
                                }}
                            >
                                <option value="all">All Formats</option>
                                <option value="short">Short Course</option>
                                <option value="long">Long Course</option>
                            </select>

                            <select
                                value={filters.scheduleType}
                                onChange={(e) => setFilters({ ...filters, scheduleType: e.target.value })}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    minWidth: '140px'
                                }}
                            >
                                <option value="all">All Schedules</option>
                                <option value="online">Online</option>
                                <option value="onsite">On-site</option>
                                <option value="hybrid">Hybrid</option>
                            </select>

                            <select
                                value={filters.courseType}
                                onChange={(e) => setFilters({ ...filters, courseType: e.target.value })}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    minWidth: '140px'
                                }}
                            >
                                <option value="all">All Types</option>
                                <option value="memorization">Memorization</option>
                                <option value="tajweed">Tajweed</option>
                                <option value="feqh">Feqh</option>
                            </select>

                            {(filters.format !== 'all' || filters.scheduleType !== 'all' || filters.courseType !== 'all' || searchTerm) && (
                                <button
                                    onClick={() => {
                                        setFilters({ format: 'all', scheduleType: 'all', courseType: 'all' });
                                        setSearchTerm('');
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: 'transparent',
                                        color: '#dc2626',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                    <button
                        style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: '600',
                            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                        }}
                        onClick={() => navigate('/mosque-admin/courses/create')}
                    >
                        <PlusOutlined />
                        Create Course
                    </button>
                </div>

                {/* Results Count */}
                <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
                    Showing {filteredCourses.length} of {courses.length} courses
                </p>

                {/* Course Grid */}
                {filteredCourses.length === 0 ? (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '16px',
                        textAlign: 'center'
                    }}>
                        <FilterOutlined style={{ fontSize: '64px', color: '#d1d5db', marginBottom: '16px' }} />
                        <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '16px' }}>
                            No courses match your filters
                        </p>
                        <button
                            onClick={() => {
                                setFilters({ format: 'all', scheduleType: 'all', courseType: 'all' });
                                setSearchTerm('');
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: 'transparent',
                                color: '#3b82f6',
                                border: '1px solid #3b82f6',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '24px'
                    }}>
                        {filteredCourses.map((course) => {
                            // const progress = course.progress || { sessionsCompleted: 0, completionPercentage: 0 };
                            const targetAgeGroup = course.target_age_group;



                            return (
                                <div
                                    key={course.id}
                                    className="course-card"
                                    style={{
                                        position: 'relative',
                                        borderRadius: '24px',
                                        border: `2px solid ${course.is_active ? '#e5e7eb' : '#d1d5db'}`,
                                        padding: '24px',
                                        backgroundColor: course.is_active ? 'white' : '#f9fafb',
                                        opacity: course.is_active ? 1 : 0.75,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(`/mosque-admin/courses/${course.id}`)}
                                >
                                    {/* Inactive Badge */}
                                    {!course.is_active && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            backgroundColor: '#6b7280',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}>
                                            Inactive
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{
                                                    fontSize: '18px',
                                                    fontWeight: '700',
                                                    color: '#000',
                                                    marginBottom: '8px',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {course.name}
                                                </h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '9999px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        backgroundColor: course.course_format === 'short' ? '#dbeafe' : '#f3e8ff',
                                                        color: course.course_format === 'short' ? '#1e40af' : '#7c3aed'
                                                    }}>
                                                        {course.course_format === 'short' ? 'Short Course' : 'Long Course'}
                                                    </span>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '9999px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        backgroundColor: '#f3f4f6',
                                                        color: '#374151'
                                                    }}>
                                                        {getDifficultyLabel(course.course_level)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6', margin: '0 16px' }}>
                                                    {formatPrice(course.price_cents)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {course.description && (
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
                                                {course.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Details Grid */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px',
                                        marginBottom: '20px'
                                    }}>
                                        {course.duration_weeks && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                                <CalendarOutlined style={{ width: '16px', height: '16px' }} />
                                                <span style={{ fontSize: '14px' }}>{course.duration_weeks} weeks</span>
                                            </div>
                                        )}

                                        {course.total_sessions && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                                <ClockCircleOutlined style={{ width: '16px', height: '16px' }} />
                                                <span style={{ fontSize: '14px' }}>{course.total_sessions} sessions</span>
                                            </div>
                                        )}

                                        {course.max_students && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                                <TeamOutlined style={{ width: '16px', height: '16px' }} />
                                                <span style={{ fontSize: '14px' }}>Max {course.max_students}</span>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                            {getScheduleIcon(course.schedule_type)}
                                            <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{course.schedule_type}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {/* <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                                                Session Progress
                                            </span>
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                                                {progress.sessionsCompleted || 0} / {course.total_sessions || 0}
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
                                                width: `${progress.completionPercentage || 0}%`,
                                                backgroundColor: '#3b82f6',
                                                borderRadius: '9999px',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                    </div> */}

                                    {/* Footer */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingTop: '16px',
                                        borderTop: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {targetAgeGroup && (
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                                    Ages:{targetAgeGroup}                                                </span>
                                            )}
                                        </div>

                                        {course.course_level && (
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                backgroundColor: '#fef3c7',
                                                color: '#92400e'
                                            }}>
                                                Level {course.course_level}
                                            </span>
                                        )}
                                    </div>

                                    {/* Enrolled Students */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: '#6b7280' }}>
                                        <TeamOutlined style={{ width: '16px', height: '16px' }} />
                                        <span style={{ fontSize: '14px' }}>{course.enrolled_students || 0} enrolled</span>
                                    </div>

                                    {/* Action Menu */}
                                    <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
                                        <div style={{ position: 'relative' }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Show dropdown menu - you'll need to implement this
                                                    alert('Menu clicked - implement dropdown menu');
                                                }}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                <MoreOutlined style={{ fontSize: '20px', color: '#6b7280' }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseListView;