// src/pages/TeacherRegistrationPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Layout, Card, Steps, Button, message, Space } from 'antd';
import {
    UserOutlined,
    SolutionOutlined,
    BankOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PersonalInfoForm from '../../components/TeacherRegistration/PersonalInfoForm';
import QualificationsForm from '../../components/TeacherRegistration/QualificationsForm';
import MosquePreferencesForm from '../../components/TeacherRegistration/MosquePreferencesForm';
import { useTeacherRegistration } from '../../hooks/Forms/useTeacherRegistration';
import './TeacherRegistrationPage.css';
import { useTranslation } from 'react-i18next';

const { Content } = Layout;
const { Step } = Steps;


const TeacherRegistrationPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const formContainerRef = useRef(null);
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        // Personal Information
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gender: '',
        dob: '',
        address: {
            address_line1: '',
            address_line2: '',
            // city: '',
            region: '',
            governorate: '',
            postal_code: '',
            latitude: "",
            longitude: "",
            is_primary: true
        },

        // Qualifications
        has_tajweed_certificate: false,
        has_sharea_certificate: false,
        tajweed_certificate_url: '',
        sharea_certificate_url: '',
        experience_years: 0,
        previous_mosques: [],
        additional_qualifications: '',

        // Expertise & Preferences (merged into step 3)
        course_expertise: [],
        max_level_qualified: 1,
        hourly_rate_cents: 0,
        preferred_mosques: [],
        availability: {},
        preferred_teaching_format: 'onsite',
        teaching_style: [],
        student_age_preference: []
    });

    const { submitRegistration, loading, error } = useTeacherRegistration();

    // Scroll to top when step changes
    useEffect(() => {
        if (formContainerRef.current) {
            formContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentStep]);

    const steps = [
        {
            title: t('teacher.personalInfo'),
            icon: <UserOutlined />,
            component: PersonalInfoForm
        },
        {
            title: t('teacher.qualifications'),
            icon: <SolutionOutlined />,
            component: QualificationsForm
        },
        {
            title: t('teacher.preferences'),
            icon: <BankOutlined />,
            component: MosquePreferencesForm
        }
    ];

    const updateFormData = (newData) => {
        setFormData(prev => ({
            ...prev,
            ...newData
        }));
    };

    const next = () => {
        // Validate current step before proceeding
        if (validateCurrentStep()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const validateCurrentStep = () => {
        // Add validation logic for each step if needed
        return true;
    };

    const handleSubmit = async () => {
        try {
            const result = await submitRegistration(formData);
            if (result.success) {
                message.success('تم تقديم طلب التسجيل بنجاح! يرجى انتظار موافقة الإدارة.');
                // Reset form or redirect
                setCurrentStep(0);
                setFormData({});
            } else {
                message.error(error || 'فشل في التسجيل. يرجى المحاولة مرة أخرى.');
            }
        } catch (err) {
            message.error('حدث خطأ أثناء التسجيل.');
        }
    };

    const CurrentFormComponent = steps[currentStep].component;

    return (
        <Layout className="teacher-registration-layout">
            <Header />
            <Content className="registration-content">
                <div className="registration-container">
                    <Card className="registration-card">
                        <div className="registration-header">
                            <h1> {t('teacher.newRegistration')} </h1>
                            <p> {t('teacher.joinUs')} </p>
                        </div>

                        <Steps current={currentStep} className="registration-steps">
                            {steps.map((step, index) => (
                                <Step
                                    key={index}
                                    title={step.title}
                                    icon={step.icon}
                                />
                            ))}
                        </Steps>

                        <div className="form-container-tr" ref={formContainerRef}>
                            <CurrentFormComponent
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        </div>

                        <div className="form-actions">
                            <Space size="large">
                                {currentStep > 0 && (
                                    <Button
                                        size="large"
                                        icon={<ArrowLeftOutlined />}
                                        onClick={prev}
                                        disabled={loading}
                                    >
                                        {t('common.previous')}
                                    </Button>
                                )}

                                {currentStep < steps.length - 1 ? (
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ArrowRightOutlined />}
                                        onClick={next}
                                    >
                                        {t('common.next')}
                                    </Button>
                                ) : (
                                    <Button
                                        type="primary"
                                        size="large"
                                        loading={loading}
                                        onClick={handleSubmit}
                                    >
                                        {t('common.submit')}
                                    </Button>
                                )}
                            </Space>
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                    </Card>
                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

export default TeacherRegistrationPage;