
// src/components/Progress/ProgressHistoryTimeline.jsx
import React, { useState, useEffect } from 'react';
import { Timeline, Spin, Empty } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getProgressHistory } from '../../api/progress';
import './ProgressHistoryTimeline.css';

const ProgressHistoryTimeline = ({ enrollmentId }) => {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, [enrollmentId]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await getProgressHistory(enrollmentId);
            if (response.data.success) {
                setHistory(response.data.data);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spin tip="Loading history..." />;
    }

    if (history.length === 0) {
        return <Empty description="No exam records yet" />;
    }

    const getTimelineIcon = (milestone) => {
        if (milestone.milestone_type === 'graduation') {
            return <TrophyOutlined style={{ color: '#f59e0b', fontSize: 20 }} />;
        }
        return milestone.passed ? (
            <CheckCircleOutlined style={{ color: '#10b981', fontSize: 20 }} />
        ) : (
            <CloseCircleOutlined style={{ color: '#ef4444', fontSize: 20 }} />
        );
    };

    const getTimelineColor = (milestone) => {
        if (milestone.milestone_type === 'graduation') return 'orange';
        return milestone.passed ? 'green' : 'red';
    };

    const getMilestoneLabel = (type) => {
        const labels = {
            'exam_1': 'Exam 1 (Pages 1-20)',
            'exam_2': 'Exam 2 (Pages 21-40)',
            'exam_3': 'Exam 3 (Pages 41-60)',
            'exam_4': 'Exam 4 (Pages 61-80)',
            'exam_5': 'Exam 5 (Pages 81-100)',
            'final_exam': 'Final Graduation Exam',
            'graduation': '🎓 Graduation'
        };
        return labels[type] || type;
    };

    const timelineItems = history.map(milestone => ({
        color: getTimelineColor(milestone),
        dot: getTimelineIcon(milestone),
        children: (
            <div className="timeline-item-content">
                <div className="milestone-header">
                    <h4>{getMilestoneLabel(milestone.milestone_type)}</h4>
                    <span className="milestone-date">
                        {dayjs(milestone.achieved_at).format('MMM D, YYYY')}
                    </span>
                </div>

                {milestone.score !== null && (
                    <div className={`milestone-score ${milestone.passed ? 'passed' : 'failed'}`}>
                        Score: {milestone.score}/100
                    </div>
                )}

                {milestone.notes && (
                    <div className="milestone-notes">
                        <strong>Notes:</strong> {milestone.notes}
                    </div>
                )}

                <div className="milestone-footer">
                    Recorded by: {milestone.recorded_by_name}
                </div>
            </div>
        )
    }));

    return (
        <div className="progress-history-timeline">
            <h3>📜 Exam History</h3>
            <Timeline items={timelineItems} />
        </div>
    );
};

export default ProgressHistoryTimeline;