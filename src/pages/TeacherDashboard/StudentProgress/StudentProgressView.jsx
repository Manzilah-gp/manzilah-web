// src/pages/TeacherDashboard/StudentProgressView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tabs, Button, Spin, Alert, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getStudentProgress } from '../../../api/progress';
import MemorizationProgressTracker from '../../../components/Progress/MemorizationProgressTracker';
import AttendanceTracker from '../../../components/Progress/AttendanceTracker';
import ProgressHistoryTimeline from '../../../components/Progress/ProgressHistoryTimeline';
import './StudentProgressView.css';

const StudentProgressView = () => {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [progressData, setProgressData] = useState(null);

    useEffect(() => {
        fetchProgress();
    }, [enrollmentId]);

    const fetchProgress = async () => {
        setLoading(true);
        try {
            const response = await getStudentProgress(enrollmentId);
            if (response.data.success) {
                console.log('progressData', response.data.data);
                setProgressData(response.data.data);

            }
        } catch (error) {
            message.error('Failed to load student progress');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading student progress..." />
            </div>
        );
    }

    if (!progressData) {
        return (
            <div className="error-container">
                <Alert
                    message="Progress Not Found"
                    description="Unable to load student progress data."
                    type="error"
                    showIcon
                />
                <Button onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
                    Go Back
                </Button>
            </div>
        );
    }

    const isMemorizationCourse = progressData.course_type === 'memorization';

    return (
        <div className="student-progress-view">
            {/* Header */}
            <div className="progress-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                <div className="header-info">
                    <h1>{progressData.student_name}</h1>
                    <p className="course-name">{progressData.course_name}</p>
                    <p className="course-type">
                        {progressData.course_type.charAt(0).toUpperCase() +
                            progressData.course_type.slice(1)} Course
                    </p>
                </div>
            </div>

            {/* Progress Content */}
            <Card className="progress-card">
                <Tabs
                    defaultActiveKey="progress"
                    items={[
                        {
                            key: 'progress',
                            label: '📊 Progress',
                            children: isMemorizationCourse ? (
                                <MemorizationProgressTracker
                                    enrollmentId={enrollmentId}
                                    initialProgress={progressData.current_page || 0}
                                    examScores={progressData.exams || {}}
                                    levelInfo={progressData.level_info}
                                    onProgressUpdate={fetchProgress}
                                />
                            ) : (
                                <AttendanceTracker
                                    enrollmentId={enrollmentId}
                                    attendanceData={progressData.attendance || {}}
                                    onAttendanceUpdate={fetchProgress}
                                />
                            )
                        },
                        {
                            key: 'history',
                            label: '📜 History',
                            children: (
                                <ProgressHistoryTimeline
                                    enrollmentId={enrollmentId}
                                    
                                />
                            )
                        }
                    ]}
                />
            </Card>
        </div>
    );
};

export default StudentProgressView;