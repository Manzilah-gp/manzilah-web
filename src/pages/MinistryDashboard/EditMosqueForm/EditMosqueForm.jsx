// components/Dashboard/Ministry/EditMosque/EditMosqueForm.jsx
import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    message,
    Typography,
    Row,
    Col,
    Select,
    Space,
    Spin,
    Layout
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { getMosqueById, updateMosque } from '../../../api/mosque';
import MapComponent from '../../../components/Map/MapComponent';
import useAuth from '../../../hooks/useAuth';
import { getGovernorates } from '../../../util/getGovernates';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import './EditMosqueForm.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditMosqueForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [mosque, setMosque] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const governorateOptions = getGovernorates();

    useEffect(() => {
        fetchMosqueData();
    }, [id]);

    const fetchMosqueData = async () => {
        if (!id) {
            message.error('No mosque ID provided');
            navigate(-1);
            return;
        }

        setFetching(true);
        try {
            // REAL BACKEND IMPLEMENTATION:

            const response = await getMosqueById(id);
            if (response.success && response.data) {
                setMosque(response.data.data);
                form.setFieldsValue(response.data.data);
            } else {
                message.error('Mosque not found');
                navigate(-1);
            }


        } catch (error) {
            console.error('Error fetching mosque:', error);
            message.error('Failed to load mosque data');
            navigate(-1);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (values) => {
        if (!user) {
            message.error('Authentication required');
            return;
        }

        setLoading(true);
        try {
            console.log('Submitting mosque update:', values);

            // REAL BACKEND IMPLEMENTATION:
            /*
            const updateData = {
                mosque: {
                    name: values.name,
                    contact_number: values.contact_number
                },
                location: {
                    latitude: values.latitude,
                    longitude: values.longitude,
                    address: values.address,
                    region: values.region,
                    governorate: values.governorate,
                    postal_code: values.postal_code
                }
            };

            const response = await updateMosque(id, updateData);
            
            if (response.success) {
                message.success('Mosque updated successfully!');
                navigate('/mosque-list');
            } else {
                throw new Error(response.message || 'Update failed');
            }
            */

            // DEMO: Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            message.success(`Mosque "${values.name}" updated successfully! (Demo)`);
            console.log('Would update mosque with:', values);

            // Navigate back after a short delay
            setTimeout(() => {
                navigate(-1);
            }, 1000);

        } catch (error) {
            console.error('Error updating mosque:', error);
            message.error(error.message || 'Failed to update mosque');
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSelect = (locationData) => {
        form.setFieldsValue({
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            address: locationData.formatted_address,
            region: locationData.region,
            governorate: locationData.governorate,
            postal_code: locationData.postal_code
        });
        setMapVisible(false);
        message.success('Location updated from map');
    };

    if (fetching) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading mosque data..." />
            </div>
        );
    }

    if (!mosque) {
        return (
            <div className="error-container">
                <Text type="danger">Mosque not found</Text>
                <Button onClick={() => navigate(-1)}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <Layout >
            <Header
            />
            <div className="edit-mosque-form">
                <Card className='edit-mosque-card'>
                    {/* Header with Back Button */}
                    <div className="form-header">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                            className="back-button"
                        >
                            Back to List
                        </Button>
                        <Title level={2} className="form-title">
                            Edit Mosque: {mosque.name}
                        </Title>
                        <Text type="secondary">
                            Update the mosque information below
                        </Text>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        disabled={loading}
                        className="mosque-form"
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="name"
                                    label="Mosque Name"
                                    rules={[
                                        { required: true, message: 'Please enter mosque name' },
                                        { min: 2, message: 'Name must be at least 2 characters' }
                                    ]}
                                >
                                    <Input placeholder="Enter mosque name" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="contact_number"
                                    label="Contact Number"
                                    rules={[
                                        { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number' }
                                    ]}
                                >
                                    <Input placeholder="Enter contact number" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="governorate"
                                    label="Governorate"
                                    rules={[{ required: true, message: 'Please select governorate' }]}
                                >
                                    <Select
                                        placeholder="Select governorate"
                                        options={governorateOptions}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="region"
                                    label="Region"
                                >
                                    <Input placeholder="Enter region" />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item
                                    name="address"
                                    label="Full Address"
                                >
                                    <TextArea
                                        rows={3}
                                        placeholder="Enter full address"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="latitude"
                                    label="Latitude"
                                    rules={[{ required: true, message: 'Latitude is required' }]}
                                >
                                    <Input readOnly />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="longitude"
                                    label="Longitude"
                                    rules={[{ required: true, message: 'Longitude is required' }]}
                                >
                                    <Input readOnly />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="postal_code"
                                    label="Postal Code"
                                >
                                    <Input placeholder="Enter postal code" />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Map Location Update */}
                        <div className="map-section">
                            <Button
                                type="dashed"
                                onClick={() => setMapVisible(true)}
                                size="large"
                                className="map-button"
                            >
                                Update Location on Map
                            </Button>
                            <Text type="secondary" className="map-help">
                                Click to update the mosque location using the interactive map
                            </Text>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <Space size="middle">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                    size="large"
                                >
                                    Update Mosque
                                </Button>
                                <Button
                                    onClick={() => navigate(-1)}
                                    size="large"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Card>

                {/* Map Modal */}
                <MapComponent
                    visible={mapVisible}
                    onCancel={() => setMapVisible(false)}
                    onLocationSelect={handleLocationSelect}
                    initialLocation={mosque}
                />

            </div>

            <Footer />
        </Layout >
    );
};

export default EditMosqueForm;