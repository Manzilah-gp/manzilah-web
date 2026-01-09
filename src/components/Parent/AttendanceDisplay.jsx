// ============================================
// AttendanceDisplay - Parent View
// Read-only display of child's attendance
// No ability to mark attendance (teacher only)
// ============================================

import React from 'react';
import { Calendar, Badge, Progress } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './AttendanceDisplay.css';

const AttendanceDisplay = ({ attendanceData = {} }) => {
    const {
        records = [],
        present_count = 0,
        absent_count = 0,
        excused_count = 0,
        totalSessions = 0,
        completionPercentage = 0
    } = attendanceData;

    // Convert attendance records to map for Calendar lookup
    const attendanceMap = {};
    records.forEach(record => {
        const dateKey = dayjs(record.attendance_date).format('YYYY-MM-DD');
        attendanceMap[dateKey] = record;
    });

    // Use backend provided stats
    const presentCount = Number(present_count) || 0;
    const absentCount = Number(absent_count) || 0;
    const excusedCount = Number(excused_count) || 0;
    const attendanceRate = Number(completionPercentage) || 0;

    /**
     * Render attendance badge on calendar dates
     */
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
                {record.notes && (
                    <div className="attendance-notes-tooltip">
                        {record.notes}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="attendance-display">
            <div className="display-header">
                <h3 className="display-title">📅 Attendance Record</h3>
            </div>

            {/* Stats Summary Cards */}
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

            {/* Attendance Rate Progress Bar */}
            <div className="attendance-progress">
                <div className="progress-header">
                    <span className="progress-label">Attendance Rate</span>
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
                    strokeWidth={12}
                />
                <div className="progress-footer">
                    {presentCount} / {totalSessions} sessions attended
                </div>
            </div>

            {/* Read-Only Calendar View */}
            <div className="attendance-calendar">
                <div className="calendar-info">
                    <p className="info-text">
                        📌 View your child's attendance history below. 
                        Only teachers can mark attendance.
                    </p>
                </div>
                <Calendar
                    cellRender={dateCellRender}
                    // No onSelect - read-only
                />
            </div>
        </div>
    );
};

export default AttendanceDisplay;