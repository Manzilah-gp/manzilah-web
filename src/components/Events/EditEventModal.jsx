import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Button, message } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

// Edit Event Modal - Allows mosque admin to edit and resubmit rejected events
const EditEventModal = ({ visible, onClose, onSuccess, event }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState('');

  // Populate form with existing event data when modal opens
  useEffect(() => {
    if (event && visible) {
      form.setFieldsValue({
        title: event.title,
        description: event.description,
        event_type: event.event_type,
        event_date: event.event_date ? dayjs(event.event_date) : null,
        event_time: event.event_time ? dayjs(event.event_time, 'HH:mm:ss') : null,
        location: event.location,
      });
      setEventType(event.event_type);
    }
  }, [event, visible, form]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const eventData = {
        title: values.title,
        description: values.description,
        event_date: values.event_date.format('YYYY-MM-DD'),
        event_time: values.event_time ? values.event_time.format('HH:mm:ss') : null,
        location: values.location,
        event_type: values.event_type,
        // Reset approval status to pending for fundraising events
        approval_status: values.event_type === 'fundraising' ? 'pending' : 'approved',
      };

      const response = await fetch(`http://localhost:5000/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();

      if (data.success) {
        if (values.event_type === 'fundraising') {
          message.success('Event updated and resubmitted for approval!');
        } else {
          message.success('Event updated successfully!');
        }
        form.resetFields();
        onSuccess();
      } else {
        message.error(data.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      message.error('An error occurred while updating the event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit & Resubmit Event"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
            onChange={setEventType}
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
              ⚠️ Note: Fundraising events require ministry approval before publication. Your event will be reviewed again after resubmission.
            </p>
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
              Update & Resubmit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEventModal;