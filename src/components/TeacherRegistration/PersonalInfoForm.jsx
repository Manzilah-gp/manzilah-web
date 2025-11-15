import React from 'react';
import { Form, Input, DatePicker, Select, Row, Col, Card } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';

const { Option } = Select;

const PersonalInfoForm = ({ formData, updateFormData }) => {
    const [form] = Form.useForm();

    const onValuesChange = (changedValues, allValues) => {
        updateFormData(allValues);
    };

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
                        <h3>Personal Information</h3>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="full_name"
                                    label="Full Name"
                                    rules={[
                                        { required: true, message: 'Please enter your full name' },
                                        { min: 2, message: 'Name must be at least 2 characters' }
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Enter your full name"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="email"
                                    label="Email Address"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder="Enter your email address"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="phone"
                                    label="Phone Number"
                                    rules={[
                                        { required: true, message: 'Please enter your phone number' }
                                    ]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined />}
                                        placeholder="Enter your phone number"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="gender"
                                    label="Gender"
                                    rules={[{ required: true, message: 'Please select gender' }]}
                                >
                                    <Select placeholder="Select your gender">
                                        <Option value="male">Male</Option>
                                        <Option value="female">Female</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="dob"
                                    label="Date of Birth"
                                    rules={[{ required: true, message: 'Please select date of birth' }]}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        placeholder="Select your date of birth"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Card>

                <Card className="form-section-card">
                    <div className="form-section">
                        <h3>Account Security</h3>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[
                                        { required: true, message: 'Please enter password' },
                                        { min: 8, message: 'Password must be at least 8 characters' }
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Create a password"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Please confirm your password' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Passwords do not match'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Confirm your password"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Card>

                <Card className="form-section-card">
                    <div className="form-section">
                        <h3>Address Information</h3>
                        <Form.Item
                            name={['address', 'address_line1']}
                            label="Address Line 1"
                            rules={[{ required: true, message: 'Please enter your address' }]}
                        >
                            <Input placeholder="Street address, P.O. box" />
                        </Form.Item>

                        <Form.Item
                            name={['address', 'address_line2']}
                            label="Address Line 2"
                        >
                            <Input placeholder="Apartment, suite, unit, building, floor, etc." />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name={['address', 'city']}
                                    label="City"
                                    rules={[{ required: true, message: 'Please enter city' }]}
                                >
                                    <Input placeholder="City" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name={['address', 'region']}
                                    label="Region"
                                    rules={[{ required: true, message: 'Please enter region' }]}
                                >
                                    <Input placeholder="Region/State" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name={['address', 'postal_code']}
                                    label="Postal Code"
                                    rules={[{ required: true, message: 'Please enter postal code' }]}
                                >
                                    <Input placeholder="Postal code" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default PersonalInfoForm;