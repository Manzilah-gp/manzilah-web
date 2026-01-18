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

            {/* ✅ NEW: Parent Profile Checkbox */}
            <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#f0f8ff',
                borderRadius: '12px',
                border: '2px solid #3b82f6'
            }}>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#1e40af'
                }}>
                    <input
                        type="checkbox"
                        name="isParent"
                        checked={form.isParent}
                        onChange={handleChange}
                        style={{
                            marginRight: '10px',
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                        }}
                    />
                    {t('auth.registerAsParent') || '👨‍👩‍👧‍👦 Register as Parent/Guardian'}
                </label>
                <p style={{
                    margin: '8px 0 0 28px',
                    fontSize: '12px',
                    color: '#6b7280',
                    lineHeight: '1.4'
                }}>
                    {t('auth.parentCheckboxHint') ||
                        'Check this if you are registering to monitor your children\'s progress. You can add your children after logging in.'}
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
        confirmPassword: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        isParent: false,
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
        const { name, value, type, checked } = e.target;

        // ✅ Determine the value based on input type
        const fieldValue = type === 'checkbox' ? checked : value;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: fieldValue
                }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: fieldValue }));
        }
    }, []);

    // ✅ DEBUG: Log form state changes to verify checkbox behavior
    React.useEffect(() => {
        console.log('Form state updated:', form);
        console.log('isParent value:', form.isParent);
    }, [form]);

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
            const registrationData = {
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
                gender: form.gender,
                date_of_birth: form.date_of_birth,
                address: form.address,
                roles: form.isParent ? ['parent'] : []
            };

            const res = await registerUser(registrationData);

            const successMessage = form.isParent
                ? "Parent account registered successfully! You can now log in and add your children."
                : "Registration successful! You can now log in.";

            setMessage(successMessage);

            // Reset form
            setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                phone: "",
                gender: "",
                date_of_birth: "",
                isParent: false,
                address: {
                    address_line1: "",
                    address_line2: "",
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