// components/Dashboard/Ministry/AddMosqueView.jsx
import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Select,
    message,
    Row,
    Col,
    Divider,
    Space,
    Typography
} from 'antd';
import {
    EnvironmentOutlined,
    SaveOutlined,
    ClearOutlined
} from '@ant-design/icons';
import MapComponent from '../../../components/Map/MapComponent';
import useAuth from '../../../hooks/useAuth';
import { addMosque } from '../../../api/mosque';
import { getGovernorates } from '../../../util/getGovernates';
import './AddMosqueView.css';


const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AddMosqueView = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Use the auth hook to get user information and authentication status
    const { user, logout } = useAuth();

    // Governorate options matching the ENUM in database
    const governorateOptions = getGovernorates();

    // Handle location selection from map
    const handleLocationSelect = (locationData) => {
        setSelectedLocation(locationData);

        // Auto-fill form fields with location data
        form.setFieldsValue({
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            address: locationData.formatted_address,
            region: locationData.region,
            governorate: locationData.governorate,
            postal_code: locationData.postal_code
        });

        setMapVisible(false);
        message.success('Location selected successfully!');
    };


    const handleSubmit = async (values) => {
        if (!selectedLocation) {
            message.error('Please select mosque location from the map');
            return;
        }

        if (!user) {
            message.error('Authentication required. Please log in again.');
            return;
        }

        setLoading(true);

        try {
            // REAL BACKEND CALL - using the mosque API service
            const response = await addMosque({
                mosque: {
                    name: values.name,
                    contact_number: values.contact_number,
                    mosque_admin_id: values.mosque_admin_id || null,
                    // created_by is automatically set by backend from JWT token
                },
                location: {
                    latitude: parseFloat(values.latitude),
                    longitude: parseFloat(values.longitude),
                    address: values.address,
                    region: values.region,
                    governorate: values.governorate,
                    postal_code: values.postal_code
                }
            });

            message.success('Mosque added successfully!');
            form.resetFields();
            setSelectedLocation(null);

        } catch (error) {
            console.error('Error adding mosque:', error);

            // Handle specific error cases
            if (error.response?.status === 401) {
                message.error('Session expired. Please log in again.');
                logout();
            } else if (error.response?.status === 403) {
                message.error('Access denied. Insufficient permissions.');
            } else {
                message.error(error.response?.data?.message || 'Failed to add mosque. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const handleReset = () => {
        form.resetFields();
        setSelectedLocation(null);
        message.info('Form cleared');
    };

    return (
        <div className="add-mosque-container">
            <Card className="add-mosque-card">
                {/* Header Section with User Info */}
                <div className="mosque-form-header">
                    <Title level={2} className="form-title">
                        Add New Mosque
                    </Title>
                    <Text type="secondary">
                        Fill in the mosque details and select its location on the map.
                        {user && ` Logged in as: ${user.full_name || user.email}`}
                    </Text>
                </div>

                <Divider />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mosque-form"
                    size="large"
                >
                    {/* Mosque Basic Information */}
                    <Row gutter={[24, 16]}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="name"
                                label="Mosque Name"
                                rules={[
                                    { required: true, message: 'Please enter mosque name' },
                                    { min: 2, message: 'Name must be at least 2 characters' }
                                ]}
                            >
                                <Input
                                    placeholder="Enter mosque name"
                                    maxLength={100}
                                />
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
                                <Input
                                    placeholder="Enter contact number"
                                    maxLength={20}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="mosque_admin_id"
                                label=" Mosque Admin ID"
                                rules={[
                                    { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid ID number' }
                                ]}
                            >
                                <Input
                                    placeholder="Enter mosque admin ID"
                                    maxLength={20}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Location Selection Section */}
                    <Divider orientation="left">Location Information</Divider>

                    <div className="map-section">
                        <div className="map-button-container">
                            <Button
                                type="dashed"
                                icon={<EnvironmentOutlined />}
                                onClick={() => setMapVisible(true)}
                                size="large"
                                className="map-button"
                            >
                                {selectedLocation ? 'Change Location' : 'Select Location on Map'}
                            </Button>

                            {selectedLocation && (
                                <div className="selected-location-info">
                                    <Text strong>📍 Selected Location:</Text>
                                    <Text type="secondary">
                                        {selectedLocation.formatted_address ||
                                            `Lat: ${selectedLocation.latitude?.toFixed(6)}, Lng: ${selectedLocation.longitude?.toFixed(6)}`}
                                    </Text>
                                </div>
                            )}
                        </div>

                        {/* Location Details from Map Selection */}
                        <Row gutter={[24, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="latitude"
                                    label="Latitude"
                                    rules={[{ required: true, message: 'Latitude is required' }]}
                                >
                                    <Input
                                        placeholder="Auto-filled from map"
                                        readOnly
                                        disabled
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="longitude"
                                    label="Longitude"
                                    rules={[{ required: true, message: 'Longitude is required' }]}
                                >
                                    <Input
                                        placeholder="Auto-filled from map"
                                        readOnly
                                        disabled
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24}>
                                <Form.Item
                                    name="address"
                                    label="Full Address"
                                    rules={[{ required: true, message: 'Address is required' }]}
                                >
                                    <TextArea
                                        placeholder="Auto-filled from map selection"
                                        rows={3}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="region"
                                    label="Region"
                                    rules={[{ required: true, message: 'Region is required' }]}
                                >
                                    <Input
                                        placeholder="Auto-filled from map"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="governorate"
                                    label="Governorate"
                                    rules={[{ required: true, message: 'Governorate is required' }]}
                                >
                                    <Select
                                        placeholder="Select governorate"
                                        options={governorateOptions}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="postal_code"
                                    label="Postal Code"
                                >
                                    <Input
                                        placeholder="Auto-filled from map"
                                        maxLength={20}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* Form Actions */}
                    <Divider />
                    <div className="form-actions">
                        <Space size="middle">
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={loading}
                                size="large"
                                disabled={!selectedLocation || !user}
                            >
                                Add Mosque
                            </Button>

                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleReset}
                                size="large"
                                disabled={loading}
                            >
                                Clear Form
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
                initialLocation={selectedLocation}
            />
        </div>
    );
};

export default AddMosqueView;