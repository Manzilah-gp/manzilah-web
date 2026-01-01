// =====================================================
/*
Update fundraising goal
Set minimum donation amount
Shows current progress
Admin authorization required
FIXED: Sends dollars, backend converts to cents
*/
// =====================================================

import React, { useState } from 'react';
import { Modal, Form, InputNumber, Button, message } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const ManageFundraisingGoal = ({ event, visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Initialize form with existing values
  useState(() => {
    if (event) {
      form.setFieldsValue({
        fundraising_goal: event.fundraising_goal_cents / 100,
        min_donation: event.min_donation_cents / 100
      });
    }
  }, [event]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // ✅ FIXED: Send dollars, backend will convert to cents
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/donations/event/${event.id}/goal`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            fundraising_goal: values.fundraising_goal,  // ✅ Send dollars
            min_donation: values.min_donation            // ✅ Send dollars
          })
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      message.success('Fundraising goal updated successfully');
      form.resetFields();
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Error updating goal:', error);
      message.error(error.message || 'Failed to update fundraising goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Manage Fundraising Goal"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          fundraising_goal: event?.fundraising_goal_cents / 100 || 0,
          min_donation: event?.min_donation_cents / 100 || 10
        }}
      >
        {/* Current Progress */}
        {event && (
          <div style={{ 
            padding: '15px', 
            background: '#f5f5f5', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, color: '#666' }}>
              <strong>Current Progress:</strong>
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '16px', fontWeight: 'bold' }}>
              ${(event.current_donations_cents / 100).toFixed(2)} raised
              {event.fundraising_goal_cents > 0 && (
                <span style={{ color: '#999', fontSize: '14px', marginLeft: '8px' }}>
                  of ${(event.fundraising_goal_cents / 100).toFixed(2)}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Fundraising Goal Input */}
        <Form.Item
          label="Fundraising Goal (USD)"
          name="fundraising_goal"
          rules={[
            { required: true, message: 'Please enter a fundraising goal' },
            { 
              type: 'number', 
              min: 100, 
              message: 'Goal must be at least $100' 
            }
          ]}
        >
          <InputNumber
            prefix={<DollarOutlined />}
            style={{ width: '100%' }}
            step={100}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            size="large"
          />
        </Form.Item>

        {/* Minimum Donation Input */}
        <Form.Item
          label="Minimum Donation Amount (USD)"
          name="min_donation"
          rules={[
            { required: true, message: 'Please enter minimum donation amount' },
            { 
              type: 'number', 
              min: 1, 
              message: 'Minimum must be at least $1' 
            }
          ]}
        >
          <InputNumber
            prefix={<DollarOutlined />}
            style={{ width: '100%' }}
            step={5}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            size="large"
          />
        </Form.Item>

        {/* Submit Buttons */}
        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Goal
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManageFundraisingGoal;