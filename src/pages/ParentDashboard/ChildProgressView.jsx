// ============================================
// ChildProgressView - Parent View
// Read-only view of child's progress in a course
// Similar to StudentProgressView but without edit capabilities
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tabs, Button, Spin, Alert, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getChildProgress, getChildProgressHistory } from '../../api/parentProgressApi';
import MemorizationProgressDisplay from '../../components/Parent/MemorizationProgressDisplay';
import AttendanceDisplay from '../../components/Parent/AttendanceDisplay';
import ProgressHistoryDisplay from '../../components/Parent/ProgressHistoryDisplay';

import './ChildProgressView.css';

const ChildProgressView = () => {
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
            const response = await getChildProgress(enrollmentId);
            if (response.data.success) {
                console.log('Child progress data:', response.data.data);
                setProgressData(response.data.data);
            }
        } catch (error) {
            if (error.response?.status === 403) {
                message.error('You do not have access to view this progress');
                navigate('/parent/children');
            } else {
                message.error('Failed to load progress data');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="child-progress-view">
                <div className="loading-container">
                    <Spin size="large" tip="Loading progress..." />
                </div>
            </div>
        );
    }

    if (!progressData) {
        return (
            <div className="child-progress-view">
                <div className="error-container">
                    <Alert
                        message="Progress Not Found"
                        description="Unable to load progress data for this enrollment."
                        type="error"
                        showIcon
                    />
                    <Button
                        onClick={() => navigate('/parent/my-children')}
                        style={{ marginTop: 16 }}
                    >
                        Back to My Children
                    </Button>
                </div>
            </div>
        );
    }

    const isMemorizationCourse = progressData.course_type === 'memorization';

    return (
        <div className="child-progress-view">
            {/* Header */}
            <div className="progress-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    size="large"
                >
                    Back
                </Button>
                <div className="header-info">
                    <h1>{progressData.student_name}</h1>
                    <p className="course-name">{progressData.course_name}</p>
                    <p className="course-details">
                        <span className="course-type">
                            {progressData.course_type.charAt(0).toUpperCase() +
                                progressData.course_type.slice(1)}
                        </span>
                        {progressData.teacher_name && (
                            <>
                                <span className="separator">•</span>
                                <span className="teacher">Teacher: {progressData.teacher_name}</span>
                            </>
                        )}
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
                                <MemorizationProgressDisplay
                                    progressData={progressData}
                                />
                            ) : (
                                <AttendanceDisplay
                                    attendanceData={progressData.attendance || {}}
                                />
                            )
                        },
                        {
                            key: 'history',
                            label: '📜 History',
                            children: (
                                <ProgressHistoryDisplay
                                    enrollmentId={enrollmentId}
                                    apiCall={getChildProgressHistory}
                                />
                            )
                        }

                    ]}
                />
            </Card>
        </div>
    );
};

export default ChildProgressView;