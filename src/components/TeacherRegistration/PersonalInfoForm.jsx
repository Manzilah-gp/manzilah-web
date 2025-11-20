// import React, { useState } from 'react';
// import { Form, Input, DatePicker, Select, Row, Col, Card, Button, Modal } from 'antd';
// import { EnvironmentOutlined, UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
// import MapComponent from '../Map/MapComponent';

// const { Option } = Select;

// const PersonalInfoForm = ({ formData, updateFormData }) => {
//     const [form] = Form.useForm();
//     const [mapVisible, setMapVisible] = useState(false);

//     const onValuesChange = (changedValues, allValues) => {
//         updateFormData(allValues);
//     };

//     const handleMapSelect = (locationData) => {
//         // Update form with location data
//         form.setFieldsValue({
//             address: {
//                 ...form.getFieldValue('address'),
//                 address_line1: locationData.address_line1 || '',
//                 city: locationData.city || '',
//                 region: locationData.region || '',
//                 governorate: locationData.governorate || '',
//                 postal_code: locationData.postal_code || '',
//                 latitude: locationData.latitude || '',
//                 longitude: locationData.longitude || '',
//                 country: locationData.country || 'Palestine',
//                 formatted_address: locationData.formatted_address || ''
//             }
//         });

//         // Update the parent component's form data
//         updateFormData({
//             ...form.getFieldsValue(),
//             address: {
//                 ...form.getFieldsValue().address,
//                 ...locationData
//             }
//         });

//         setMapVisible(false);
//     };

//     // Get current address values for initial map location
//     const getInitialLocation = () => {
//         const address = form.getFieldValue('address') || {};
//         if (address.latitude && address.longitude) {
//             return {
//                 latitude: parseFloat(address.latitude),
//                 longitude: parseFloat(address.longitude)
//             };
//         }
//         return null;
//     };

//     return (
//         <div className="form-container">
//             <Form
//                 form={form}
//                 layout="vertical"
//                 initialValues={formData}
//                 onValuesChange={onValuesChange}
//                 size="large"
//             >
//                 <Card className="form-section-card">
//                     <div className="form-section">
//                         <h3>Personal Information</h3>
//                         <Row gutter={16}>
//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name="full_name"
//                                     label="Full Name"
//                                     rules={[
//                                         { required: true, message: 'Please enter your full name' },
//                                         { min: 2, message: 'Name must be at least 2 characters' }
//                                     ]}
//                                 >
//                                     <Input
//                                         prefix={<UserOutlined />}
//                                         placeholder="Enter your full name"
//                                     />
//                                 </Form.Item>
//                             </Col>
//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name="email"
//                                     label="Email Address"
//                                     rules={[
//                                         { required: true, message: 'Please enter your email' },
//                                         { type: 'email', message: 'Please enter a valid email' }
//                                     ]}
//                                 >
//                                     <Input
//                                         prefix={<MailOutlined />}
//                                         placeholder="Enter your email address"
//                                     />
//                                 </Form.Item>
//                             </Col>
//                         </Row>

//                         <Row gutter={16}>
//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name="phone"
//                                     label="Phone Number"
//                                     rules={[
//                                         { required: true, message: 'Please enter your phone number' }
//                                     ]}
//                                 >
//                                     <Input
//                                         prefix={<PhoneOutlined />}
//                                         placeholder="Enter your phone number"
//                                     />
//                                 </Form.Item>
//                             </Col>
//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name="gender"
//                                     label="Gender"
//                                     rules={[{ required: true, message: 'Please select gender' }]}
//                                 >
//                                     <Select placeholder="Select your gender">
//                                         <Option value="male">Male</Option>
//                                         <Option value="female">Female</Option>
//                                     </Select>
//                                 </Form.Item>
//                             </Col>
//                         </Row>

//                         <Row gutter={16}>
//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name="dob"
//                                     label="Date of Birth"
//                                     rules={[{ required: true, message: 'Please select date of birth' }]}
//                                 >
//                                     <DatePicker
//                                         style={{ width: '100%' }}
//                                         placeholder="Select your date of birth"
//                                     />
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Card>

//                 <Card className="form-section-card">
//                     <div className="form-section">
//                         <h3>Account Security</h3>
//                         <Row gutter={16}>
//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name="password"
//                                     label="Password"
//                                     rules={[
//                                         { required: true, message: 'Please enter password' },
//                                         { min: 8, message: 'Password must be at least 8 characters' }
//                                     ]}
//                                 >
//                                     <Input.Password
//                                         prefix={<LockOutlined />}
//                                         placeholder="Create a password"
//                                     />
//                                 </Form.Item>
//                             </Col>
//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name="confirmPassword"
//                                     label="Confirm Password"
//                                     dependencies={['password']}
//                                     rules={[
//                                         { required: true, message: 'Please confirm your password' },
//                                         ({ getFieldValue }) => ({
//                                             validator(_, value) {
//                                                 if (!value || getFieldValue('password') === value) {
//                                                     return Promise.resolve();
//                                                 }
//                                                 return Promise.reject(new Error('Passwords do not match'));
//                                             },
//                                         }),
//                                     ]}
//                                 >
//                                     <Input.Password
//                                         prefix={<LockOutlined />}
//                                         placeholder="Confirm your password"
//                                     />
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Card>

//                 <Card className="form-section-card">
//                     <div className="form-section">
//                         <h3>Address Information</h3>

//                         {/* Map Selection Button */}
//                         <Form.Item>
//                             <Button
//                                 type="dashed"
//                                 icon={<EnvironmentOutlined />}
//                                 onClick={() => setMapVisible(true)}
//                                 style={{ width: '100%', marginBottom: 16, height: '40px' }}
//                             >
//                                 Select Location from Map
//                             </Button>
//                         </Form.Item>

//                         {/* Display selected coordinates if available */}
//                         {(form.getFieldValue(['address', 'latitude']) && form.getFieldValue(['address', 'longitude'])) && (
//                             <div style={{
//                                 marginBottom: 16,
//                                 padding: 12,
//                                 background: '#f0f8ff',
//                                 border: '1px solid #d6e9ff',
//                                 borderRadius: 6,
//                                 fontSize: '14px'
//                             }}>
//                                 <strong>📍 Selected Location:</strong><br />
//                                 Latitude: <strong>{parseFloat(form.getFieldValue(['address', 'latitude'])).toFixed(6)}</strong><br />
//                                 Longitude: <strong>{parseFloat(form.getFieldValue(['address', 'longitude'])).toFixed(6)}</strong>
//                             </div>
//                         )}

//                         <Form.Item
//                             name={['address', 'address_line1']}
//                             label="Address Line 1"
//                             rules={[{ required: true, message: 'Please enter your address' }]}
//                         >
//                             <Input placeholder="Street address, P.O. box" />
//                         </Form.Item>

//                         <Form.Item
//                             name={['address', 'address_line2']}
//                             label="Address Line 2"
//                         >
//                             <Input placeholder="Apartment, suite, unit, building, floor, etc." />
//                         </Form.Item>

//                         <Row gutter={16}>
//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name={['address', 'city']}
//                                     label="City"
//                                     rules={[{ required: true, message: 'Please enter city' }]}
//                                 >
//                                     <Input placeholder="City" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name={['address', 'postal_code']}
//                                     label="Postal Code"
//                                     rules={[{ required: true, message: 'Please enter postal code' }]}
//                                 >
//                                     <Input placeholder="Postal code" />
//                                 </Form.Item>
//                             </Col>
//                         </Row>

//                         <Row gutter={16}>
//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name={['address', 'region']}
//                                     label="Region"
//                                     rules={[{ required: true, message: 'Please enter region' }]}
//                                 >
//                                     <Input placeholder="Region/State" />
//                                 </Form.Item>
//                             </Col>
//                             <Col xs={24} md={12}>
//                                 <Form.Item
//                                     name={['address', 'governorate']}
//                                     label="Governorate"
//                                     rules={[{ required: true, message: 'Please select your governorate' }]}
//                                 >
//                                     <Select placeholder="Select your governorate">
//                                         <Option value="gaza">Gaza</Option>
//                                         <Option value="ramallah">Ramallah</Option>
//                                         <Option value="hebron">Hebron</Option>
//                                         <Option value="nabulus">Nablus</Option>
//                                         <Option value="jerusalem">Jerusalem</Option>
//                                         <Option value="bethlehem">Bethlehem</Option>
//                                         <Option value="jenin">Jenin</Option>
//                                         <Option value="tulkarm">Tulkarm</Option>
//                                         <Option value="qalqilya">Qalqilya</Option>
//                                         <Option value="salfit">Salfit</Option>
//                                         <Option value="jericho">Jericho</Option>
//                                         <Option value="tubas">Tubas</Option>
//                                     </Select>
//                                 </Form.Item>
//                             </Col>
//                         </Row>

//                         {/* Hidden fields for coordinates and formatted address */}
//                         <Form.Item name={['address', 'latitude']} hidden>
//                             <Input type="hidden" />
//                         </Form.Item>
//                         <Form.Item name={['address', 'longitude']} hidden>
//                             <Input type="hidden" />
//                         </Form.Item>
//                         <Form.Item name={['address', 'formatted_address']} hidden>
//                             <Input type="hidden" />
//                         </Form.Item>
//                         <Form.Item name={['address', 'country']} hidden>
//                             <Input type="hidden" />
//                         </Form.Item>
//                     </div>
//                 </Card>
//             </Form>

//             {/* Map Component Modal */}
//             <MapComponent
//                 visible={mapVisible}
//                 onCancel={() => setMapVisible(false)}
//                 onLocationSelect={handleMapSelect}
//                 initialLocation={getInitialLocation()}
//             />
//         </div>
//     );
// };

// export default PersonalInfoForm;


import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Row, Col, Card, Button } from 'antd';
import { EnvironmentOutlined, UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import MapComponent from '../Map/MapComponent';

const { Option } = Select;

const PersonalInfoForm = ({ formData, updateFormData }) => {
    const [form] = Form.useForm();
    const [mapVisible, setMapVisible] = useState(false);
    const [mapLoading, setMapLoading] = useState(false);

    const onValuesChange = (changedValues, allValues) => {
        updateFormData(allValues);
    };

    const handleMapSelect = (locationData) => {
        // Update form with location data including automatic governorate
        form.setFieldsValue({
            address: {
                ...form.getFieldValue('address'),
                address_line1: locationData.address_line1 || '',
                region: locationData.region || '',
                //city: locationData.city || '',
                governorate: locationData.governorate || '',
                postal_code: locationData.postal_code || '',
                latitude: locationData.latitude || '',
                longitude: locationData.longitude || '',
                formatted_address: locationData.formatted_address || ''
            }
        });

        // Update the parent component's form data
        updateFormData({
            ...form.getFieldsValue(),
            address: {
                ...form.getFieldsValue().address,
                ...locationData
            }
        });

        setMapVisible(false);
        setMapLoading(false);
    };

    // Get current address values for initial map location
    const getInitialLocation = () => {
        const address = form.getFieldValue('address') || {};
        if (address.latitude && address.longitude) {
            return {
                latitude: parseFloat(address.latitude),
                longitude: parseFloat(address.longitude)
            };
        }
        return null;
    };

    const handleMapOpen = () => {
        setMapLoading(true);
        setMapVisible(true);
        // Reset loading after a short delay
        setTimeout(() => setMapLoading(false), 500);
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

                        {/* Map Selection Button */}
                        <Form.Item>
                            <Button
                                type="dashed"
                                icon={<EnvironmentOutlined />}
                                onClick={handleMapOpen}
                                style={{ width: '100%', marginBottom: 16, height: '40px' }}
                                loading={mapLoading}
                            >
                                {mapLoading ? 'Loading Map...' : 'Select Location from Map'}
                            </Button>
                        </Form.Item>

                        {/* Display selected coordinates if available */}
                        {(form.getFieldValue(['address', 'latitude']) && form.getFieldValue(['address', 'longitude'])) && (
                            <div style={{
                                marginBottom: 16,
                                padding: 12,
                                background: '#f0f8ff',
                                border: '1px solid #d6e9ff',
                                borderRadius: 6,
                                fontSize: '14px'
                            }}>
                                <strong>📍 Selected Location:</strong><br />
                                Latitude: <strong>{parseFloat(form.getFieldValue(['address', 'latitude'])).toFixed(6)}</strong><br />
                                Longitude: <strong>{parseFloat(form.getFieldValue(['address', 'longitude'])).toFixed(6)}</strong>
                            </div>
                        )}

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
                            {/* <Col xs={24} md={12}>
                                <Form.Item
                                    name={['address', 'city']}
                                    label="City"
                                    rules={[{ required: true, message: 'Please enter city' }]}
                                >
                                    <Input placeholder="City" />
                                </Form.Item>
                            </Col> */}

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={['address', 'postal_code']}
                                    label="postal_code"
                                    rules={[{ required: true, message: 'Please enter postal_code' }]}
                                >
                                    <Input placeholder="postal_code" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={['address', 'region']}
                                    label="Region"
                                    rules={[{ required: true, message: 'Please enter region' }]}
                                >
                                    <Input placeholder="Region/State" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={['address', 'governorate']}
                                    label="Governorate"
                                    rules={[{ required: true, message: 'Please select your governorate' }]}
                                >
                                    <Select placeholder="Select your governorate">
                                        <Option value="gaza">Gaza</Option>
                                        <Option value="ramallah">Ramallah</Option>
                                        <Option value="hebron">Hebron</Option>
                                        <Option value="nabulus">Nablus</Option>
                                        <Option value="jerusalem">Jerusalem</Option>
                                        <Option value="bethlehem">Bethlehem</Option>
                                        <Option value="jenin">Jenin</Option>
                                        <Option value="tulkarm">Tulkarm</Option>
                                        <Option value="qalqilya">Qalqilya</Option>
                                        <Option value="salfit">Salfit</Option>
                                        <Option value="jericho">Jericho</Option>
                                        <Option value="tubas">Tubas</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Hidden fields for coordinates and formatted address */}
                        <Form.Item name={['address', 'latitude']} hidden>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item name={['address', 'longitude']} hidden>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item name={['address', 'formatted_address']} hidden>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item name={['address', 'country']} hidden>
                            <Input type="hidden" />
                        </Form.Item>
                    </div>
                </Card>
            </Form>

            {/* Map Component Modal */}
            <MapComponent
                visible={mapVisible}
                onCancel={() => {
                    setMapVisible(false);
                    setMapLoading(false);
                }}
                onLocationSelect={handleMapSelect}
                initialLocation={getInitialLocation()}
            />
        </div>
    );
};

export default PersonalInfoForm;