// src/pages/TeacherDashboard/Students/CourseStudentsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Tag, message } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { getCourseStudents } from '../../../api/teacherCourses';
import { getCourseById } from '../../../api/course';
import './CourseStudentsPage.css';

const CourseStudentsPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseName, setCourseName] = useState('');
    const [courseType, setCourseType] = useState('');

    useEffect(() => {
        fetchStudents();
    }, [courseId]);

    useEffect(() => {
        // Filter students based on search term
        if (searchTerm.trim() === '') {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(s =>
                s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.phone?.includes(searchTerm)
            );
            setFilteredStudents(filtered);
        }
    }, [searchTerm, students]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await getCourseStudents(courseId);
            if (response.data.success) {
                const studentsData = response.data.data;
                console.log("studentsData courseStudentPage", studentsData);
                setStudents(studentsData);
                setFilteredStudents(studentsData);

                const course = await getCourseById(courseId);

                console.log("course courseStudentPage", course.data);
                setCourseName(course.data.name || 'Course');
                setCourseType(course.data.course_type || '');

            }
        } catch (error) {
            message.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleViewProgress = (enrollmentId) => {
        navigate(`/teacher/student-progress/${enrollmentId}`);
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'success',
            completed: 'blue',
            dropped: 'error'
        };
        return colors[status] || 'default';
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 50) return '#f59e0b';
        return '#ef4444';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading students...</p>
            </div>
        );
    }

    return (
        <div className="course-students-page">
            {/* Header */}
            <div className="page-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/teacher/my-courses')}
                >
                    Back to Courses
                </Button>
                <div className="header-info">
                    <h1>👥 Course Students</h1>
                    <div className="course-info">
                        <span className="course-name">{courseName}</span>
                        <Tag color="blue">{courseType}</Tag>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="search-bar">
                <Input
                    placeholder="Search by name, email, or phone..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: 400 }}
                />
                <span className="result-count">
                    {filteredStudents.length} of {students.length} students
                </span>
            </div>

            {/* Students Grid */}
            {filteredStudents.length === 0 ? (
                <div className="empty-state">
                    <p>No students found</p>
                </div>
            ) : (
                <div className="students-grid">
                    {filteredStudents.map(student => (
                        <div key={student.enrollment_id} className="student-card">
                            {/* Student Header */}
                            <div className="card-header">
                                <div className="student-avatar">
                                    {student.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="student-info">
                                    <h3 className="student-name">{student.full_name}</h3>
                                    <Tag color={getStatusColor(student.enrollment_status)}>
                                        {student.enrollment_status}
                                    </Tag>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="contact-info">
                                <div className="info-item">
                                    <MailOutlined />
                                    <span>{student.email}</span>
                                </div>
                                {student.phone && (
                                    <div className="info-item">
                                        <PhoneOutlined />
                                        <span>{student.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* Progress */}
                            <div className="progress-section">
                                <div className="progress-header">
                                    <span>Progress</span>
                                    <span
                                        className="progress-value"
                                        style={{ color: getProgressColor(student.completion_percentage || 0) }}
                                    >
                                        {student.completion_percentage || 0}%
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${student.completion_percentage || 0}%`,
                                            backgroundColor: getProgressColor(student.completion_percentage || 0)
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="stats-grid">
                                {courseType === 'memorization' ? (
                                    <>
                                        <div className="stat-item">
                                            <span className="stat-label">Current Page</span>
                                            <span className="stat-value">{student.current_page || 0}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Exams Passed</span>
                                            <span className="stat-value">
                                                {[
                                                    student.exam_1_score,
                                                    student.exam_2_score,
                                                    student.exam_3_score,
                                                    student.exam_4_score,
                                                    student.exam_5_score
                                                ].filter(score => score >= 90).length}/5
                                            </span>
                                        </div>
                                        {student.is_graduated ? (
                                            <div className="stat-item graduated">
                                                <span className="stat-label">Graduation Status</span>
                                                <span>🎓 Graduated</span>
                                            </div>
                                        ) : (
                                            <div className="stat-item">
                                                <span className="stat-label">Graduation Status</span>
                                                <span className="stat-value">Not Graduated</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="stat-item">
                                            <span className="stat-label">Present</span>
                                            <span className="stat-value">{student.present_count || 0}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Total Sessions</span>
                                            <span className="stat-value">{student.total_attendance_records || 0}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Attendance Rate</span>
                                            <span className="stat-value">
                                                {student.total_attendance_records > 0
                                                    ? `${Math.round((student.present_count / student.total_attendance_records) * 100)}%`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="card-actions">
                                <Button
                                    type="primary"
                                    block
                                    onClick={() => handleViewProgress(student.enrollment_id)}
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseStudentsPage;