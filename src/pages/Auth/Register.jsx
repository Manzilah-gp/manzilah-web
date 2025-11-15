import React, { useState, useCallback } from "react";
import { registerUser } from "../../api/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout, Steps, Button, Space, Card, Form, Input, Select, AutoComplete } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import './Auth.css';

const { Step } = Steps;
const { Option } = Select;

// Memoized PersonalInfoStep component
const PersonalInfoStep = React.memo(({ form, handleChange }) => {
    const { t } = useTranslation();

    return (
        <div className="auth-form">
            <input
                required
                className="auth-input"
                name="name"
                placeholder={t('auth.fullName')}
                value={form.name}
                onChange={handleChange}
            />
            <input
                required
                className="auth-input"
                type="email"
                name="email"
                placeholder={t('auth.email')}
                value={form.email}
                onChange={handleChange}
            />
            <input
                required
                className="auth-input"
                type="password"
                name="password"
                placeholder={t('auth.password')}
                value={form.password}
                onChange={handleChange}
            />
            <input
                className="auth-input"
                type="tel"
                name="phone"
                placeholder={t('auth.phone')}
                value={form.phone}
                onChange={handleChange}
            />

            <select
                required
                className="auth-input auth-select"
                name="gender"
                value={form.gender}
                onChange={handleChange}
            >
                <option value="">{t('auth.selectGender')}</option>
                <option value="female">{t('auth.female')}</option>
                <option value="male">{t('auth.male')}</option>
            </select>

            <input
                required
                className="auth-input"
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
            />
        </div>
    );
});

// Memoized LocationStep component
const LocationStep = React.memo(({
    form,
    handleChange,
    locationSuggestions,
    searchLocation,
    handleLocationSelect
}) => {
    const { t } = useTranslation();

    return (
        <div className="auth-form">
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    {t('auth.searchLocation', 'Search Location')}
                </label>
                <AutoComplete
                    options={locationSuggestions}
                    onSearch={searchLocation}
                    onSelect={handleLocationSelect}
                    placeholder={t('auth.enterLocation', 'Enter your location')}
                    style={{ width: '100%' }}
                    size="large"
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '0.5rem' }}>
                    {t('auth.locationHelp', 'Start typing to see location suggestions')}
                </p>
            </div>

            <input
                className="auth-input"
                name="address.address_line1"
                placeholder={t('auth.addressLine1', 'Address Line 1')}
                value={form.address.address_line1}
                onChange={handleChange}
            />
            <input
                className="auth-input"
                name="address.address_line2"
                placeholder={t('auth.addressLine2', 'Address Line 2')}
                value={form.address.address_line2}
                onChange={handleChange}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                    className="auth-input"
                    style={{ flex: 1 }}
                    name="address.city"
                    placeholder={t('auth.city', 'City')}
                    value={form.address.city}
                    onChange={handleChange}
                />
                <input
                    className="auth-input"
                    style={{ flex: 1 }}
                    name="address.region"
                    placeholder={t('auth.region', 'Region')}
                    value={form.address.region}
                    onChange={handleChange}
                />
            </div>

            <input
                className="auth-input"
                name="address.postal_code"
                placeholder={t('auth.postalCode', 'Postal Code')}
                value={form.address.postal_code}
                onChange={handleChange}
            />

            <div style={{ background: '#f0f8ff', padding: '1rem', borderRadius: '6px', marginTop: '1rem' }}>
                <p style={{ fontSize: '14px', color: '#1890ff', margin: 0 }}>
                    💡 {t('auth.locationSuggestion', 'Location helps us suggest nearby mosques and courses')}
                </p>
            </div>
        </div>
    );
});

const Register = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        address: {
            address_line1: "",
            address_line2: "",
            city: "",
            region: "",
            postal_code: "",
            is_primary: true
        }
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Use useCallback to memoize the handleChange function
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    }, []);

    // Memoize the location search function
    const searchLocation = useCallback(async (query) => {
        if (query.length < 3) {
            setLocationSuggestions([]);
            return;
        }

        const mockSuggestions = [
            { value: 'غزة - تل الهوا', coords: { lat: 31.5, lng: 34.466 } },
            { value: 'غزة - الرمال', coords: { lat: 31.52, lng: 34.45 } },
            { value: 'غزة - الشجاعية', coords: { lat: 31.51, lng: 34.47 } },
            { value: 'رفح - حي تل السلطان', coords: { lat: 31.29, lng: 34.25 } },
            { value: 'خان يونس - وسط المدينة', coords: { lat: 31.34, lng: 34.30 } },
        ].filter(item =>
            item.value.toLowerCase().includes(query.toLowerCase())
        );

        setLocationSuggestions(mockSuggestions);
    }, []);

    // Memoize the location select function
    const handleLocationSelect = useCallback((value, option) => {
        setForm(prev => ({
            ...prev,
            address: {
                ...prev.address,
                address_line1: value,
                city: 'غزة'
            }
        }));
    }, []);

    const next = () => {
        setCurrentStep(currentStep + 1);
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await registerUser(form);
            setMessage("Registration successful! You can now log in.");

            setForm({
                name: "",
                email: "",
                password: "",
                phone: "",
                gender: "",
                date_of_birth: "",
                address: {
                    address_line1: "",
                    address_line2: "",
                    city: "",
                    region: "",
                    postal_code: "",
                    is_primary: true
                }
            });

            navigate('/login');

        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: t('teacher.personalInfo'),
            icon: <UserOutlined />
        },
        {
            title: t('auth.locationInfo', 'Location Information'),
            icon: <EnvironmentOutlined />
        }
    ];

    return (
        <Layout className="auth-layout">
            <Header />
            <div className="auth-container">
                <Card className="auth-card">
                    <div className="auth-heading">{t('auth.createAccount')}</div>

                    <Steps current={currentStep} className="auth-steps" size="small">
                        {steps.map((step, index) => (
                            <Step key={index} title={step.title} icon={step.icon} />
                        ))}
                    </Steps>

                    {currentStep === 0 && (
                        <PersonalInfoStep
                            form={form}
                            handleChange={handleChange}
                        />
                    )}
                    {currentStep === 1 && (
                        <LocationStep
                            form={form}
                            handleChange={handleChange}
                            locationSuggestions={locationSuggestions}
                            searchLocation={searchLocation}
                            handleLocationSelect={handleLocationSelect}
                        />
                    )}

                    <div className="form-actions" style={{ marginTop: '2rem' }}>
                        <Space size="large">
                            {currentStep > 0 && (
                                <Button
                                    size="large"
                                    icon={<ArrowLeftOutlined />}
                                    onClick={prev}
                                    disabled={loading}
                                >
                                    {t('common.previous', 'Previous')}
                                </Button>
                            )}

                            {currentStep < steps.length - 1 ? (
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    onClick={next}
                                >
                                    {t('common.next', 'Next')}
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    size="large"
                                    loading={loading}
                                    onClick={handleSubmit}
                                >
                                    {t('auth.createAccount')}
                                </Button>
                            )}
                        </Space>
                    </div>

                    {message && (
                        <div className={`auth-message ${message.includes("successful") ? "success" : "error"}`}>
                            {message}
                        </div>
                    )}

                    <div className="social-account-container">
                        <span className="title">{t('auth.orSignUpWith')}</span>
                        <div className="social-accounts">
                            <button className="social-button google" type="button">
                                <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                            </button>
                            <button className="social-button apple" type="button">
                                <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <span className="agreement">
                        <a href="/register/teacher">{t('auth.teacherRegister')}</a>
                    </span>
                </Card>
            </div>
            <Footer />
        </Layout>
    );
};

export default Register;