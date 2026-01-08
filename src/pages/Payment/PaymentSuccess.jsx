// ============================================
// FILE: src/pages/Payment/PaymentSuccess.jsx
// PURPOSE: Handle Stripe redirect and complete enrollment
// UPDATED: Navigate to /dashboard/my-enrollments (inside layout)
// ============================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Result, Spin, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api from '../../api/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [courseName, setCourseName] = useState('');

    useEffect(() => {
        const completeEnrollment = async () => {
            try {
                const sessionId = searchParams.get('session_id');

                if (!sessionId) {
                    setError('Invalid payment session');
                    setLoading(false);
                    return;
                }

                // Call backend to verify payment and complete enrollment
                const response = await api.post('/enrollment/complete-payment', {
                    sessionId
                });

                if (response.data.success) {
                    setSuccess(true);
                    setCourseName(response.data.data.courseName);
                } else {
                    setError(response.data.message || 'Enrollment failed');
                }
            } catch (err) {
                console.error('Error completing enrollment:', err);
                setError(err.response?.data?.message || 'Failed to complete enrollment');
            } finally {
                setLoading(false);
            }
        };

        completeEnrollment();
    }, [searchParams]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: '#f0f2f5'
            }}>
                <Spin size="large" tip="Completing your enrollment..." />
            </div>
        );
    }

    if (success) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                padding: '20px',
                backgroundColor: '#f0f2f5'
            }}>
                <Result
                    status="success"
                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    title="Payment Successful!"
                    subTitle={`You have been successfully enrolled in ${courseName}`}
                    extra={[
                        <Button 
                            type="primary" 
                            key="enrollments"
                            size="large"
                            onClick={() => navigate('/dashboard/my-enrollments')}
                        >
                            View My Enrollments
                        </Button>,
                        <Button 
                            key="courses"
                            size="large"
                            onClick={() => navigate('/public/courses')}
                        >
                            Browse More Courses
                        </Button>
                    ]}
                />
            </div>
        );
    }

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: '#f0f2f5'
        }}>
            <Result
                status="error"
                icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                title="Enrollment Failed"
                subTitle={error || 'Something went wrong'}
                extra={[
                    <Button 
                        type="primary" 
                        key="try-again"
                        size="large"
                        onClick={() => navigate('/public/courses')}
                    >
                        Try Again
                    </Button>
                ]}
            />
        </div>
    );
};

export default PaymentSuccess;