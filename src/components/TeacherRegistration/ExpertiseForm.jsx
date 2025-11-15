import React from 'react';
import { Form, Select, Checkbox, InputNumber, Row, Col, Card, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Group: CheckboxGroup } = Checkbox;

const ExpertiseForm = ({ formData, updateFormData }) => {
    const [form] = Form.useForm();

    const onValuesChange = (changedValues, allValues) => {
        updateFormData(allValues);
    };

    const courseTypes = [
        { value: 1, label: 'Memorization (Hifz)', levels: 6 },
        { value: 1, label: 'Memorization (Hifz)', levels: 5 },
        { value: 1, label: 'Memorization (Hifz)', levels: 4 },
        { value: 1, label: 'Memorization (Hifz)', levels: 3 },
        { value: 1, label: 'Memorization (Hifz)', levels: 2 },
        { value: 1, label: 'Memorization (Hifz)', levels: 1 },
        { value: 2, label: 'Tajweed', levels: 2 },
        { value: 3, label: 'Feqh', levels: 3 }
    ];

    const teachingMethodologies = [
        'Traditional',
        'Modern Interactive',
        'One-on-One Focused',
        'Group Collaborative',
        'Technology Integrated'
    ];

    const teachingTools = [
        'Whiteboard',
        'Digital Tools',
        'Quran Apps',
        'Audio Recordings',
        'Visual Aids',
        'Physical Quran'
    ];

    return (
        <div className="form-container">
            <Form
                form={form}
                layout="vertical"
                initialValues={formData}
                onValuesChange={onValuesChange}
                size="large"
            >
                <Card className="form-section-card">
                    <div className="form-section">
                        <h3>Teaching Expertise</h3>

                        <Form.Item
                            name="course_expertise"
                            label="Course Types You Can Teach"
                            rules={[{ required: true, message: 'Please select at least one course type' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select course types you're qualified to teach"
                                optionLabelProp="label"
                            >
                                {courseTypes.map(course => (
                                    <Option key={course.value} value={course.value} label={course.label}>
                                        <div>
                                            <strong>{course.label}</strong>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                Up to level {course.levels}
                                            </div>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </div>
                </Card>

                <Card className="form-section-card">
                    <div className="form-section">

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="hourly_rate_cents"
                                    label="Hourly Rate (Shekels)"
                                >
                                    <InputNumber
                                        min={0}
                                        formatter={value => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        style={{ width: '100%' }}
                                        placeholder="0.00"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default ExpertiseForm;