/*
 Stripe Elements integration
 Progress bar with goal tracking
 Optional message field
 Anonymous donation option
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
import { message, Modal, Input, Checkbox, Button, InputNumber } from 'antd';
import './DonationForm.css';

// Initialize Stripe with environment variable (Vite uses import.meta.env)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Main donation form with Stripe Elements
const DonationFormContent = ({ event, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [amount, setAmount] = useState(event.min_donation_cents / 100);
  const [donorMessage, setDonorMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create payment intent on backend
      // ✅ FIXED: Send dollars (not cents), backend will convert
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

      message.success('Thank you for your donation!');
      onSuccess(confirmData);

    } catch (error) {
      console.error('Donation error:', error);
      message.error(error.message || 'Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining amount needed
  const remainingAmount = (event.fundraising_goal_cents - event.current_donations_cents) / 100;
  const progressPercent = (event.current_donations_cents / event.fundraising_goal_cents) * 100;

  return (
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