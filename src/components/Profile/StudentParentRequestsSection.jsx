//Student's section to accept/reject parent requests

import React, { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { 
    getPendingRequests, 
    acceptRequest, 
    rejectRequest 
} from '../../api/parent';
import './StudentParentRequestsSection.css';

const { confirm } = Modal;

/**
 * Student Parent Requests Section Component
 * PURPOSE: Allows students to:
 * 1. View pending parent relationship requests
 * 2. Accept or reject requests
 * 3. See who is requesting the relationship
 */
const StudentParentRequestsSection = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    /**
     * Fetch pending parent requests
     */
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await getPendingRequests();
            
            if (response.data.success) {
                setRequests(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            message.error('Failed to load parent requests');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle accept request
     */
    const handleAccept = async (requestId, parentName) => {
        confirm({
            title: 'Accept Parent Relationship?',
            content: `Do you want to accept ${parentName} as your parent? They will be able to view your course progress.`,
            okText: 'Accept',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk: async () => {
                setProcessing(requestId);
                try {
                    const response = await acceptRequest(requestId);
                    
                    if (response.data.success) {
                        message.success(response.data.message);
                        fetchRequests(); // Refresh list
                    }
                } catch (error) {
                    message.error(
                        error.response?.data?.message || 'Failed to accept request'
                    );
                } finally {
                    setProcessing(null);
                }
            }
        });
    };

    /**
     * Handle reject request
     */
    const handleReject = async (requestId, parentName) => {
        confirm({
            title: 'Reject Parent Relationship?',
            content: `Are you sure you want to reject the request from ${parentName}?`,
            okText: 'Reject',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                setProcessing(requestId);
                try {
                    const response = await rejectRequest(requestId);
                    
                    if (response.data.success) {
                        message.success('Request rejected');
                        fetchRequests(); // Refresh list
                    }
                } catch (error) {
                    message.error(
                        error.response?.data?.message || 'Failed to reject request'
                    );
                } finally {
                    setProcessing(null);
                }
            }
        });
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /**
     * Get relationship emoji
     */
    const getRelationshipEmoji = (type) => {
        switch(type) {
            case 'father': return '👨';
            case 'mother': return '👩';
            case 'guardian': return '🤝';
            default: return '👤';
        }
    };

    if (loading) {
        return (
            <div className="student-requests-section loading">
                <div className="spinner"></div>
                <p>Loading parent requests...</p>
            </div>
        );
    }

    // If no requests, don't show the section at all
    if (requests.length === 0) {
        return null;
    }

    return (
        <div className="student-parent-requests-section">
            {/* Header with badge */}
            <div className="section-header">
                <div>
                    <h2>Parent Relationship Requests</h2>
                    <p>You have {requests.length} pending request{requests.length !== 1 ? 's' : ''}</p>
                </div>
                <span className="requests-badge">{requests.length}</span>
            </div>

            {/* Requests List */}
            <div className="requests-list">
                {requests.map(request => (
                    <div key={request.id} className="request-card">
                        {/* Left side: Parent info */}
                        <div className="request-info">
                            <div className="parent-avatar">
                                {getRelationshipEmoji(request.relationship_type)}
                            </div>
                            <div className="parent-details">
                                <h4 className="parent-name">{request.parent_name}</h4>
                                <p className="parent-email">{request.parent_email}</p>
                                {request.parent_phone && (
                                    <p className="parent-phone">📞 {request.parent_phone}</p>
                                )}
                                <div className="request-meta">
                                    <span className="badge relationship">
                                        {request.relationship_type}
                                    </span>
                                    <span className="request-date">
                                        {formatDate(request.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right side: Actions */}
                        <div className="request-actions">
                            <button
                                className="btn-accept"
                                onClick={() => handleAccept(request.id, request.parent_name)}
                                disabled={processing === request.id}
                            >
                                {processing === request.id ? '...' : '✓ Accept'}
                            </button>
                            <button
                                className="btn-reject"
                                onClick={() => handleReject(request.id, request.parent_name)}
                                disabled={processing === request.id}
                            >
                                {processing === request.id ? '...' : '✕ Reject'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Box */}
            <div className="info-box">
                <span className="info-icon">ℹ️</span>
                <p>
                    By accepting, your parent will be able to view your course enrollments 
                    and track your progress. You can manage this later in your settings.
                </p>
            </div>
        </div>
    );
};

export default StudentParentRequestsSection;