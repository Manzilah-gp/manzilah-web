import React, { useState, useEffect } from 'react';
import { enableCourseMeeting, disableCourseMeeting, getMeetingDetails } from '../../api/videoCalls';

/**
 * Enable Meeting Toggle Component
 * For mosque admins to enable/disable online meetings
 * 
 * Props:
 * - courseId: Course ID
 * - onToggle: Callback when meeting is enabled/disabled (optional)
 */
const EnableMeetingToggle = ({ courseId }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [meetingUrl, setMeetingUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showUrl, setShowUrl] = useState(false);

    useEffect(() => {
        fetchMeetingStatus();
    }, [courseId]);

    const fetchMeetingStatus = async () => {
        try {
            const response = await getMeetingDetails(courseId);
            const { isOnlineEnabled, meetingUrl } = response.data.data;
            setIsEnabled(isOnlineEnabled);
            setMeetingUrl(meetingUrl);
        } catch (err) {
            console.error('Error fetching meeting status:', err);
        }
    };

    const handleToggle = async () => {
        try {
            setLoading(true);
            setError(null);

            if (isEnabled) {
                // Disable meeting
                await disableCourseMeeting(courseId);
                setIsEnabled(false);
                setMeetingUrl(null);
                // if (onToggle) onToggle(false);
            } else {
                // Enable meeting
                const response = await enableCourseMeeting(courseId);
                const { meetingUrl } = response.data.data;
                setIsEnabled(true);
                setMeetingUrl(meetingUrl);
                // if (onToggle) onToggle(true);
            }

            setLoading(false);
        } catch (err) {
            console.error('Error toggling meeting:', err);
            setError(err.response?.data?.message || 'Failed to update meeting status');
            setLoading(false);
        }
    };

    const copyMeetingUrl = () => {
        if (meetingUrl) {
            navigator.clipboard.writeText(meetingUrl);
            alert('Meeting URL copied to clipboard!');
        }
    };

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '2px solid #e5e7eb'
            }}>
                Online Meeting Settings
            </h2>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <div>
                    <h4 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                    }}>
                        🎥 Online Meetings
                    </h4>
                    <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#6b7280'
                    }}>
                        {isEnabled
                            ? 'Students and teachers can join online sessions'
                            : 'Enable video calls for this course'
                        }
                    </p>
                </div>

                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                    <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={handleToggle}
                        disabled={loading}
                        style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                        position: 'absolute',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: isEnabled ? '#10b981' : '#d1d5db',
                        transition: '0.4s',
                        borderRadius: '34px',
                        opacity: loading ? 0.5 : 1
                    }}>
                        <span style={{
                            position: 'absolute',
                            content: '',
                            height: '26px',
                            width: '26px',
                            left: isEnabled ? '30px' : '4px',
                            bottom: '4px',
                            backgroundColor: 'white',
                            transition: '0.4s',
                            borderRadius: '50%'
                        }} />
                    </span>
                </label>
            </div>

            {error && (
                <div style={{
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '16px'
                }}>
                    {error}
                </div>
            )}

            {isEnabled && meetingUrl && (
                <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '8px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1e40af'
                        }}>
                            Meeting Link:
                        </span>
                        <button
                            onClick={() => setShowUrl(!showUrl)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#2563eb',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}
                        >
                            {showUrl ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    {showUrl && (
                        <div>
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center'
                            }}>
                                <input
                                    type="text"
                                    value={meetingUrl}
                                    readOnly
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        border: '1px solid #93c5fd',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        backgroundColor: 'white'
                                    }}
                                />
                                <button
                                    onClick={copyMeetingUrl}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
                            <p style={{
                                margin: '8px 0 0 0',
                                fontSize: '12px',
                                color: '#1e40af'
                            }}>
                                Share this link with students and teachers
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EnableMeetingToggle;