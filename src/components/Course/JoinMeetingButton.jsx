// src/components/Course/JoinMeetingButton.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeetingDetails } from '../../api/videoCalls';

/**
 * Join Meeting Button Component
 * Can be used in course pages to allow students/teachers to join
 * 
 * Props:
 * - courseId: Course ID
 * - variant: 'primary' | 'secondary' (optional)
 * - className: Additional CSS classes (optional)
 */
const JoinMeetingButton = ({ courseId, variant = 'primary', className = '' }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleJoinMeeting = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if meeting is enabled
            const response = await getMeetingDetails(courseId);
            const { isOnlineEnabled, meetingUrl, roomId } = response.data.data;

            if (!isOnlineEnabled) {
                alert('Online meetings are not enabled for this course');
                setLoading(false);
                return;
            }

            // Navigate to meeting room
            navigate(`/meeting/${roomId}`);
        } catch (err) {
            console.error('Error joining meeting:', err);
            setError(err.response?.data?.message || 'Failed to join meeting');
            setLoading(false);
        }
    };

    const buttonStyles = {
        primary: {
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        secondary: {
            backgroundColor: 'transparent',
            color: '#3b82f6',
            border: '2px solid #3b82f6',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }
    };

    return (
        <div>
            <button
                onClick={handleJoinMeeting}
                disabled={loading}
                style={buttonStyles[variant]}
                className={className}
                onMouseEnter={(e) => {
                    if (!loading) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                }}
            >
                <span style={{ fontSize: '20px' }}>🎥</span>
                {loading ? 'Joining...' : 'Join Meeting'}
            </button>

            {error && (
                <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: '6px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default JoinMeetingButton;