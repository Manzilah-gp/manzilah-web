// ============================================
// MemorizationProgressDisplay - Parent View
// Read-only display of child's memorization progress
// No edit buttons or interactivity
// ============================================

import React from 'react';
import { Progress, Tag } from 'antd';
import { TrophyOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './MemorizationProgressDisplay.css';

const MemorizationProgressDisplay = ({ progressData }) => {
    const {
        current_page = 0,
        level_start_page = 0,
        level_end_page = 100,
        completion_percentage = 0,
        exams = {},
        is_graduated = false,
        level_info = {}
    } = progressData || {};

    // Calculate exam checkpoint markers (every 20 pages)
    const examCheckpoints = [20, 40, 60, 80, 100];

    // Get exam scores from exams object
    const examScores = {
        1: exams.exam_1_score,
        2: exams.exam_2_score,
        3: exams.exam_3_score,
        4: exams.exam_4_score,
        5: exams.exam_5_score
    };

    const finalExamScore = exams.final_exam_score;

    // Calculate progress within level range
    const levelRange = level_end_page - level_start_page;
    const progressInLevel = current_page - level_start_page;
    const progressPercentage = levelRange > 0
        ? Math.min(100, (progressInLevel / levelRange) * 100)
        : 0;

    /**
     * Determine exam status based on score
     */
    const getExamStatus = (score) => {
        if (score === null || score === undefined) return 'pending';
        return score >= 90 ? 'passed' : 'failed';
    };

    return (
        <div className="memorization-progress-display">
            {/* Header */}
            <div className="display-header">
                <h3 className="display-title">📖 Memorization Progress</h3>
                <div className="current-progress">
                    <span className="progress-label">Current Page:</span>
                    <span className="progress-value">{current_page}/{level_end_page}</span>
                </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="progress-visual">
                <div className="progress-bar-container">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                    />

                    {/* Exam Checkpoint Markers (read-only, no click) */}
                    {examCheckpoints.map((checkpoint, idx) => {
                        const examNum = idx + 1;
                        const status = getExamStatus(examScores[examNum]);
                        const position = ((checkpoint - level_start_page) / levelRange) * 100;

                        if (position < 0 || position > 100) return null;

                        return (
                            <div
                                key={checkpoint}
                                className={`exam-marker ${status}`}
                                style={{ left: `${position}%` }}
                                title={`Exam ${examNum}: ${examScores[examNum] !== null && examScores[examNum] !== undefined ? examScores[examNum] + '/100' : 'Not taken'}`}
                            >
                                {examNum}
                            </div>
                        );
                    })}
                </div>

                <div className="page-labels">
                    <span>Page {level_start_page}</span>
                    <span>Page {level_end_page}</span>
                </div>
            </div>

            {/* Current Page Info */}
            <div className="current-page-info">
                <div className="info-item">
                    <span className="info-label">Current Page:</span>
                    <span className="info-value">{current_page}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Completion:</span>
                    <span className="info-value">{Math.round(progressPercentage) || 0}%</span>
                </div>
                {level_info?.level_name && (
                    <div className="info-item">
                        <span className="info-label">Level:</span>
                        <span className="info-value">{level_info.level_name}</span>
                    </div>
                )}
            </div>

            {/* Exam Status Summary */}
            <div className="exam-status-summary">
                <h4>Exam Results</h4>
                <div className="exam-cards">
                    {/* Regular Exams 1-5 */}
                    {[1, 2, 3, 4, 5].map(examNum => {
                        const score = examScores[examNum];
                        const status = getExamStatus(score);
                        const pageRange = `Pages ${(examNum - 1) * 20 + 1}-${examNum * 20}`;

                        return (
                            <div key={examNum} className={`exam-card ${status}`}>
                                <div className="exam-card-header">
                                    <span className="exam-label">Exam {examNum}</span>
                                    {status === 'passed' && (
                                        <CheckCircleOutlined style={{ color: '#10b981', fontSize: 20 }} />
                                    )}
                                    {status === 'failed' && (
                                        <CloseCircleOutlined style={{ color: '#ef4444', fontSize: 20 }} />
                                    )}
                                </div>
                                <div className="exam-card-body">
                                    <p className="exam-pages">{pageRange}</p>
                                    {score !== null && score !== undefined ? (
                                        <div className={`exam-score ${status}`}>
                                            {score}/100
                                        </div>
                                    ) : (
                                        <div className="exam-pending">Not taken yet</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Final Exam Card */}
                    <div className={`exam-card final ${finalExamScore !== null && finalExamScore !== undefined ? 'completed' : ''}`}>
                        <div className="exam-card-header">
                            <span className="exam-label">
                                <TrophyOutlined /> Final Exam
                            </span>
                            {finalExamScore >= 90 && (
                                <CheckCircleOutlined style={{ color: '#10b981', fontSize: 20 }} />
                            )}
                        </div>
                        <div className="exam-card-body">
                            <p className="exam-pages">Complete Course</p>
                            {finalExamScore !== null && finalExamScore !== undefined ? (
                                <div className={`exam-score ${finalExamScore >= 90 ? 'passed' : 'failed'}`}>
                                    {finalExamScore}/100
                                </div>
                            ) : (
                                <div className="exam-pending">Not taken yet</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Graduation Status Banner */}
            {is_graduated && (
                <div className="graduation-banner">
                    <TrophyOutlined className="trophy-icon" />
                    <div className="graduation-text">
                        <h3>🎉 Graduated!</h3>
                        <p>Your child has successfully completed this course</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemorizationProgressDisplay;