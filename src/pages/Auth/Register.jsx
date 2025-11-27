import React, { useState, useCallback } from "react";
import { registerUser } from "../../api/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout, Steps, Button, Space, Card } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import LocationStep from '../../components/Auth/LocationStep';
import './Auth.css';

const { Step } = Steps;

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
                required
                className="auth-input"
                type="password"
                name="confirmPassword"
                placeholder={t('auth.confirmPassword')}
                value={form.confirmPassword}
                onChange={handleChange}
            />

            {form.password && form.confirmPassword && (form.password !== form.confirmPassword) && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: '20px', marginBottom: '-10px' }}>

                    {t('auth.passwordsDoNotMatch') || "Passwords do not match"}

                </div>
            )}

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

const Register = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        address: {
            address_line1: "",
            address_line2: "",
            //city: "",
            region: "",
            governorate: "",
            postal_code: "",
            latitude: "",
            longitude: "",
            is_primary: true
        }
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
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

    // Add this function inside the Register component, after handleChange

    const onMapSelect = useCallback((locationData) => {
        setForm(prev => ({
            ...prev,
            address: {
                ...prev.address,
                address_line1: locationData.address_line1 || '',
                //city: locationData.city || '',
                region: locationData.region || locationData.city || '',
                // governorate: locationData.governorate || '',
                postal_code: locationData.postal_code || '',
                latitude: locationData.latitude || '',
                longitude: locationData.longitude || ''
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

        if (form.password !== form.confirmPassword) {
            setMessage(t('auth.passwordsDoNotMatch') || "Passwords do not match");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await registerUser(form);
            setMessage("Registration successful! You can now log in.");

            setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                phone: "",
                gender: "",
                date_of_birth: "",
                address: {
                    address_line1: "",
                    address_line2: "",
                    // city: "",
                    region: "",
                    governorate: "",
                    postal_code: "",
                    latitude: "",
                    longitude: "",
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
                            form={form.address}
                            handleChange={handleChange}
                            onMapSelect={onMapSelect}
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