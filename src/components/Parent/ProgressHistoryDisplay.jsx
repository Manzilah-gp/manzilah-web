// ============================================
// ProgressHistoryDisplay - FIXED VERSION
// Works for BOTH Parent and Student views
// Parents: See their children's exam history
// Students: See their own exam history
// ============================================

import React, { useState, useEffect } from 'react';
import { Timeline, Spin, Empty, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './ProgressHistoryDisplay.css';

/**
 * Display progress history timeline
 * @param {number} enrollmentId - The enrollment to show history for
 * @param {function} apiCall - Custom API function to fetch history
 *                             - For students: pass getMyProgressHistory
 *                             - For parents: pass getChildProgressHistory
 */
const ProgressHistoryDisplay = ({ enrollmentId, apiCall }) => {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, [enrollmentId]);

    /**
     * Fetch progress history from backend
     * Uses the API function passed via props
     */
    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Use the custom API function passed from parent component
            const response = await apiCall(enrollmentId);
            
            if (response.data.success) {
                setHistory(response.data.data);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get appropriate icon for milestone type
     */
    const getTimelineIcon = (milestone) => {
        if (milestone.milestone_type === 'graduation' || milestone.milestone_type === 'final_exam') {
            return <TrophyOutlined style={{ color: '#f59e0b', fontSize: 20 }} />;
        }
        return milestone.passed ? (
            <CheckCircleOutlined style={{ color: '#10b981', fontSize: 20 }} />
        ) : (
            <CloseCircleOutlined style={{ color: '#ef4444', fontSize: 20 }} />
        );
    };

    /**
     * Get color for timeline based on milestone status
     */
    const getTimelineColor = (milestone) => {
        if (milestone.milestone_type === 'graduation' || milestone.milestone_type === 'final_exam') {
            return 'orange';
        }
        return milestone.passed ? 'green' : 'red';
    };

    /**
     * Get human-readable label for milestone type
     */
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
        return labels[type] || type.replace('_', ' ').toUpperCase();
    };

    if (loading) {
        return (
            <div className="progress-history-display">
                <div className="loading-container">
                    <Spin size="large" tip="Loading exam history..." />
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="progress-history-display">
                <Empty 
                    description="No exam records yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    /**
     * Build timeline items from history
     */
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

                {milestone.score !== null && milestone.score !== undefined && (
                    <div className="milestone-score-section">
                        <div className={`milestone-score ${milestone.passed ? 'passed' : 'failed'}`}>
                            Score: {milestone.score}/100
                        </div>
                        <Tag 
                            color={milestone.passed ? 'success' : 'error'}
                            className="status-tag"
                        >
                            {milestone.passed ? '✓ Passed' : '✗ Failed'}
                        </Tag>
                    </div>
                )}

                {milestone.notes && (
                    <div className="milestone-notes">
                        <strong>Teacher's Notes:</strong>
                        <p>{milestone.notes}</p>
                    </div>
                )}

                <div className="milestone-footer">
                    <span>Recorded by: {milestone.recorded_by_name || 'Teacher'}</span>
                </div>
            </div>
        )
    }));

    return (
        <div className="progress-history-display">
            <div className="display-header">
                <h3 className="display-title">📜 Exam History</h3>
                <p className="display-subtitle">
                    Track exam progress and achievements over time
                </p>
            </div>
            <Timeline 
                items={timelineItems}
                mode="left"
            />
        </div>
    );
};

export default ProgressHistoryDisplay;