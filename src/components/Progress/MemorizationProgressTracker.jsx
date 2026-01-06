// src/components/Progress/MemorizationProgressTracker.jsx
import React, { useState, useEffect } from 'react';
import { Slider, Button, Input, Modal, message, Tag } from 'antd';
import { CheckCircleFilled, TrophyFilled } from '@ant-design/icons';
import { updateMemorizationProgress, getStudentProgress } from '../../api/progress';
import ExamRecordModal from './ExamRecordModal';
import './MemorizationProgressTracker.css';

const MemorizationProgressTracker = ({
    enrollmentId,
    onProgressUpdate
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [showExamModal, setShowExamModal] = useState(false);
    const [pendingExamNumber, setPendingExamNumber] = useState(null);
    const [examCheckpoints, setExamCheckpoints] = useState([]);
    const [initialCurrentPage, setInitialCurrentPage] = useState(0);
    // State for data fetched from API
    const [levelInfo, setLevelInfo] = useState(null);
    const [examScores, setExamScores] = useState({});
    const [completionPercentage, setCompletionPercentage] = useState(0);

    // Calculate exam checkpoints based on level
    useEffect(() => {
        if (levelInfo) {
            const totalPages = levelInfo.endPage - levelInfo.startPage + 1;
            const checkpoints = [];

            const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

            for (let i = 1; i <= 5; i++) {
                const pageOffset = Math.round((totalPages * i) / 5);
                const examPage = levelInfo.startPage + pageOffset - 1;
                const rangeStart = levelInfo.startPage + Math.round((totalPages * (i - 1)) / 5);

                checkpoints.push({
                    number: i,
                    page: examPage,
                    label: `Exam ${i}`,
                    color: colors[i - 1],
                    pageRange: {
                        start: rangeStart,
                        end: examPage
                    }
                });
            }

            setExamCheckpoints(checkpoints);
        }
    }, [levelInfo]);

    const fetchProgress = async () => {
        try {
            const response = await getStudentProgress(enrollmentId);
            if (response.data && response.data.success) {
                const data = response.data.data;
                setLevelInfo(data.level_info);
                // Use the flat exam scores (sp.*) from the data root which matches component expectation
                setExamScores(data);
                setInitialCurrentPage(data.current_page);
                setCurrentPage(data.current_page);
                setCompletionPercentage(data.completion_percentage);
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
            message.error('Failed to load progress data');
        }
    };

    useEffect(() => {
        if (enrollmentId) {
            fetchProgress();
        }
    }, [enrollmentId]);

    // Calculate completion percentage within level
    const calculatePercentage = (page) => {
        if (!levelInfo) return 0;
        if (page < levelInfo.startPage) return 0;
        if (page > levelInfo.endPage) return 100;

        return Math.round(
            ((page - levelInfo.startPage) / (levelInfo.endPage - levelInfo.startPage)) * 100
        );
    };

    const currentPercentage = calculatePercentage(currentPage);

    const handlePageUpdate = async () => {
        // Check if reached exam checkpoint
        const checkpoint = examCheckpoints.find(cp => cp.page === currentPage);

        if (checkpoint && !examScores[`exam_${checkpoint.number}_score`]) {
            // Prompt to record exam
            Modal.confirm({
                title: `🎓 Exam ${checkpoint.number} Checkpoint Reached!`,
                content: (
                    <div>
                        <p>Student has completed page {currentPage}</p>
                        <p>Coverage: Pages {checkpoint.pageRange.start}-{checkpoint.pageRange.end}</p>
                        <p>Would you like to record the exam score now?</p>
                    </div>
                ),
                okText: 'Record Exam',
                cancelText: 'Update Page Only',
                onOk: () => {
                    setPendingExamNumber(checkpoint.number);
                    setShowExamModal(true);
                    savePageProgress();
                },
                onCancel: () => {
                    savePageProgress();
                }
            });
        } else {
            await savePageProgress();
        }
    };

    const savePageProgress = async () => {
        setSaving(true);
        try {
            const response = await updateMemorizationProgress(
                enrollmentId,
                currentPage,
                notes
            );

            if (response.data.success) {
                message.success(`Progress updated to page ${currentPage}!`);
                setNotes('');
                await fetchProgress();
                if (onProgressUpdate) onProgressUpdate();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update progress');
        } finally {
            setSaving(false);
        }
    };

    const handleExamRecorded = () => {
        setShowExamModal(false);
        setPendingExamNumber(null);
        fetchProgress();
        if (onProgressUpdate) onProgressUpdate();
    };

    const getExamStatus = (examNum) => {
        const score = examScores[`exam_${examNum}_score`];
        if (!score) return null;
        return score >= 90 ? 'passed' : 'failed';
    };

    if (!levelInfo) {
        return <div>Loading level information...</div>;
    }

    return (
        <div className="memorization-tracker">
            <div className="tracker-header">
                <div>
                    <h3 className="tracker-title">📖 Memorization Progress</h3>
                    <Tag color="blue" style={{ fontSize: '14px' }}>
                        {levelInfo.levelName} (Pages {levelInfo.startPage}-{levelInfo.endPage})
                    </Tag>
                </div>
                <div className="current-progress">
                    <div>
                        <span className="progress-label">Current Page:</span>
                        <span className="progress-value">{currentPage}</span>
                    </div>
                    <div>
                        <span className="progress-label">Completion:</span>
                        <span className="progress-value">{currentPercentage}%</span>
                    </div>
                </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="progress-visual">
                <div className="progress-bar-container">
                    <div
                        className="progress-fill"
                        style={{ width: `${currentPercentage}%` }}
                    />

                    {/* Exam Checkpoint Markers */}
                    {examCheckpoints.map(checkpoint => {
                        const status = getExamStatus(checkpoint.number);
                        // Calculate position as percentage within the level
                        const position = calculatePercentage(checkpoint.page);

                        return (
                            <div
                                key={checkpoint.number}
                                className={`exam-marker ${status || ''}`}
                                style={{
                                    left: `${position}%`,
                                    borderColor: checkpoint.color
                                }}
                                title={`${checkpoint.label} - Page ${checkpoint.page}`}
                            >
                                {status === 'passed' ? (
                                    <CheckCircleFilled style={{ color: '#10b981' }} />
                                ) : status === 'failed' ? (
                                    <span style={{ color: '#ef4444' }}>✗</span>
                                ) : (
                                    <span style={{ color: checkpoint.color }}>{checkpoint.number}</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Page Number Labels */}
                <div className="page-labels">
                    <span>{levelInfo.startPage}</span>
                    {examCheckpoints.map(cp => (
                        <span key={cp.number} style={{ color: cp.color }}>
                            {cp.page}
                        </span>
                    ))}
                </div>
            </div>

            {/* Page Slider */}
            <div className="page-slider-section">
                <label>Update Current Page:</label>
                <Slider
                    min={levelInfo.startPage}
                    max={levelInfo.endPage}
                    value={currentPage}
                    onChange={setCurrentPage}
                    marks={examCheckpoints.reduce((acc, cp) => {
                        acc[cp.page] = {
                            label: cp.page,
                            style: { color: cp.color }
                        };
                        return acc;
                    }, {
                        [levelInfo.startPage]: levelInfo.startPage,
                        [levelInfo.endPage]: levelInfo.endPage
                    })}
                    tooltip={{
                        formatter: (value) => `Page ${value} (${calculatePercentage(value)}%)`
                    }}
                />
            </div>

            {/* Notes Input */}
            <div className="notes-section">
                <label>Progress Notes (Optional):</label>
                <Input.TextArea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about student's performance..."
                    rows={3}
                />
            </div>

            {/* Action Button */}
            <Button
                type="primary"
                size="large"
                loading={saving}
                onClick={handlePageUpdate}
                disabled={currentPage === initialCurrentPage}
                style={{ width: '100%', marginTop: '16px' }}
            >
                Update Progress to Page {currentPage}
            </Button>

            {/* Exam Status Summary */}
            <div className="exam-status-summary">
                <h4>📋 Exam Status</h4>
                <div className="exam-cards">
                    {examCheckpoints.map(checkpoint => {
                        const score = examScores[`exam_${checkpoint.number}_score`];
                        const status = getExamStatus(checkpoint.number);

                        return (
                            <div
                                key={checkpoint.number}
                                className={`exam-card ${status || 'pending'}`}
                                onClick={() => {
                                    if (currentPage >= checkpoint.page) {
                                        setPendingExamNumber(checkpoint.number);
                                        setShowExamModal(true);
                                    }
                                }}
                                style={{
                                    borderLeftColor: checkpoint.color,
                                    cursor: currentPage >= checkpoint.page ? 'pointer' : 'not-allowed',
                                    opacity: currentPage >= checkpoint.page ? 1 : 0.5
                                }}
                            >
                                <div className="exam-card-header">
                                    <span className="exam-label">{checkpoint.label}</span>
                                    {status === 'passed' && <CheckCircleFilled style={{ color: '#10b981' }} />}
                                    {status === 'failed' && <span style={{ color: '#ef4444' }}>✗</span>}
                                </div>
                                <div className="exam-card-body">
                                    <div className="exam-pages">
                                        Pages {checkpoint.pageRange.start}-{checkpoint.pageRange.end}
                                    </div>
                                    {score ? (
                                        <div className={`exam-score ${status}`}>
                                            Score: {score}/100
                                        </div>
                                    ) : (
                                        <div className="exam-pending">
                                            {currentPage >= checkpoint.page ? 'Click to record' : `Reach page ${checkpoint.page}`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Final Exam Card */}
                    <div
                        className={`exam-card final ${examScores.final_exam_score ? 'completed' : 'pending'}`}
                        onClick={() => {
                            const allPassed = examCheckpoints.every(
                                cp => examScores[`exam_${cp.number}_score`] >= 90
                            );
                            if (allPassed && currentPage === levelInfo.endPage) {
                                setPendingExamNumber(6);
                                setShowExamModal(true);
                            } else {
                                message.warning(`Complete all exams and reach page ${levelInfo.endPage} first`);
                            }
                        }}
                    >
                        <div className="exam-card-header">
                            <span className="exam-label">
                                <TrophyFilled style={{ marginRight: 8 }} />
                                Final Exam
                            </span>
                        </div>
                        <div className="exam-card-body">
                            <div className="exam-pages">Level Completion</div>
                            {examScores.final_exam_score ? (
                                <div className={`exam-score ${examScores.final_exam_score >= 90 ? 'passed' : 'failed'}`}>
                                    Score: {examScores.final_exam_score}/100
                                </div>
                            ) : (
                                <div className="exam-pending">Complete all 5 exams</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Record Modal */}
            <ExamRecordModal
                visible={showExamModal}
                onClose={() => {
                    setShowExamModal(false);
                    setPendingExamNumber(null);
                }}
                enrollmentId={enrollmentId}
                examNumber={pendingExamNumber}
                examCheckpoint={examCheckpoints.find(cp => cp.number === pendingExamNumber)}
                onExamRecorded={handleExamRecorded}
            />
        </div>
    );
};

export default MemorizationProgressTracker;