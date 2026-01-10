// ============================================
// FILE: web/src/components/Donations/DonationSuccessModal.jsx
// PURPOSE: Show success message after donation with receipt download
// ============================================

import React, { useState } from 'react';
import { Modal, Button, Result, message } from 'antd';
import { 
    DownloadOutlined, 
    CheckCircleOutlined,
    HeartOutlined 
} from '@ant-design/icons';

/**
 * DonationSuccessModal Component
 * Shows after successful donation with receipt download option
 * 
 * PROPS:
 * - visible: boolean - Show/hide modal
 * - onClose: function - Close modal callback
 * - donationId: number - ID of the donation
 * - amount: number - Donation amount in dollars
 * - eventTitle: string - Name of the event
 * - receiptNumber: string - Receipt number
 * 
 * USAGE:
 * <DonationSuccessModal
 *   visible={showSuccess}
 *   onClose={() => setShowSuccess(false)}
 *   donationId={123}
 *   amount={50}
 *   eventTitle="Build New Classrooms"
 *   receiptNumber="2026-0001"
 * />
 */
const DonationSuccessModal = ({ 
    visible, 
    onClose, 
    donationId, 
    amount, 
    eventTitle,
    receiptNumber 
}) => {
    const [downloading, setDownloading] = useState(false);

    /**
     * Download PDF receipt
     * Calls backend API and triggers browser download
     */
    const handleDownloadReceipt = async () => {
        try {
            setDownloading(true);
            
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/donations/${donationId}/receipt`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                // Create blob from response
                const blob = await response.blob();
                
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `receipt-${receiptNumber}.pdf`;
                document.body.appendChild(a);
                a.click();
                
                // Cleanup
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                message.success('Receipt downloaded successfully!');
            } else {
                message.error('Failed to download receipt');
            }
        } catch (error) {
            console.error('Error downloading receipt:', error);
            message.error('Failed to download receipt');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={500}
            closeIcon={null}
            style={{ borderRadius: '12px' }}
        >
            <Result
                status="success"
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                title={
                    <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 600, color: '#262626' }}>
                            Donation Successful!
                        </div>
                        <div style={{ 
                            fontSize: '16px', 
                            color: '#8c8c8c', 
                            fontWeight: 400,
                            marginTop: '8px' 
                        }}>
                            Thank you for your generosity ❤️
                        </div>
                    </div>
                }
                subTitle={
                    <div style={{ 
                        background: '#f0f5ff', 
                        padding: '20px', 
                        borderRadius: '8px',
                        marginTop: '16px'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: '12px'
                        }}>
                            <span style={{ color: '#595959', fontWeight: 500 }}>Event:</span>
                            <span style={{ color: '#262626', fontWeight: 600 }}>{eventTitle}</span>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: '12px'
                        }}>
                            <span style={{ color: '#595959', fontWeight: 500 }}>Amount:</span>
                            <span style={{ 
                                color: '#52c41a', 
                                fontWeight: 700,
                                fontSize: '18px'
                            }}>
                                ${amount.toFixed(2)}
                            </span>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between'
                        }}>
                            <span style={{ color: '#595959', fontWeight: 500 }}>Receipt #:</span>
                            <span style={{ color: '#262626', fontWeight: 600 }}>{receiptNumber}</span>
                        </div>
                    </div>
                }
                extra={[
                    <Button
                        key="download"
                        type="primary"
                        size="large"
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadReceipt}
                        loading={downloading}
                        style={{
                            height: '48px',
                            fontSize: '16px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            width: '100%',
                            marginBottom: '12px',
                            background: '#1890ff',
                            borderColor: '#1890ff'
                        }}
                    >
                        Download Receipt PDF
                    </Button>,
                    <Button
                        key="close"
                        size="large"
                        onClick={onClose}
                        style={{
                            height: '48px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            width: '100%'
                        }}
                    >
                        Close
                    </Button>
                ]}
            />

            {/* Optional: Add note about receipt */}
            <div style={{ 
                textAlign: 'center', 
                color: '#8c8c8c', 
                fontSize: '13px',
                marginTop: '16px',
                padding: '0 24px 24px'
            }}>
                <HeartOutlined style={{ marginRight: '6px' }} />
                Your receipt has been saved and can be downloaded anytime from your donation history
            </div>
        </Modal>
    );
};

export default DonationSuccessModal;