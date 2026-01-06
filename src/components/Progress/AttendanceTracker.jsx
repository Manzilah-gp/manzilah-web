// src/components/Progress/AttendanceTracker.jsx
import React, { useState } from 'react';
import { Calendar, Badge, Modal, Radio, Input, Button, message, Progress } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { markAttendance } from '../../api/progress';
import './AttendanceTracker.css';

const AttendanceTracker = ({
    enrollmentId,
    attendanceData = {},
    onAttendanceUpdate
}) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState('present');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Extract data from props (backend provided stats)
    const {
        records = [],
        totalSessions = 0,
        present_count = 0,
        absent_count = 0,
        excused_count = 0,
        completionPercentage = 0
    } = attendanceData;

    // Convert attendance records to map for Calendar lookup
    const attendanceMap = {};
    records.forEach(record => {
        const dateKey = dayjs(record.attendance_date).format('YYYY-MM-DD');
        attendanceMap[dateKey] = record;
    });

    // Use backend provided stats (or fallback to 0)
    const presentCount = Number(present_count) || 0;
    const absentCount = Number(absent_count) || 0;
    const excusedCount = Number(excused_count) || 0;
    const attendanceRate = Number(completionPercentage) || 0;

    const handleDateSelect = (date) => {
        const dateKey = date.format('YYYY-MM-DD');
        const existingRecord = attendanceMap[dateKey];

        setSelectedDate(date);
        setStatus(existingRecord?.status || 'present');
        setNotes(existingRecord?.notes || '');
        setShowModal(true);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await markAttendance(
                enrollmentId,
                selectedDate.format('YYYY-MM-DD'),
                status,
                notes
            );

            if (response.data.success) {
                message.success('Attendance marked successfully!');

                // 🔔 FIREBASE NOTIFICATION: Attendance marked (optional)
                // await sendFirebaseNotification({
                //     type: 'attendance_marked',
                //     enrollmentId,
                //     date: selectedDate.format('YYYY-MM-DD'),
                //     status
                // });

                resetAndClose();
                if (onAttendanceUpdate) onAttendanceUpdate();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const resetAndClose = () => {
        setSelectedDate(null);
        setStatus('present');
        setNotes('');
        setShowModal(false);
    };

    const dateCellRender = (date) => {
        const dateKey = date.format('YYYY-MM-DD');
        const record = attendanceMap[dateKey];

        if (!record) return null;

        let badgeStatus = 'default';
        let icon = null;

        if (record.status === 'present') {
            badgeStatus = 'success';
            icon = <CheckCircleOutlined />;
        } else if (record.status === 'absent') {
            badgeStatus = 'error';
            icon = <CloseCircleOutlined />;
        } else if (record.status === 'excused') {
            badgeStatus = 'warning';
            icon = <ExclamationCircleOutlined />;
        }
        return (
            <div className="attendance-badge">
                <Badge status={badgeStatus} text={icon} />
            </div>
        );
    };

    return (
        <div className="attendance-tracker">
            <div className="attendance-header">
                <h3 className="tracker-title">📅 Attendance Tracking</h3>

                {/* Stats Summary */}
                <div className="attendance-stats">
                    <div className="stat-card present">
                        <CheckCircleOutlined className="stat-icon" />
                        <div className="stat-value">{presentCount}</div>
                        <div className="stat-label">Present</div>
                    </div>
                    <div className="stat-card absent">
                        <CloseCircleOutlined className="stat-icon" />
                        <div className="stat-value">{absentCount}</div>
                        <div className="stat-label">Absent</div>
                    </div>
                    <div className="stat-card excused">
                        <ExclamationCircleOutlined className="stat-icon" />
                        <div className="stat-value">{excusedCount}</div>
                        <div className="stat-label">Excused</div>
                    </div>
                </div>
            </div>

            {/* Attendance Rate Progress */}
            <div className="attendance-progress">
                <div className="progress-header">
                    <span>Attendance Rate</span>
                    <span className="progress-percentage">{attendanceRate}%</span>
                </div>
                <Progress
                    percent={attendanceRate}
                    strokeColor={{
                        '0%': '#ef4444',
                        '50%': '#f59e0b',
                        '100%': '#10b981'
                    }}
                    showInfo={false}
                />
                <div className="progress-footer">
                    {presentCount} / {totalSessions} sessions attended
                </div>
            </div>

            {/* Calendar */}
            <div className="attendance-calendar">
                <Calendar
                    onSelect={handleDateSelect}
                    cellRender={dateCellRender}
                />
            </div>

            {/* Attendance Modal */}
            <Modal
                open={showModal}
                onCancel={resetAndClose}
                footer={null}
                title={`Mark Attendance - ${selectedDate?.format('MMMM D, YYYY')}`}
                width={450}
            >
                <div className="attendance-modal-content">
                    <div className="status-selection">
                        <label>Attendance Status:</label>
                        <Radio.Group
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <Radio.Button value="present" style={{ width: '33.33%', textAlign: 'center' }}>
                                <CheckCircleOutlined /> Present
                            </Radio.Button>
                            <Radio.Button value="absent" style={{ width: '33.33%', textAlign: 'center' }}>
                                <CloseCircleOutlined /> Absent
                            </Radio.Button>
                            <Radio.Button value="excused" style={{ width: '33.33%', textAlign: 'center' }}>
                                <ExclamationCircleOutlined /> Excused
                            </Radio.Button>
                        </Radio.Group>
                    </div>

                    <div className="notes-section">
                        <label>Notes (Optional):</label>
                        <Input.TextArea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about this session..."
                            rows={3}
                        />
                    </div>

                    <div className="modal-actions">
                        <Button onClick={resetAndClose}>Cancel</Button>
                        <Button
                            type="primary"
                            loading={submitting}
                            onClick={handleSubmit}
                        >
                            Mark Attendance
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default AttendanceTracker;