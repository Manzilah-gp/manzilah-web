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
            navigate('/mosque-list');
            return;
        }

        setFetching(true);
        try {
            console.log('Fetching mosque with ID:', id);

            const response = await getMosqueById(id);
            console.log('Full API response:', response);

            // FIXED: Handle different response structures
            let mosqueData;

            if (response.data && response.data.data) {
                // Case 1: response.data.data exists
                mosqueData = response.data.data;
            } else if (response.data) {
                // Case 2: response.data is the mosque object
                mosqueData = response.data;
            } else if (response.success && response.data) {
                // Case 3: response.success with data
                mosqueData = response.data;
            } else {
                // Case 4: Direct data
                mosqueData = response;
            }

            console.log('Extracted mosque data:', mosqueData);

            if (mosqueData && mosqueData.id) {
                setMosque(mosqueData);

                // FIXED: Set form values with proper field mapping
                const formValues = {
                    name: mosqueData.name,
                    contact_number: mosqueData.contact_number,
                    mosque_admin_id: mosqueData.mosque_admin_id,
                    governorate: mosqueData.governorate,
                    region: mosqueData.region,
                    address: mosqueData.address,
                    latitude: mosqueData.latitude,
                    longitude: mosqueData.longitude,
                    postal_code: mosqueData.postal_code
                };

                console.log('Setting form values:', formValues);
                form.setFieldsValue(formValues);
            } else {
                console.error('Invalid mosque data structure:', mosqueData);
                message.error('Mosque not found or invalid data structure');
                navigate('/mosque-list');
            }

        } catch (error) {
            console.error('Error fetching mosque:', error);
            message.error('Failed to load mosque data');
            navigate('/mosque-list');
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

            // FIXED: Use flat structure instead of nested mosque/location
            const updateData = {
                name: values.name,
                contact_number: values.contact_number,
                mosque_admin_id: values.mosque_admin_id,
                latitude: values.latitude,
                longitude: values.longitude,
                address: values.address,
                region: values.region,
                governorate: values.governorate,
                postal_code: values.postal_code
            };

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
             */

            console.log('Sending update data:', updateData);

            const response = await updateMosque(id, updateData);
            console.log('Update response:', response);

            if (response.success || response.data) {
                message.success('Mosque updated successfully!');
                navigate('/mosque-list');
            } else {
                throw new Error(response.message || 'Update failed');
            }

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
                <Button onClick={() => navigate('/mosque-list')}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="edit-mosque-form">
            <Card className='edit-mosque-card'>
                {/* Header with Back Button */}
                <div className="form-header">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/mosque-list')}
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
                                name="mosque_admin_id"
                                label="Mosque Admin ID"
                                rules={[
                                    { message: 'Please enter a valid ID' }
                                ]}
                            >
                                <Input placeholder="Enter Mosque Admin ID" />
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
                                onClick={() => navigate('/mosque-list')}
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
                initialLocation={{
                    latitude: parseFloat(mosque?.latitude),
                    longitude: parseFloat(mosque?.longitude)
                }}
            />
        </div>
    );
};

export default EditMosqueForm;