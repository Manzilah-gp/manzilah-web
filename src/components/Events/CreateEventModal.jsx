import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Button, message, InputNumber, Checkbox } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

// Create Event Modal - Updated with Fundraising Settings
const CreateEventModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState('');

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Base event data
      const eventData = {
        title: values.title,
        description: values.description,
        event_date: values.event_date.format('YYYY-MM-DD'),
        event_time: values.event_time ? values.event_time.format('HH:mm:ss') : null,
        location: values.location,
        event_type: values.event_type,
      };

      // Add fundraising fields if event type is fundraising
      if (values.event_type === 'fundraising') {
        // Validate fundraising goal
        if (!values.fundraising_goal || values.fundraising_goal < 1) {
          message.error('Fundraising goal must be at least $1.00');
          setLoading(false);
          return;
        }

        // Convert dollars to cents
// ✅ NEW - Send dollars, backend will convert
eventData.fundraising_goal = values.fundraising_goal;  // Send as dollars
eventData.min_donation = values.min_donation || 10;    // Send as dollars
        eventData.show_donors = values.show_donors !== false; // Default true
        eventData.allow_anonymous = values.allow_anonymous !== false; // Default true
      }

      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();

      if (data.success) {
        if (data.approval_status === 'pending') {
          message.warning('Event created successfully! Waiting for ministry approval');
        } else {
          message.success('Event created and published successfully!');
        }
        form.resetFields();
        setEventType(''); // Reset event type
        onSuccess();
      } else {
        message.error(data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      message.error('An error occurred while creating the event');
    } finally {
      setLoading(false);
    }
  };

  // Handle event type change
  const handleEventTypeChange = (value) => {
    setEventType(value);
    
    // Set default values for fundraising fields when switching to fundraising
    if (value === 'fundraising') {
      form.setFieldsValue({
        min_donation: 10,
        show_donors: true,
        allow_anonymous: true
      });
    }
  };

  return (
    <Modal
      title="Create New Event"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          show_donors: true,
          allow_anonymous: true,
          min_donation: 10
        }}
      >
        {/* Event Title */}
        <Form.Item
          name="title"
          label="Event Title"
          rules={[{ required: true, message: 'Please enter event title' }]}
        >
          <Input placeholder="Example: Religious Lecture, Honor Ceremony, Charity Campaign" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter event description' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Write a detailed description of the event..."
          />
        </Form.Item>

        {/* Event Type */}
        <Form.Item
          name="event_type"
          label="Event Type"
          rules={[{ required: true, message: 'Please select event type' }]}
        >
          <Select 
            placeholder="Select event type"
            onChange={handleEventTypeChange}
          >
            <Option value="religious">Religious</Option>
            <Option value="educational">Educational</Option>
            <Option value="social">Social</Option>
            <Option value="fundraising">Fundraising</Option>
          </Select>
        </Form.Item>

        {/* Fundraising Notice */}
        {eventType === 'fundraising' && (
          <div style={{ 
            background: '#fff7e6', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #ffd591'
          }}>
            <p style={{ margin: 0, color: '#fa8c16', fontSize: '13px' }}>
              ⚠️ Note: Fundraising events require ministry approval before publication
            </p>
          </div>
        )}

        {/* ===================================================== */}
        {/* FUNDRAISING SETTINGS (Only show for fundraising events) */}
        {/* ===================================================== */}
        {eventType === 'fundraising' && (
          <div style={{
            background: '#f0f9ff',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #91d5ff'
          }}>
            <h4 style={{ 
              margin: '0 0 16px 0', 
              color: '#0958d9', 
              fontSize: '16px',
              fontWeight: 600 
            }}>
              Fundraising Settings
            </h4>

            {/* Fundraising Goal */}
            <Form.Item
              name="fundraising_goal"
              label="Fundraising Goal ($)"
              rules={[
                { required: true, message: 'Please enter fundraising goal' },
                { 
                  type: 'number', 
                  min: 1, 
                  message: 'Goal must be at least $1.00' 
                }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={2}
                placeholder="5000.00"
                prefix="$"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <div style={{ marginTop: -16, marginBottom: 12, fontSize: 12, color: '#8c8c8c' }}>
              The total amount you want to raise for this campaign
            </div>

            {/* Minimum Donation */}
            <Form.Item
              name="min_donation"
              label="Minimum Donation ($)"
              rules={[
                { 
                  type: 'number', 
                  min: 1, 
                  message: 'Minimum must be at least $1.00' 
                }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={2}
                placeholder="10.00"
                prefix="$"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <div style={{ marginTop: -16, marginBottom: 12, fontSize: 12, color: '#8c8c8c' }}>
              The minimum amount a donor can contribute (default: $10)
            </div>

            {/* Privacy Settings */}
            <Form.Item
              name="show_donors"
              valuePropName="checked"
            >
              <Checkbox>
                Show donor names publicly
              </Checkbox>
            </Form.Item>
            <div style={{ marginTop: -16, marginBottom: 12, marginLeft: 24, fontSize: 12, color: '#8c8c8c' }}>
              If unchecked, all donations will appear as "Anonymous"
            </div>

            <Form.Item
              name="allow_anonymous"
              valuePropName="checked"
            >
              <Checkbox>
                Allow anonymous donations
              </Checkbox>
            </Form.Item>
            <div style={{ marginTop: -16, marginBottom: 0, marginLeft: 24, fontSize: 12, color: '#8c8c8c' }}>
              Let donors choose to hide their names
            </div>
          </div>
        )}

        {/* Event Date */}
        <Form.Item
          name="event_date"
          label="Event Date"
          rules={[{ required: true, message: 'Please select event date' }]}
        >
          <DatePicker 
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder="Select date"
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>

        {/* Event Time (Optional) */}
        <Form.Item
          name="event_time"
          label="Event Time (Optional)"
        >
          <TimePicker 
            style={{ width: '100%' }}
            format="HH:mm"
            placeholder="Select time"
          />
        </Form.Item>

        {/* Location (Optional) */}
        <Form.Item
          name="location"
          label="Location (Optional)"
        >
          <Input placeholder="Example: Main Mosque Hall" />
        </Form.Item>

        {/* Action Buttons */}
        <Form.Item>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Event
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEventModal;