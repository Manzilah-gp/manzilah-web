// PURPOSE: Edit section for teacher-specific profile data
// REASON: Allow teachers to update certifications, expertise, and availability

import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Select,
    Checkbox,
    Button,
    Card,
    Row,
    Col,
    TimePicker,
    InputNumber,
    Divider,
    Space,
    message,
    Spin
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    SafetyCertificateOutlined,
    BookOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import {
    getTeacherProfile,
    updateCompleteTeacherProfile,
    getCourseTypes,
    getMemorizationLevels
} from '../../api/teacherProfile';
import './TeacherProfileEditSection.css';

const { Option } = Select;

/**
 * TeacherProfileEditSection Component
 * Displays in ProfileDetails page when user is a teacher
 * REASON: Centralize teacher-specific profile editing
 */
const TeacherProfileEditSection = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [courseTypes, setCourseTypes] = useState([]);
    const [memorizationLevels, setMemorizationLevels] = useState([]);
    const [expertise, setExpertise] = useState([]);
    const [availability, setAvailability] = useState([]);

    const daysOfWeek = [
        { value: 'sunday', label: 'Sunday' },
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' }
    ];

    // Load teacher profile data on component mount
    useEffect(() => {
        loadTeacherProfile();
        loadCourseTypes();
        loadMemorizationLevels();
    }, []);

    /**
     * Load teacher profile from API
     * REASON: Pre-fill form with existing data
     */
    const loadTeacherProfile = async () => {
        try {
            setLoading(true);
            const response = await getTeacherProfile();
            
            if (response.success) {
                const { profile } = response.data;
                
                // Set form values for certifications
                form.setFieldsValue({
                    has_tajweed_certificate: profile.certifications?.has_tajweed_certificate || false,
                    has_sharea_certificate: profile.certifications?.has_sharea_certificate || false,
                    tajweed_certificate_url: profile.certifications?.tajweed_certificate_url || '',
                    sharea_certificate_url: profile.certifications?.sharea_certificate_url || ''
                });

                // Set expertise state
                if (profile.expertise && profile.expertise.length > 0) {
                    setExpertise(profile.expertise.map(exp => ({
                        course_type_id: exp.course_type_id,
                        is_memorization_selected: exp.is_memorization_selected || false,
                        max_mem_level_id: exp.max_mem_level_id || null,
                        years_experience: exp.years_experience || 0,
                        hourly_rate_cents: exp.hourly_rate_cents || 0
                    })));
                }

                // Set availability state with parsed times
                if (profile.availability && profile.availability.length > 0) {
                    setAvailability(profile.availability.map(slot => ({
                        day_of_week: slot.day_of_week,
                        start_time: slot.start_time,
                        end_time: slot.end_time
                    })));
                }
            }
        } catch (error) {
            message.error('Failed to load teacher profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load course types for dropdown
     * REASON: Allow teachers to select their teaching areas
     */
    const loadCourseTypes = async () => {
        try {
            const response = await getCourseTypes();
            if (response.success) {
                setCourseTypes(response.data);
            }
        } catch (error) {
            console.error('Error loading course types:', error);
        }
    };

    /**
     * Load memorization levels for dropdown
     * REASON: Allow teachers to specify their qualification level
     */
    const loadMemorizationLevels = async () => {
        try {
            const response = await getMemorizationLevels();
            if (response.success) {
                setMemorizationLevels(response.data);
            }
        } catch (error) {
            console.error('Error loading memorization levels:', error);
        }
    };

    /**
     * Add new expertise entry
     * REASON: Teachers can teach multiple course types
     */
    const addExpertise = () => {
        setExpertise([...expertise, {
            course_type_id: null,
            is_memorization_selected: false,
            max_mem_level_id: null,
            years_experience: 0,
            hourly_rate_cents: 0
        }]);
    };

    /**
     * Remove expertise entry
     * REASON: Allow teachers to remove course types they no longer teach
     */
    const removeExpertise = (index) => {
        const newExpertise = expertise.filter((_, i) => i !== index);
        setExpertise(newExpertise);
    };

    /**
     * Update expertise field
     * REASON: Handle changes to individual expertise entries
     */
    const updateExpertise = (index, field, value) => {
        const newExpertise = [...expertise];
        newExpertise[index][field] = value;
        setExpertise(newExpertise);
    };

    /**
     * Add new availability slot
     * REASON: Teachers can have multiple time slots per week
     */
    const addAvailability = () => {
        setAvailability([...availability, {
            day_of_week: 'sunday',
            start_time: '09:00',
            end_time: '10:00'
        }]);
    };

    /**
     * Remove availability slot
     * REASON: Allow teachers to remove time slots
     */
    const removeAvailability = (index) => {
        const newAvailability = availability.filter((_, i) => i !== index);
        setAvailability(newAvailability);
    };

    /**
     * Update availability field
     * REASON: Handle changes to individual availability slots
     */
    const updateAvailability = (index, field, value) => {
        const newAvailability = [...availability];
        newAvailability[index][field] = value;
        setAvailability(newAvailability);
    };

    /**
     * Handle form submission
     * REASON: Save all teacher profile changes
     */
    const handleSubmit = async (values) => {
        try {
            setSaving(true);

            // Prepare data for submission
            const profileData = {
                certifications: {
                    has_tajweed_certificate: values.has_tajweed_certificate,
                    has_sharea_certificate: values.has_sharea_certificate,
                    tajweed_certificate_url: values.tajweed_certificate_url || null,
                    sharea_certificate_url: values.sharea_certificate_url || null
                },
                expertise: expertise.filter(exp => exp.course_type_id), // Only include valid entries
                availability: availability
            };

            const response = await updateCompleteTeacherProfile(profileData);

            if (response.success) {
                message.success('Teacher profile updated successfully!');
            } else {
                message.error(response.message || 'Failed to update profile');
            }
        } catch (error) {
            message.error('An error occurred while updating profile');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="teacher-profile-loading">
                <Spin size="large" tip="Loading teacher profile..." />
            </div>
        );
    }

    return (
        <div className="teacher-profile-edit-section">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="teacher-profile-form"
            >
                {/* Certifications Section */}
                <Card
                    title={
                        <span>
                            <SafetyCertificateOutlined /> Certifications
                        </span>
                    }
                    className="profile-card"
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="has_tajweed_certificate"
                                valuePropName="checked"
                            >
                                <Checkbox>
                                    I have a Tajweed Certificate
                                </Checkbox>
                            </Form.Item>
                            <Form.Item
                                name="tajweed_certificate_url"
                                label="Tajweed Certificate URL (optional)"
                            >
                                <Input placeholder="https://example.com/certificate.pdf" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="has_sharea_certificate"
                                valuePropName="checked"
                            >
                                <Checkbox>
                                    I have a Sharia Certificate
                                </Checkbox>
                            </Form.Item>
                            <Form.Item
                                name="sharea_certificate_url"
                                label="Sharia Certificate URL (optional)"
                            >
                                <Input placeholder="https://example.com/certificate.pdf" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Divider />

                {/* Expertise Section */}
                <Card
                    title={
                        <span>
                            <BookOutlined /> Teaching Expertise
                        </span>
                    }
                    extra={
                        <Button
                            type="dashed"
                            onClick={addExpertise}
                            icon={<PlusOutlined />}
                        >
                            Add Expertise
                        </Button>
                    }
                    className="profile-card"
                >
                    {expertise.length === 0 ? (
                        <div className="empty-state">
                            <p>No expertise added yet. Click "Add Expertise" to start.</p>
                        </div>
                    ) : (
                        expertise.map((exp, index) => (
                            <Card
                                key={index}
                                type="inner"
                                className="expertise-card"
                                extra={
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeExpertise(index)}
                                    />
                                }
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <div className="form-field">
                                            <label>Course Type *</label>
                                            <Select
                                                value={exp.course_type_id}
                                                onChange={(value) => updateExpertise(index, 'course_type_id', value)}
                                                placeholder="Select course type"
                                                style={{ width: '100%' }}
                                            >
                                                {courseTypes.map(ct => (
                                                    <Option key={ct.id} value={ct.id}>
                                                        {ct.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <div className="form-field">
                                            <label>Years of Experience</label>
                                            <InputNumber
                                                value={exp.years_experience}
                                                onChange={(value) => updateExpertise(index, 'years_experience', value)}
                                                min={0}
                                                max={50}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <div className="form-field">
                                            <Checkbox
                                                checked={exp.is_memorization_selected}
                                                onChange={(e) => updateExpertise(index, 'is_memorization_selected', e.target.checked)}
                                            >
                                                Includes Memorization
                                            </Checkbox>
                                        </div>
                                        {exp.is_memorization_selected && (
                                            <div className="form-field" style={{ marginTop: 12 }}>
                                                <label>Maximum Memorization Level</label>
                                                <Select
                                                    value={exp.max_mem_level_id}
                                                    onChange={(value) => updateExpertise(index, 'max_mem_level_id', value)}
                                                    placeholder="Select max level"
                                                    style={{ width: '100%' }}
                                                >
                                                    {memorizationLevels.map(level => (
                                                        <Option key={level.id} value={level.id}>
                                                            {level.level_name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        )}
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <div className="form-field">
                                            <label>Hourly Rate (cents)</label>
                                            <InputNumber
                                                value={exp.hourly_rate_cents}
                                                onChange={(value) => updateExpertise(index, 'hourly_rate_cents', value)}
                                                min={0}
                                                style={{ width: '100%' }}
                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    )}
                </Card>

                <Divider />

                {/* Availability Section */}
                <Card
                    title={
                        <span>
                            <ClockCircleOutlined /> Availability Schedule
                        </span>
                    }
                    extra={
                        <Button
                            type="dashed"
                            onClick={addAvailability}
                            icon={<PlusOutlined />}
                        >
                            Add Time Slot
                        </Button>
                    }
                    className="profile-card"
                >
                    {availability.length === 0 ? (
                        <div className="empty-state">
                            <p>No availability slots added yet. Click "Add Time Slot" to start.</p>
                        </div>
                    ) : (
                        availability.map((slot, index) => (
                            <Card
                                key={index}
                                type="inner"
                                className="availability-card"
                                extra={
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeAvailability(index)}
                                    />
                                }
                            >
                                <Row gutter={[16, 16]} align="middle">
                                    <Col xs={24} md={8}>
                                        <div className="form-field">
                                            <label>Day</label>
                                            <Select
                                                value={slot.day_of_week}
                                                onChange={(value) => updateAvailability(index, 'day_of_week', value)}
                                                style={{ width: '100%' }}
                                            >
                                                {daysOfWeek.map(day => (
                                                    <Option key={day.value} value={day.value}>
                                                        {day.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={8}>
                                        <div className="form-field">
                                            <label>Start Time</label>
                                            <TimePicker
                                                value={slot.start_time ? moment(slot.start_time, 'HH:mm') : null}
                                                onChange={(time) => updateAvailability(index, 'start_time', time ? time.format('HH:mm') : null)}
                                                format="HH:mm"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={12} md={8}>
                                        <div className="form-field">
                                            <label>End Time</label>
                                            <TimePicker
                                                value={slot.end_time ? moment(slot.end_time, 'HH:mm') : null}
                                                onChange={(time) => updateAvailability(index, 'end_time', time ? time.format('HH:mm') : null)}
                                                format="HH:mm"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    )}
                </Card>

                <Divider />

                {/* Submit Button */}
                <div className="form-actions">
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={saving}
                        className="save-button"
                    >
                        Save Teacher Profile
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default TeacherProfileEditSection;