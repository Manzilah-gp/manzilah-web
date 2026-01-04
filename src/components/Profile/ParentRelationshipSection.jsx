

import React, { useState, useEffect } from 'react';
import { message, Modal, Input, Select } from 'antd';
import { 
    requestRelationship, 
    getMyRequests,
    getMyChildren 
} from '../../api/parent';
import './ParentRelationshipSection.css';
import { Button } from 'antd';


const { Option } = Select;

/**
 * Parent Relationship Section Component
 * PURPOSE: Allows parents to:
 * 1. Request relationship with children by email
 * 2. View all sent requests and their status
 * 3. View verified children
 */
const ParentRelationshipSection = () => {
    const [children, setChildren] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [childEmail, setChildEmail] = useState('');
    const [relationshipType, setRelationshipType] = useState('father');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Fetch verified children and pending requests
     */
    const fetchData = async () => {
        setLoading(true);
        try {
            const [childrenRes, requestsRes] = await Promise.all([
                getMyChildren(),
                getMyRequests()
            ]);

            if (childrenRes.data.success) {
                setChildren(childrenRes.data.data);
            }

            if (requestsRes.data.success) {
                setRequests(requestsRes.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle relationship request submission
     */
    const handleSubmit = async () => {
        if (!childEmail) {
            message.error('Please enter child\'s email');
            return;
        }

        if (!relationshipType) {
            message.error('Please select relationship type');
            return;
        }

        setSubmitting(true);
        try {
            const response = await requestRelationship(childEmail, relationshipType);
            
            if (response.data.success) {
                message.success(response.data.message);
                setShowModal(false);
                setChildEmail('');
                setRelationshipType('father');
                fetchData(); // Refresh list
            }
        } catch (error) {
            message.error(
                error.response?.data?.message || 'Failed to send request'
            );
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="parent-section loading">
                <div className="spinner"></div>
                <p>Loading children...</p>
            </div>
        );
    }

    return (
        <div className="parent-relationship-section">
            {/* Header */}
            <div className="section-header">
                <div>
                    <h2>My Children</h2>
                    <p>Manage your children's accounts and track their progress</p>
                </div>
               <Button
    type="primary"
    className="btn-add-child"
    onClick={() => setShowModal(true)}
>
    <span className="icon">➕</span>
    Add Child
</Button>

            </div>

            {/* Verified Children List */}
            <div className="children-list">
                <h3 className="subsection-title">
                    Verified Children ({children.length})
                </h3>
                
                {children.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">👨‍👧‍👦</div>
                        <p>No verified children yet</p>
                        <p className="hint">Click "Add Child" to send a relationship request</p>
                    </div>
                ) : (
                    <div className="children-grid">
                        {children.map(child => (
                            <div key={child.relationship_id} className="child-card">
                                <div className="child-avatar">
                                    {child.child_gender === 'male' ? '👦' : '👧'}
                                </div>
                                <div className="child-info">
                                    <h4>{child.child_name}</h4>
                                    <p className="child-email">{child.child_email}</p>
                                    <div className="child-meta">
                                        <span className="badge relationship">
                                            {child.relationship_type}
                                        </span>
                                        <span className="badge enrollments">
                                            {child.total_enrollments} courses
                                        </span>
                                    </div>
                                    <p className="verified-date">
                                        Verified: {formatDate(child.verified_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pending Requests */}
            {requests.length > 0 && (
                <div className="requests-list">
                    <h3 className="subsection-title">
                        Pending Requests ({requests.filter(r => !r.is_verified).length})
                    </h3>
                    
                    <div className="requests-table">
                        {requests.map(request => (
                            <div key={request.id} className="request-row">
                                <div className="request-info">
                                    <div className="request-name">
                                        {request.child_name}
                                    </div>
                                    <div className="request-email">
                                        {request.child_email}
                                    </div>
                                </div>
                                <div className="request-type">
                                    <span className="badge">
                                        {request.relationship_type}
                                    </span>
                                </div>
                                <div className="request-status">
                                    {request.is_verified ? (
                                        <span className="status verified">
                                            ✓ Verified
                                        </span>
                                    ) : (
                                        <span className="status pending">
                                            ⏳ Pending
                                        </span>
                                    )}
                                </div>
                                <div className="request-date">
                                    {formatDate(request.created_at)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Child Modal */}
            <Modal
                title="Add Child"
                open={showModal}
                onOk={handleSubmit}
                onCancel={() => {
                    setShowModal(false);
                    setChildEmail('');
                    setRelationshipType('father');
                }}
                okText="Send Request"
                cancelText="Cancel"
                confirmLoading={submitting}
                className="add-child-modal"
            >
                <div className="modal-content">
                    <p className="modal-description">
                        Enter your child's email address to send a relationship request. 
                        They will need to accept the request from their profile.
                    </p>
                    
                    <div className="form-group">
                        <label>Child's Email Address</label>
                        <Input
                            type="email"
                            placeholder="child@example.com"
                            value={childEmail}
                            onChange={(e) => setChildEmail(e.target.value)}
                            size="large"
                        />
                    </div>

                    <div className="form-group">
                        <label>Your Relationship</label>
                        <Select
                            value={relationshipType}
                            onChange={setRelationshipType}
                            size="large"
                            style={{ width: '100%' }}
                        >
                            <Option value="father">Father</Option>
                            <Option value="mother">Mother</Option>
                            <Option value="guardian">Guardian</Option>
                        </Select>
                    </div>

                    <div className="info-box">
                        <span className="info-icon">ℹ️</span>
                        <p>Your child must be registered as a student and accept your request.</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ParentRelationshipSection;