// src/pages/MeetingRoom/MeetingRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { getMeetingToken } from '../../api/videoCalls';
import './MeetingRoomUIKit.css';

const MeetingRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [meetingData, setMeetingData] = useState(null);

    // Container ref for ZEGOCLOUD UIKit
    const meetingContainerRef = useRef(null);
    const zegoInstanceRef = useRef(null);

    useEffect(() => {
        if (!roomId) {
            setError('Invalid room ID');
            setLoading(false);
            return;
        }

        initializeMeeting();

        // Cleanup when component unmounts
        return () => {
            if (zegoInstanceRef.current) {
                zegoInstanceRef.current.destroy();
                zegoInstanceRef.current = null;
            }
        };
    }, [roomId]);

    const initializeMeeting = async () => {
        try {
            setLoading(true);
            setError(null);

            // Extract courseId from roomId (format: course_123)
            const parts = roomId.split('_');
            const courseId = parts.length > 1 ? parts[1] : parts[0];

            console.log('Fetching meeting token for course:', courseId);

            // Get meeting token from backend
            const response = await getMeetingToken(courseId);
            const { token, appId, userId, userName, courseName } = response.data.data;

            console.log('Token received successfully');

            // Store meeting data
            setMeetingData({
                token,
                appId: parseInt(appId),
                userId,
                userName,
                roomId,
                courseName
            });

            setLoading(false);

            // Initialize ZEGOCLOUD UIKit after loading is done
            setTimeout(() => {
                if (meetingContainerRef.current) {
                    joinMeeting(token, parseInt(appId), userId, userName, roomId, courseName);
                }
            }, 100);

        } catch (err) {
            console.error('Meeting initialization error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to join meeting');
            setLoading(false);
        }
    };

    const joinMeeting = (token, appId, userId, userName, roomId, courseName) => {
        // Create ZegoUIKitPrebuilt instance
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(// old => ForTest
            appId,
            token,
            roomId,
            userId,
            userName
        );

        // Initialize the meeting
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zp;

        // Join the room
        zp.joinRoom({
            container: meetingContainerRef.current,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference, // or GroupCall, OneONoneCall
            },
            showPreJoinView: true, // Skip pre-join screen (camera/mic test)
            showScreenSharingButton: true,
            showLayoutButton: true,
            showRoomTimer: true,
            showUserList: true,
            maxUsers: 50, // Adjust based on your needs

            // Branding
            branding: {
                logoURL: '', // Add your logo URL here if you want
            },

            // UI configuration
            turnOnCameraWhenJoining: false,
            turnOnMicrophoneWhenJoining: false,
            showMyCameraToggleButton: true,
            showMyMicrophoneToggleButton: true,
            showAudioVideoSettingsButton: true,
            showTextChat: true,
            lowerLeftNotification: {
                showUserJoinAndLeave: true,
                showTextChat: true,
            },

            // Layout
            layout: 'Auto', // or 'Grid', 'Sidebar'
            showNonVideoUser: true,
            showOnlyAudioUser: true,

            // Callback when user leaves
            // Callback when user leaves
            onLeaveRoom: () => {
                console.log('User left the room');
                // Force full reload to ensure Zego cleanup
                window.location.href = '/calendar';
            },

            // Callback when user joins
            onJoinRoom: () => {
                console.log('Successfully joined room:', roomId);
            },

            // Handle errors
            onError: (error) => {
                console.error('Meeting error:', error);
                setError('An error occurred during the meeting');
            }
        });
    };

    if (loading) {
        return (
            <div className="meeting-loading">
                <div className="spinner"></div>
                <div className="loading-text">Joining meeting...</div>
                <div className="loading-subtext">
                    {meetingData ?
                        `Connecting to ${meetingData.courseName || 'meeting room'}...` :
                        'Allow camera and microphone access if prompted'
                    }
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="meeting-error">
                <div className="error-icon">❌</div>
                <div className="error-title">Failed to join meeting</div>
                <div className="error-message">{error}</div>
                <button onClick={() => navigate(-1)} className="error-btn">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="meeting-room-wrapper">
            {/* ZEGOCLOUD UIKit will render here */}
            <div
                ref={meetingContainerRef}
                className="meeting-container"
                style={{ width: '100%', height: '100vh' }}
            />
        </div>
    );
};

export default MeetingRoom;