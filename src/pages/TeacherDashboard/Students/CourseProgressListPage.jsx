// src/pages/TeacherDashboard/Students/CourseProgressListPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Progress, Tag, message } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, TrophyOutlined } from '@ant-design/icons';
import { getCourseStudents } from '../../../api/teacherCourses';
import './CourseProgressListPage.css';

const CourseProgressListPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseName, setCourseName] = useState('');

    useEffect(() => {
        fetchStudents();
    }, [courseId]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(s =>
                s.full_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                setStudents(studentsData);
                setFilteredStudents(studentsData);

                if (studentsData.length > 0) {
                    setCourseName(studentsData[0].course_name || 'Memorization Course');
                }
            }
        } catch (error) {
            message.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleTrackProgress = (enrollmentId) => {
        navigate(`/teacher/student-progress/${enrollmentId}`);
    };

    const getExamStatus = (scores) => {
        const passed = [
            scores.exam_1_score,
            scores.exam_2_score,
            scores.exam_3_score,
            scores.exam_4_score,
            scores.exam_5_score
        ].filter(score => score >= 90).length;

        return `${passed}/5`;
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return 'success';
        if (percentage >= 50) return 'warning';
        return 'exception';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading students...</p>
            </div>
        );
    }

    return (
        <div className="course-progress-list-page">
            {/* Header */}
            <div className="page-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/teacher/my-courses')}
                >
                    Back to Courses
                </Button>
                <div className="header-info">
                    <h1>📖 Track Memorization Progress</h1>
                    <p className="course-name">{courseName}</p>
                </div>
            </div>

            {/* Instructions */}
            <div className="instructions-card">
                <h3>Instructions:</h3>
                <ul>
                    <li>Click on a student to track their memorization progress</li>
                    <li>Update current page and record exam scores</li>
                    <li>Progress is automatically calculated based on page completion</li>
                    <li>Students must pass all 5 exams (≥90) before final graduation exam</li>
                </ul>
            </div>

            {/* Search */}
            <div className="search-bar">
                <Input
                    placeholder="Search students..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: 400 }}
                />
                <span className="result-count">
                    {filteredStudents.length} of {students.length} students
                </span>
            </div>

            {/* Students Table */}
            <div className="students-table-card">
                {filteredStudents.length === 0 ? (
                    <div className="empty-state">
                        <p>No students found</p>
                    </div>
                ) : (
                    <table className="progress-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Progress</th>
                                <th>Current Page</th>
                                <th>Exams Passed</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.enrollment_id}>
                                    <td>
                                        <div className="student-cell">
                                            <div className="student-avatar-small">
                                                {student.full_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="student-name">{student.full_name}</div>
                                                <div className="student-email">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="progress-cell">
                                            <Progress
                                                percent={student.completion_percentage || 0}
                                                size="small"
                                                status={getProgressColor(student.completion_percentage || 0)}
                                                strokeWidth={8}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <span className="page-badge">
                                            {student.current_page || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="exam-badge">
                                            {getExamStatus({
                                                exam_1_score: student.exam_1_score,
                                                exam_2_score: student.exam_2_score,
                                                exam_3_score: student.exam_3_score,
                                                exam_4_score: student.exam_4_score,
                                                exam_5_score: student.exam_5_score
                                            })}
                                        </span>
                                    </td>
                                    <td>
                                        {student.is_graduated ? (
                                            <Tag icon={<TrophyOutlined />} color="success">
                                                Graduated
                                            </Tag>
                                        ) : (
                                            <Tag color="blue">Active</Tag>
                                        )}
                                    </td>
                                    <td>
                                        <Button
                                            type="primary"
                                            size="small"
                                            onClick={() => handleTrackProgress(student.enrollment_id)}
                                        >
                                            Track Progress
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CourseProgressListPage;