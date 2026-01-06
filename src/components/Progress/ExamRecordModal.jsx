// src/components/Progress/ExamRecordModal.jsx
import React, { useState } from 'react';
import { Modal, InputNumber, Input, Button, message, Alert } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { recordExamScore, recordFinalExam } from '../../api/progress';
import './ExamRecordModal.css';

const ExamRecordModal = ({
    visible,
    onClose,
    enrollmentId,
    examNumber, // 1-5 for regular exams, 6 for final
    onExamRecorded
}) => {
    const [score, setScore] = useState(null);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isFinalExam = examNumber === 6;
    const examTitle = isFinalExam ? 'Final Graduation Exam' : `Exam ${examNumber}`;
    const pageRange = isFinalExam
        ? 'Complete Course'
        : `Pages ${(examNumber - 1) * 20 + 1}-${examNumber * 20}`;

    const handleSubmit = async () => {
        if (score === null || score < 0 || score > 100) {
            message.error('Please enter a valid score (0-100)');
            return;
        }

        setSubmitting(true);
        try {
            let response;

            if (isFinalExam) {
                response = await recordFinalExam(enrollmentId, score, notes);
            } else {
                response = await recordExamScore(enrollmentId, examNumber, score, notes);
            }

            if (response.data.success) {
                const passed = score >= 90;

                if (isFinalExam && passed) {
                    message.success('🎉 Congratulations! Student has graduated!');
                } else if (passed) {
                    message.success(`✅ Exam ${examNumber} passed with score ${score}/100`);
                } else {
                    message.warning(`Student scored ${score}/100. Score must be ≥90 to pass.`);
                }

                // 🔔 FIREBASE NOTIFICATION: Exam result recorded
                // await sendFirebaseNotification({
                //     type: 'exam_result',
                //     enrollmentId,
                //     examNumber,
                //     score,
                //     passed,
                //     isFinalExam
                // });

                resetAndClose();
                if (onExamRecorded) onExamRecorded();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to record exam');
        } finally {
            setSubmitting(false);
        }
    };

    const resetAndClose = () => {
        setScore(null);
        setNotes('');
        onClose();
    };

    const passed = score >= 90;
    const showPassFailIndicator = score !== null;

    return (
        <Modal
            open={visible}
            onCancel={resetAndClose}
            footer={null}
            width={500}
            className="exam-record-modal"
        >
            <div className="modal-header">
                {isFinalExam && <TrophyOutlined className="trophy-icon" />}
                <h2>{examTitle}</h2>
                <p className="page-range">{pageRange}</p>
            </div>

            {isFinalExam && (
                <Alert
                    message="Final Graduation Exam"
                    description="This is the final exam. Student must score ≥90 to graduate."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 20 }}
                />
            )}

            <div className="score-input-section">
                <label>
                    Exam Score (0-100) <span className="required">*</span>
                </label>
                <InputNumber
                    min={0}
                    max={100}
                    value={score}
                    onChange={setScore}
                    placeholder="Enter score"
                    style={{ width: '100%' }}
                    size="large"
                />

                {showPassFailIndicator && (
                    <div className={`pass-fail-indicator ${passed ? 'passed' : 'failed'}`}>
                        {passed ? '✅ PASSED (≥90)' : '❌ FAILED (<90)'}
                    </div>
                )}
            </div>

            <div className="notes-input-section">
                <label>Teacher Notes (Optional)</label>
                <Input.TextArea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about the exam performance..."
                    rows={4}
                />
            </div>

            <div className="modal-actions">
                <Button onClick={resetAndClose} size="large">
                    Cancel
                </Button>
                <Button
                    type="primary"
                    size="large"
                    loading={submitting}
                    onClick={handleSubmit}
                    disabled={score === null}
                >
                    Record Exam
                </Button>
            </div>
        </Modal>
    );
};

export default ExamRecordModal;