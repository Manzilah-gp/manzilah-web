// src/pages/TeacherDashboard/MyCourses/MyCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined, TeamOutlined, CalendarOutlined, VideoCameraOutlined, ScheduleOutlined } from '@ant-design/icons';
import { getMyCourses } from '../../../api/teacherCourses';
import JoinMeetingButton from '../../../components/Course/JoinMeetingButton';
import './MyCoursesPage.css';

const MyCoursesPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await getMyCourses();
            console.log('my courses teacher response.data', response.data);
            if (response.data.success) {
                setCourses(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewStudents = (courseId) => {
        navigate(`/teacher/course/${courseId}/students`);
    };

    const handleMarkAttendance = (courseId) => {
        navigate(`/teacher/attendance/${courseId}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingOutlined style={{ fontSize: '48px' }} />
                <p>Loading your courses...</p>
            </div>
        );
    }

    return (
        <div className="my-courses-page">
            <div className="page-header">
                <h1>📚 My Courses</h1>
                <p>Courses you are teaching</p>
            </div>

            {courses.length === 0 ? (
                <div className="empty-state">
                    <p>No courses assigned yet</p>
                </div>
            ) : (
                <div className="courses-grid">
                    {courses.map(course => (
                        <div key={course.course_id} className="course-card">
                            {/* Header */}
                            <div className="card-header">
                                <div>
                                    <h3 className="course-name">{course.course_name}</h3>
                                    {course.mosque_name && (
                                        <p className="mosque-name">{course.mosque_name}</p>
                                    )}
                                </div>
                                <span className="course-type">{course.course_type}</span>
                            </div>

                            {/* Description */}
                            {course.description && (
                                <p className="course-description">{course.description}</p>
                            )}

                            {/* Stats */}
                            <div className="course-stats">
                                <div className="stat-item">
                                    <TeamOutlined style={{ color: '#3b82f6', fontSize: '16px' }} />
                                    <span>
                                        {course.active_students !== undefined ? course.active_students : 0}/
                                        {course.total_students !== undefined ? course.total_students : 0} Students
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <CalendarOutlined style={{ color: '#3b82f6', fontSize: '16px' }} />
                                    <span>{course.schedule_type}</span>
                                </div>
                            </div>

                            {/* Schedule */}
                            {course.schedule && course.schedule.length > 0 && (
                                <div className="course-schedule">
                                    {course.course_start_date && (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: '#6b7280',
                                            marginBottom: '8px',
                                        }}>
                                            <ScheduleOutlined style={{ width: '16px', height: '16px' }} />
                                            <span style={{ fontSize: '14px' }}>Start: {new Date(course.course_start_date).toLocaleDateString()}</span>
                                            <ScheduleOutlined style={{ width: '16px', height: '16px' }} />
                                            <span style={{ fontSize: '14px' }}>End: {new Date(course.course_end_date).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    <strong>Schedule:</strong>
                                    {course.schedule.map((s, idx) => (
                                        <div key={idx} className="schedule-item">
                                            {s.day_of_week}: {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="card-actions">
                                <button
                                    onClick={() => handleViewStudents(course.course_id)}
                                    className="btn-primary"
                                >
                                    View Students
                                </button>

                                {/* Different button based on course type */}
                                {course.course_type === 'memorization' ? (
                                    <button
                                        onClick={() => navigate(`/teacher/course/${course.course_id}/progress`)}
                                        className="btn-secondary"
                                    >
                                        📖 Track Progress
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleMarkAttendance(course.course_id)}
                                        className="btn-secondary"
                                    >
                                        ✓ Mark Attendance
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate(`/course/${course.course_id}/materials`)}
                                    className="btn-secondary"
                                >
                                    📚 Materials
                                </button>

                                {course.is_online_enabled ? (
                                    <JoinMeetingButton
                                        courseId={course.course_id}
                                        variant="primary"
                                    />
                                ) : (
                                    null
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
};

export default MyCoursesPage;