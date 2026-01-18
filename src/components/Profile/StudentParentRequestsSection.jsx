//Student's section to accept/reject parent requests and view verified parents

import React, { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import {
    getPendingRequests,
    getMyParents,
    acceptRequest,
    rejectRequest,
    deleteRelationship
} from '../../api/parent';
import './StudentParentRequestsSection.css';

const { confirm } = Modal;

/**
 * Student Parent Requests Section Component
 * PURPOSE: Allows students to:
 * 1. View pending parent relationship requests
 * 2. Accept or reject requests
 * 3. View and manage verified parents
 */
const StudentParentRequestsSection = () => {
    const [requests, setRequests] = useState([]);
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Fetch pending parent requests and verified parents
     */
    const fetchData = async () => {
        setLoading(true);
        try {
            const [requestsRes, parentsRes] = await Promise.all([
                getPendingRequests(),
                getMyParents()
            ]);

            if (requestsRes.data.success) {
                setRequests(requestsRes.data.data);
            }

            if (parentsRes.data.success) {
                setParents(parentsRes.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Failed to load parent information');
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
                        fetchData(); // Refresh list
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
                        fetchData(); // Refresh list
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
     * Handle remove parent (verified)
     */
    const handleRemoveParent = async (relationshipId, parentName) => {
        confirm({
            title: 'Remove Parent?',
            content: `Are you sure you want to remove ${parentName} from your parents list? They will no longer be able to see your progress.`,
            okText: 'Remove',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const response = await deleteRelationship(relationshipId);

                    if (response.data.success) {
                        message.success('Parent removed successfully');
                        fetchData(); // Refresh list
                    }
                } catch (error) {
                    message.error(
                        error.response?.data?.message || 'Failed to remove parent'
                    );
                }
            }
        });
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString, includeTime = true) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };

        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }

        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    /**
     * Get relationship emoji
     */
    const getRelationshipEmoji = (type) => {
        switch (type) {
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
                <p>Loading parent information...</p>
            </div>
        );
    }

    // If no requests and no parents, show nothing (or empty state)
    if (requests.length === 0 && parents.length === 0) {
        return null;
    }

    return (
        <div className="student-parent-requests-section">

            {/* 1. Pending Requests Section */}
            {requests.length > 0 && (
                <div className="section-block">
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
                </div>
            )}

            {/* 2. Verified Parents Section */}
            {parents.length > 0 && (
                <div className="section-block parents-list-block" style={{ marginTop: requests.length > 0 ? '32px' : '0' }}>
                    <div className="section-header">
                        <div>
                            <h2>My Parents / Guardians</h2>
                            <p>Manage who can view your progress</p>
                        </div>
                    </div>

                    <div className="requests-list">
                        {parents.map(parent => (
                            <div key={parent.relationship_id} className="request-card verified-parent-card">
                                {/* Left side: Parent info */}
                                <div className="request-info">
                                    <div className="parent-avatar">
                                        {getRelationshipEmoji(parent.relationship_type)}
                                    </div>
                                    <div className="parent-details">
                                        <h4 className="parent-name">{parent.parent_name}</h4>
                                        <p className="parent-email">{parent.parent_email}</p>
                                        {parent.parent_phone && (
                                            <p className="parent-phone">📞 {parent.parent_phone}</p>
                                        )}
                                        <div className="request-meta">
                                            <span className="badge relationship">
                                                {parent.relationship_type}
                                            </span>
                                            <span className="badge verified-badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                                                ✓ Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side: Actions */}
                                <div className="request-actions">
                                    <button
                                        className="btn-reject"
                                        onClick={() => handleRemoveParent(parent.relationship_id, parent.parent_name)}
                                        title="Remove Parent"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="info-box">
                <span className="info-icon">ℹ️</span>
                <p>
                    {requests.length > 0
                        ? "By accepting, your parent will be able to view your course enrollments and track your progress."
                        : "Verified parents can view your course enrollments and track your progress."}
                </p>
            </div>
        </div>
    );
};

export default StudentParentRequestsSection;
