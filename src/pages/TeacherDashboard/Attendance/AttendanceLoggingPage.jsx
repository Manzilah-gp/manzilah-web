// src/pages/TeacherDashboard/Attendance/AttendanceLoggingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Button, Radio, Input, message, Tag, Modal } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getCourseStudents, getSessionStudents, bulkMarkAttendance } from '../../../api/teacherCourses';
import './AttendanceLoggingPage.css';

const AttendanceLoggingPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [sessionNotes, setSessionNotes] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCourseInfo();
    }, [courseId]);

    const fetchCourseInfo = async () => {
        try {
            const response = await getCourseStudents(courseId);
            if (response.data.success && response.data.data.length > 0) {
                setCourseName(response.data.data[0]?.course_name || 'Course');
            }
        } catch (error) {
            console.error('Error fetching course info:', error);
        }
    };

    const handleDateSelect = async (date) => {
        const dateStr = date.format('YYYY-MM-DD');

        // Check if date is in the future
        if (date.isAfter(dayjs(), 'day')) {
            message.warning('Cannot mark attendance for future dates');
            return;
        }

        setSelectedDate(date);
        setLoading(true);

        try {
            const response = await getSessionStudents(courseId, dateStr);
            if (response.data.success) {
                setStudents(response.data.data);

                // Pre-populate attendance data if already marked
                const initialData = {};
                response.data.data.forEach(student => {
                    initialData[student.enrollment_id] = {
                        status: student.attendance_status || 'present',
                        notes: student.attendance_notes || ''
                    };
                });
                setAttendanceData(initialData);
                setShowModal(true);
            }
        } catch (error) {
            message.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (enrollmentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [enrollmentId]: {
                ...prev[enrollmentId],
                status
            }
        }));
    };

    const handleNotesChange = (enrollmentId, notes) => {
        setAttendanceData(prev => ({
            ...prev,
            [enrollmentId]: {
                ...prev[enrollmentId],
                notes
            }
        }));
    };

    const handleMarkAllPresent = () => {
        const newData = {};
        students.forEach(student => {
            newData[student.enrollment_id] = {
                status: 'present',
                notes: ''
            };
        });
        setAttendanceData(newData);
        message.success('All students marked as present');
    };

    const handleSubmitAttendance = async () => {
        setLoading(true);

        try {
            const attendanceRecords = students.map(student => ({
                enrollmentId: student.enrollment_id,
                attendanceDate: selectedDate.format('YYYY-MM-DD'),
                status: attendanceData[student.enrollment_id]?.status || 'present',
                notes: attendanceData[student.enrollment_id]?.notes || sessionNotes
            }));

            const response = await bulkMarkAttendance(attendanceRecords);

            if (response.data.success) {
                message.success(`Attendance saved for ${students.length} students!`);
                setShowModal(false);
                setSelectedDate(null);
                setStudents([]);
                setAttendanceData({});
                setSessionNotes('');
            }
        } catch (error) {
            message.error('Failed to save attendance');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        return status === 'present' ? 'success' : status === 'absent' ? 'error' : 'warning';
    };

    return (
        <div className="attendance-logging-page">
            {/* Header */}
            <div className="page-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                <div>
                    <h1>📝 Mark Attendance</h1>
                    <p className="course-title">{courseName}</p>
                </div>
            </div>

            {/* Instructions */}
            <div className="instructions-card">
                <h3>Instructions:</h3>
                <ol>
                    <li>Click on a date in the calendar to mark attendance</li>
                    <li>Select the status for each student (Present/Absent/Excused)</li>
                    <li>Use "Mark All Present" for quick logging</li>
                    <li>Add optional notes for individual students or the session</li>
                </ol>
            </div>

            {/* Calendar */}
            <div className="calendar-container">
                <Calendar
                    onSelect={handleDateSelect}
                    disabledDate={(date) => date.isAfter(dayjs(), 'day')}
                    fullscreen={false}
                />
            </div>

            {/* Attendance Modal */}
            <Modal
                open={showModal}
                onCancel={() => setShowModal(false)}
                footer={null}
                width={800}
                title={`Mark Attendance - ${selectedDate?.format('MMMM D, YYYY')}`}
            >
                <div className="attendance-modal-content">
                    {/* Quick Action */}
                    <div className="quick-actions">
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={handleMarkAllPresent}
                        >
                            Mark All Present
                        </Button>
                    </div>

                    {/* Session Notes */}
                    <div className="session-notes">
                        <label>Session Notes (applies to all students):</label>
                        <Input.TextArea
                            value={sessionNotes}
                            onChange={(e) => setSessionNotes(e.target.value)}
                            placeholder="Add notes about today's session..."
                            rows={2}
                        />
                    </div>

                    {/* Students Table */}
                    <div className="students-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Status</th>
                                    <th>Individual Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.enrollment_id}>
                                        <td>
                                            <div className="student-info">
                                                <strong>{student.full_name}</strong>
                                                <span className="student-email">{student.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <Radio.Group
                                                value={attendanceData[student.enrollment_id]?.status || 'present'}
                                                onChange={(e) => handleStatusChange(student.enrollment_id, e.target.value)}
                                                buttonStyle="solid"
                                            >
                                                <Radio.Button value="present">
                                                    <CheckCircleOutlined /> Present
                                                </Radio.Button>
                                                <Radio.Button value="absent">
                                                    <CloseCircleOutlined /> Absent
                                                </Radio.Button>
                                                <Radio.Button value="excused">
                                                    <ExclamationCircleOutlined /> Excused
                                                </Radio.Button>
                                            </Radio.Group>
                                        </td>
                                        <td>
                                            <Input
                                                placeholder="Optional notes..."
                                                value={attendanceData[student.enrollment_id]?.notes || ''}
                                                onChange={(e) => handleNotesChange(student.enrollment_id, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Submit Actions */}
                    <div className="modal-footer">
                        <Button onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button
                            type="primary"
                            loading={loading}
                            onClick={handleSubmitAttendance}
                        >
                            Save Attendance ({students.length} students)
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AttendanceLoggingPage;