// TeacherSelectionModal.jsx
import React, { useState } from "react";
import { Modal, Button, Card, Avatar, Tag, Progress, Tooltip, Alert, Row, Col, Space } from "antd";
import {
    CheckCircleOutlined,
    TrophyOutlined,
    ClockCircleOutlined,
    StarFilled,
    UserOutlined,
    EnvironmentOutlined,
    SafetyCertificateOutlined
} from "@ant-design/icons";
import "./TeacherSelectionModal.css";

const TeacherSelectionModal = ({ isOpen, onClose, teachers, onSelect, courseData }) => {
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const getRecommendationColor = (level) => {
        switch (level) {
            case 'highly_recommended':
                return 'success';
            case 'recommended':
                return 'processing';
            case 'suitable':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getRecommendationText = (level) => {
        switch (level) {
            case 'highly_recommended':
                return 'Highly Recommended';
            case 'recommended':
                return 'Recommended';
            case 'suitable':
                return 'Suitable';
            default:
                return 'Available';
        }
    };

    const handleSelect = () => {
        if (!selectedTeacher) {
            alert('Please select a teacher');
            return;
        }
        onSelect(selectedTeacher);
    };

    if (!teachers || teachers.length === 0) {
        return (
            <Modal
                title="No Teachers Available"
                open={isOpen}
                onCancel={onClose}
                footer={[
                    <Button key="close" onClick={onClose}>
                        Close
                    </Button>
                ]}
                width={600}
            >
                <Alert
                    message="No Teachers Found"
                    description="No teachers meet all the mandatory requirements (governorate match, gender match if specified, and schedule availability)."
                    type="info"
                    showIcon
                />
            </Modal>
        );
    }

    return (
        <Modal
            title={
                <div className="modal-header">
                    <div>
                        <h2>Suggested Teachers</h2>
                        <p className="subtitle">
                            {teachers.length} teachers meet all mandatory requirements
                            <br />
                            <small>Sorted by recommendation score (highest first)</small>
                        </p>
                    </div>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={900}
            style={{ top: 20 }}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="select"
                    type="primary"
                    onClick={handleSelect}
                    disabled={!selectedTeacher}
                >
                    Select Teacher
                </Button>
            ]}
            className="teacher-selection-modal"
        >
            <div className="teachers-list-container">
                {teachers.map((teacher) => (
                    <Card
                        key={teacher.id}
                        className={`teacher-card ${selectedTeacher?.id === teacher.id ? 'selected' : ''}`}
                        onClick={() => setSelectedTeacher(teacher)}
                    >
                        <Row gutter={16} align="middle">
                            <Col xs={24} md={4}>
                                <div className="teacher-avatar-section">
                                    <Avatar
                                        size={60}
                                        icon={<UserOutlined />}
                                        className={`teacher-avatar ${getRecommendationColor(teacher.recommendation_level)}`}
                                    />
                                    <Tag
                                        color={getRecommendationColor(teacher.recommendation_level)}
                                        className="recommendation-tag"
                                    >
                                        {getRecommendationText(teacher.recommendation_level)}
                                    </Tag>
                                </div>
                            </Col>

                            <Col xs={24} md={10}>
                                <div className="teacher-info">
                                    <h3>{teacher.full_name}</h3>
                                    <div className="contact-info">
                                        <span>{teacher.email}</span>
                                        {teacher.phone && <span> • {teacher.phone}</span>}
                                    </div>

                                    <div className="must-requirements">
                                        <Space size="middle" className="requirement-icons">
                                            <Tooltip title="Active">
                                                <span className="requirement-met">
                                                    <EnvironmentOutlined /> Active ✓
                                                </span>
                                            </Tooltip>

                                            <Tooltip title="Gender Match">
                                                <span className="requirement-met">
                                                    <UserOutlined /> Gender ✓
                                                </span>
                                            </Tooltip>

                                            <Tooltip title="Schedule Available">
                                                <span className="requirement-met">
                                                    <ClockCircleOutlined /> Schedule ✓
                                                </span>
                                            </Tooltip>
                                        </Space>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={24} md={6}>
                                <div className="bonus-points">
                                    <div className="bonus-item">
                                        <TrophyOutlined />
                                        <span>{teacher.years_experience || 0} years exp</span>
                                    </div>

                                    {(teacher.has_tajweed_certificate || teacher.has_sharea_certificate) && (
                                        <div className="bonus-item">
                                            <SafetyCertificateOutlined />
                                            <span>
                                                {teacher.has_tajweed_certificate && 'Tajweed '}
                                                {teacher.has_tajweed_certificate && teacher.has_sharea_certificate && '+ '}
                                                {teacher.has_sharea_certificate && 'Sharea'}
                                            </span>
                                        </div>
                                    )}

                                    <div className="bonus-item">
                                        <ClockCircleOutlined />
                                        <span>{teacher.active_courses_count || 0} active courses</span>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={24} md={4}>
                                <div className="match-score-section">
                                    <Tooltip title="Recommendation Score">
                                        <div className="score-display">
                                            <StarFilled className="star-icon" />
                                            <span className="score">{teacher.match_score || 0}</span>
                                            <span className="score-label">/100</span>
                                        </div>
                                    </Tooltip>
                                    <Progress
                                        percent={teacher.match_score || 0}
                                        size="small"
                                        strokeColor={
                                            getRecommendationColor(teacher.recommendation_level) === 'success' ? '#52c41a' :
                                                getRecommendationColor(teacher.recommendation_level) === 'processing' ? '#1890ff' :
                                                    getRecommendationColor(teacher.recommendation_level) === 'warning' ? '#faad14' : '#d9d9d9'
                                        }
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>
        </Modal>
    );
};

export default TeacherSelectionModal;