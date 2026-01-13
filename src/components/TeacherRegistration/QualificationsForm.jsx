import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Checkbox, Upload, Button, Row, Col, Card } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const QualificationsForm = ({ formData, updateFormData }) => {
    const [form] = Form.useForm();
    const [tajweedFileList, setTajweedFileList] = useState([]);
    const [shareaFileList, setShareaFileList] = useState([]);

    const onValuesChange = (changedValues, allValues) => {
        updateFormData(allValues);
    };

    const handleCertificateUpload = (certificateType, info) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Handle successful upload
            const url = info.file.response.url;
            updateFormData({
                [`${certificateType}_certificate_url`]: url
            });
            form.setFieldsValue({
                [`${certificateType}_certificate_url`]: url
            });
        }
    };

    const certificateUploadProps = {
        name: 'certificate',
        action: '/api/upload/certificate',
        headers: {
            authorization: 'authorization-text',
        },
        onChange: handleCertificateUpload,
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
                        <h3>Teaching Certifications</h3>

                        <Row gutter={16}>
                            {/* Tajweed Certificate */}
                            <Col xs={24} md={12}>
                                <Form.Item name="has_tajweed_certificate" valuePropName="checked">
                                    <Checkbox
                                        onChange={(e) => {
                                            updateFormData({ has_tajweed_certificate: e.target.checked });
                                            if (!e.target.checked) {
                                                setTajweedFileList([]);
                                            }
                                        }}
                                    >
                                        I have Tajweed Certificate
                                    </Checkbox>
                                </Form.Item>

                                {formData.has_tajweed_certificate && (
                                    <>
                                        <Form.Item
                                            name="tajweed_certificate_url"
                                            label="Enter Certificate Link"
                                            help="Provide a link to your certificate (e.g. Google Drive)"
                                        >
                                            <Input placeholder="https://..." />
                                        </Form.Item>
                                    </>
                                )}
                            </Col>

                            {/* Sharea Certificate */}
                            <Col xs={24} md={12}>
                                <Form.Item name="has_sharea_certificate" valuePropName="checked">
                                    <Checkbox
                                        onChange={(e) => {
                                            updateFormData({ has_sharea_certificate: e.target.checked });
                                            if (!e.target.checked) {
                                                setShareaFileList([]);
                                            }
                                        }}
                                    >
                                        I have Sharea Certificate
                                    </Checkbox>
                                </Form.Item>

                                {formData.has_sharea_certificate && (
                                    <>
                                        <Form.Item
                                            name="sharea_certificate_url"
                                            label="Enter Certificate Link"
                                            help="Provide a link to your certificate (e.g. Google Drive)"
                                        >
                                            <Input placeholder="https://..." />
                                        </Form.Item>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </div>
                </Card>

                <Card className="form-section-card">
                    <div className="form-section">
                        <h3>👨‍🏫 Teaching Experience</h3>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="years_experience"
                                    label="Years of Teaching Experience"
                                    rules={[{ required: true, message: 'Please enter years of experience' }]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={50}
                                        style={{ width: '100%' }}
                                        placeholder="Number of years"
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

export default QualificationsForm;