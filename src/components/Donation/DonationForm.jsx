// /*
//  Stripe Elements integration
//  Progress bar with goal tracking
//  Optional message field
//  Anonymous donation option
//  FIXED: Sends dollars, backend converts to cents
// */

// import React, { useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements
// } from '@stripe/react-stripe-js';
// import { message, Modal, Input, Checkbox, Button, InputNumber } from 'antd';
// import './DonationForm.css';

// // Initialize Stripe with environment variable (Vite uses import.meta.env)
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// // Main donation form with Stripe Elements
// const DonationFormContent = ({ event, onSuccess, onCancel }) => {
//   const stripe = useStripe();
//   const elements = useElements();
  
//   const [amount, setAmount] = useState(event.min_donation_cents / 100);
//   const [donorMessage, setDonorMessage] = useState('');
//   const [isAnonymous, setIsAnonymous] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     setLoading(true);

//     try {
//       // Step 1: Create payment intent on backend
//       // ✅ FIXED: Send dollars (not cents), backend will convert
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/donations/create-payment-intent`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           event_id: event.id,
//           amount: amount,  // ✅ Send dollars, backend converts to cents
//           donor_message: donorMessage,
//           is_anonymous: isAnonymous
//         })
//       });

//       const data = await response.json();

//       if (!data.success) {
//         throw new Error(data.message);
//       }

//       // Step 2: Confirm payment with Stripe
//       const { error, paymentIntent } = await stripe.confirmCardPayment(
//         data.clientSecret,
//         {
//           payment_method: {
//             card: elements.getElement(CardElement),
//           }
//         }
//       );

//       if (error) {
//         throw new Error(error.message);
//       }

//       // Step 3: Confirm donation on backend
//       const confirmResponse = await fetch(`${import.meta.env.VITE_API_URL}/donations/confirm`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           payment_intent_id: paymentIntent.id
//         })
//       });

//       const confirmData = await confirmResponse.json();

//       if (!confirmData.success) {
//         throw new Error(confirmData.message);
//       }

//       message.success('Thank you for your donation!');
//       onSuccess(confirmData);

//     } catch (error) {
//       console.error('Donation error:', error);
//       message.error(error.message || 'Failed to process donation');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate remaining amount needed
//   const remainingAmount = (event.fundraising_goal_cents - event.current_donations_cents) / 100;
//   const progressPercent = (event.current_donations_cents / event.fundraising_goal_cents) * 100;

//   return (
//     <form onSubmit={handleSubmit} className="donation-form">
//       {/* Event Info */}
//       <div className="event-info">
//         <h3>{event.title}</h3>
//         <div className="fundraising-progress">
//           <div className="progress-bar">
//             <div 
//               className="progress-fill" 
//               style={{ width: `${Math.min(progressPercent, 100)}%` }}
//             />
//           </div>
//           <div className="progress-text">
//             <span className="raised">
//               ${(event.current_donations_cents / 100).toFixed(2)} raised
//             </span>
//             <span className="goal">
//               of ${(event.fundraising_goal_cents / 100).toFixed(2)} goal
//             </span>
//           </div>
//           {remainingAmount > 0 && (
//             <p className="remaining">
//               ${remainingAmount.toFixed(2)} remaining to reach goal
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Donation Amount Input */}
//       <div className="form-group">
//         <label>Donation Amount (USD) *</label>
//         <InputNumber
//           min={event.min_donation_cents / 100}
//           max={100000}
//           step={5}
//           value={amount}
//           onChange={setAmount}
//           formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//           parser={value => value.replace(/\$\s?|(,*)/g, '')}
//           style={{ width: '100%' }}
//           size="large"
//         />
//         <small>Minimum donation: ${(event.min_donation_cents / 100).toFixed(2)}</small>
//       </div>

//       {/* Card Element */}
//       <div className="form-group">
//         <label>Card Details *</label>
//         <div className="card-element">
//           <CardElement 
//             options={{
//               style: {
//                 base: {
//                   fontSize: '16px',
//                   color: '#424770',
//                   '::placeholder': {
//                     color: '#aab7c4',
//                   },
//                 },
//                 invalid: {
//                   color: '#9e2146',
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>

//       {/* Optional Message */}
//       <div className="form-group">
//         <label>Message (Optional)</label>
//         <Input.TextArea
//           rows={3}
//           placeholder="Leave a message of support..."
//           value={donorMessage}
//           onChange={(e) => setDonorMessage(e.target.value)}
//           maxLength={500}
//         />
//       </div>

//       {/* Anonymous Option */}
//       {event.allow_anonymous && (
//         <div className="form-group">
//           <Checkbox
//             checked={isAnonymous}
//             onChange={(e) => setIsAnonymous(e.target.checked)}
//           >
//             Donate anonymously (your name won't be displayed publicly)
//           </Checkbox>
//         </div>
//       )}

//       {/* Submit Buttons */}
//       <div className="form-actions">
//         <Button onClick={onCancel} disabled={loading}>
//           Cancel
//         </Button>
//         <Button 
//           type="primary" 
//           htmlType="submit" 
//           loading={loading}
//           disabled={!stripe || loading}
//         >
//           Donate ${amount.toFixed(2)}
//         </Button>
//       </div>
//     </form>
//   );
// };

// // Modal wrapper for donation form
// export const DonationModal = ({ visible, event, onSuccess, onCancel }) => {
//   return (
//     <Modal
//       open={visible}
//       onCancel={onCancel}
//       footer={null}
//       width={600}
//       title="Make a Donation"
//       className="donation-modal"
//     >
//       <Elements stripe={stripePromise}>
//         <DonationFormContent 
//           event={event} 
//           onSuccess={onSuccess} 
//           onCancel={onCancel} 
//         />
//       </Elements>
//     </Modal>
//   );
// };

// export default DonationModal;
/*
 Stripe Elements integration
 Progress bar with goal tracking
 Optional message field
 Anonymous donation option
 ⭐ NEW: Success modal with PDF download button after donation
 FIXED: Sends dollars, backend converts to cents
*/

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { message, Modal, Input, Checkbox, Button, InputNumber, Result } from 'antd';
import { 
    DownloadOutlined, 
    CheckCircleOutlined,
    HeartOutlined 
} from '@ant-design/icons';
import './DonationForm.css';

// Initialize Stripe with environment variable (Vite uses import.meta.env)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ============================================
// ⭐ NEW COMPONENT: Success Modal with Download Button
// Shows after successful donation
// ============================================
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
     * Download PDF receipt from backend
     * Calls your existing route: GET /api/donations/:donation_id/receipt
     */
    const handleDownloadReceipt = async () => {
        try {
            setDownloading(true);
            
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/donations/${donationId}/receipt`,
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
            className="donation-success-modal"
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

            {/* Note about receipt availability */}
            <div style={{ 
                textAlign: 'center', 
                color: '#8c8c8c', 
                fontSize: '13px',
                marginTop: '16px',
                padding: '0 24px 24px'
            }}>
                <HeartOutlined style={{ marginRight: '6px' }} />
                Your receipt has been saved and can be downloaded anytime
            </div>
        </Modal>
    );
};

// ============================================
// Main donation form with Stripe Elements
// ⭐ UPDATED: Now shows success modal after donation
// ============================================
const DonationFormContent = ({ event, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [amount, setAmount] = useState(event.min_donation_cents / 100);
  const [donorMessage, setDonorMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  // ⭐ NEW: States for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [donationDetails, setDonationDetails] = useState({
      donationId: null,
      amount: 0,
      eventTitle: '',
      receiptNumber: ''
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create payment intent on backend
      // ✅ Send dollars (not cents), backend will convert
      const response = await fetch(`${import.meta.env.VITE_API_URL}/donations/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          event_id: event.id,
          amount: amount,  // ✅ Send dollars, backend converts to cents
          donor_message: donorMessage,
          is_anonymous: isAnonymous
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // Step 2: Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // Step 3: Confirm donation on backend
      const confirmResponse = await fetch(`${import.meta.env.VITE_API_URL}/donations/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntent.id
        })
      });

      const confirmData = await confirmResponse.json();

      if (!confirmData.success) {
        throw new Error(confirmData.message);
      }

      // ⭐ NEW: Show success modal instead of just a message
      setDonationDetails({
          donationId: confirmData.donation_id,
          amount: amount,
          eventTitle: event.title,
          receiptNumber: confirmData.receipt_number
      });
      setShowSuccessModal(true);

      // Still show the message
      message.success('Thank you for your donation!');
      
      // Still call parent onSuccess callback
      onSuccess(confirmData);

    } catch (error) {
      console.error('Donation error:', error);
      message.error(error.message || 'Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  // ⭐ NEW: Handle modal close
  const handleSuccessModalClose = () => {
      setShowSuccessModal(false);
      // Close the donation form modal too
      if (onCancel) {
          onCancel();
      }
  };

  // Calculate remaining amount needed
  const remainingAmount = (event.fundraising_goal_cents - event.current_donations_cents) / 100;
  const progressPercent = (event.current_donations_cents / event.fundraising_goal_cents) * 100;

  return (
    <>
      <form onSubmit={handleSubmit} className="donation-form">
        {/* Event Info */}
        <div className="event-info">
          <h3>{event.title}</h3>
          <div className="fundraising-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <div className="progress-text">
              <span className="raised">
                ${(event.current_donations_cents / 100).toFixed(2)} raised
              </span>
              <span className="goal">
                of ${(event.fundraising_goal_cents / 100).toFixed(2)} goal
              </span>
            </div>
            {remainingAmount > 0 && (
              <p className="remaining">
                ${remainingAmount.toFixed(2)} remaining to reach goal
              </p>
            )}
          </div>
        </div>

        {/* Donation Amount Input */}
        <div className="form-group">
          <label>Donation Amount (USD) *</label>
          <InputNumber
            min={event.min_donation_cents / 100}
            max={100000}
            step={5}
            value={amount}
            onChange={setAmount}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            style={{ width: '100%' }}
            size="large"
          />
          <small>Minimum donation: ${(event.min_donation_cents / 100).toFixed(2)}</small>
        </div>

        {/* Card Element */}
        <div className="form-group">
          <label>Card Details *</label>
          <div className="card-element">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Optional Message */}
        <div className="form-group">
          <label>Message (Optional)</label>
          <Input.TextArea
            rows={3}
            placeholder="Leave a message of support..."
            value={donorMessage}
            onChange={(e) => setDonorMessage(e.target.value)}
            maxLength={500}
          />
        </div>

        {/* Anonymous Option */}
        {event.allow_anonymous && (
          <div className="form-group">
            <Checkbox
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            >
              Donate anonymously (your name won't be displayed publicly)
            </Checkbox>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="form-actions">
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={!stripe || loading}
          >
            Donate ${amount.toFixed(2)}
          </Button>
        </div>
      </form>

      {/* ⭐ NEW: Success Modal with Download Receipt Button */}
      <DonationSuccessModal
          visible={showSuccessModal}
          onClose={handleSuccessModalClose}
          donationId={donationDetails.donationId}
          amount={donationDetails.amount}
          eventTitle={donationDetails.eventTitle}
          receiptNumber={donationDetails.receiptNumber}
      />
    </>
  );
};

// Modal wrapper for donation form
export const DonationModal = ({ visible, event, onSuccess, onCancel }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      title="Make a Donation"
      className="donation-modal"
    >
      <Elements stripe={stripePromise}>
        <DonationFormContent 
          event={event} 
          onSuccess={onSuccess} 
          onCancel={onCancel} 
        />
      </Elements>
    </Modal>
  );
};

export default DonationModal;