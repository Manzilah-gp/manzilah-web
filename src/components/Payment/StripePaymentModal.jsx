// ============================================
// FILE: src/components/Payment/StripePaymentModal.jsx
// PURPOSE: Payment modal for course enrollment using Stripe
// REASON: Secure payment processing with Stripe Checkout
// ============================================

import React, { useState } from 'react';
import { Modal, Button, Spin, Alert, Typography, Divider, Row, Col } from 'antd';
import { CreditCardOutlined, LockOutlined } from '@ant-design/icons';
import { enrollInPaidCourse } from '../../api/enrollment';
import './StripePaymentModal.css';

const { Title, Text, Paragraph } = Typography;

/**
 * StripePaymentModal Component
 * Displays course details and handles Stripe checkout
 * REASON: Provide secure, user-friendly payment experience
 */
const StripePaymentModal = ({ visible, onCancel, course }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Handle payment button click
     * REASON: Redirect user to Stripe Checkout for secure payment
     */
    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            // Create Stripe checkout session via enrollment API
            const response = await enrollInPaidCourse(course.id);

            if (response.data.success && response.data.data.url) {
                // Redirect to Stripe Checkout page
                window.location.href = response.data.data.url;
            } else {
                setError('Failed to create payment session');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(err.response?.data?.message || 'An error occurred while processing payment');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Format price from cents to dollars
     * REASON: Display price in user-friendly format
     */
    const formatPrice = (cents) => {
        return (cents / 100).toFixed(2);
    };

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={500}
            className="stripe-payment-modal"
            centered
        >
            <div className="payment-modal-content">
                {/* Header with lock icon for security indication */}
                <div className="payment-header">
                    <LockOutlined className="security-icon" />
                    <Title level={3}>Secure Payment</Title>
                    <Text type="secondary">Powered by Stripe</Text>
                </div>

                <Divider />

                {/* Course Details Section */}
                <div className="course-details-section">
                    <Title level={4}>Course Details</Title>

                    <Row className="detail-row">
                        <Col span={12}>
                            <Text strong>Course Name:</Text>
                        </Col>
                        <Col span={12} className="text-right">
                            <Text>{course?.name}</Text>
                        </Col>
                    </Row>

                    {course?.description && (
                        <Row className="detail-row">
                            <Col span={24}>
                                <Text type="secondary">{course.description}</Text>
                            </Col>
                        </Row>
                    )}

                    <Row className="detail-row">
                        <Col span={12}>
                            <Text strong>Duration:</Text>
                        </Col>
                        <Col span={12} className="text-right">
                            <Text>{course?.duration_weeks} weeks</Text>
                        </Col>
                    </Row>

                    <Row className="detail-row">
                        <Col span={12}>
                            <Text strong>Sessions:</Text>
                        </Col>
                        <Col span={12} className="text-right">
                            <Text>{course?.total_sessions} sessions</Text>
                        </Col>
                    </Row>
                </div>

                <Divider />

                {/* Price Section */}
                <div className="price-section">
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Text strong style={{ fontSize: '18px' }}>Total Amount:</Text>
                        </Col>
                        <Col>
                            <Title level={2} className="price-amount">
                                ${formatPrice(course?.price_cents || 0)}
                            </Title>
                        </Col>
                    </Row>
                </div>

                <Divider />

                {/* Error Display */}
                {error && (
                    <Alert
                        message="Payment Error"
                        description={error}
                        type="error"
                        closable
                        onClose={() => setError(null)}
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* Security Information */}
                <div className="security-info">
                    <Paragraph type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                        <LockOutlined /> Your payment information is secure and encrypted.
                        We use Stripe for payment processing and do not store your card details.
                    </Paragraph>
                </div>

                {/* Action Buttons */}
                <div className="payment-actions">
                    <Button
                        size="large"
                        onClick={onCancel}
                        disabled={loading}
                        style={{ marginRight: 12 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        icon={<CreditCardOutlined />}
                        onClick={handlePayment}
                        loading={loading}
                        className="pay-button"
                    >
                        {loading ? 'Processing...' : `Pay $${formatPrice(course?.price_cents || 0)}`}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default StripePaymentModal;