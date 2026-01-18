import React, { useState } from 'react';
import {
    FacebookShareButton,
    WhatsappShareButton,
    FacebookIcon,
    WhatsappIcon,
} from 'react-share';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import './EventShareButtons.css';

/**
 * Social Media Share Buttons for Events
 * @param {Object} event - Event object with title, description, date, time, url
 */
const EventShareButtons = ({ event }) => {
    const [copied, setCopied] = useState(false);

    // Build the shareable URL (full URL for external sharing)
    const eventUrl = `${window.location.origin}/events/${event.id}`;

    // Format the share message with event details
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Create rich share text with event details
    const shareTitle = `📅 ${event.title}`;

    const shareDescription = `
    ${event.description}

📅 Date: ${formatDate(event.event_date)}
${event.event_time ? `🕐 Time: ${event.event_time}` : ''}
${event.location ? `📍 Location: ${event.location}` : ''}

Join us at ${event.mosque_name}!
  `.trim();

    // Copy link to clipboard
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(eventUrl);
            setCopied(true);
            message.success('Link copied to clipboard!');

            // Reset copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            message.error('Failed to copy link');
        }
    };

    return (
        <div className="event-share-buttons">
            <h4 className="share-title">📢 Share this event</h4>

            <div className="share-buttons-row">
                {/* Facebook Share Button */}
                <Tooltip title="Share on Facebook">
                    <FacebookShareButton
                        url={eventUrl}
                        quote={shareTitle}
                        hashtag="#Manzilah"
                        className="share-button"
                    >
                        <FacebookIcon size={48} round />
                    </FacebookShareButton>
                </Tooltip>

                {/* WhatsApp Share Button */}
                <Tooltip title="Share on WhatsApp">
                    <WhatsappShareButton
                        url={eventUrl}
                        title={shareTitle}
                        separator=" - "
                        className="share-button"
                    >
                        <WhatsappIcon size={48} round />
                    </WhatsappShareButton>
                </Tooltip>

                {/* Copy Link Button */}
                <Tooltip title={copied ? "Copied!" : "Copy link"}>
                    <button
                        onClick={handleCopyLink}
                        className="copy-link-button"
                        aria-label="Copy event link"
                    >
                        {copied ? (
                            <CheckOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                        ) : (
                            <CopyOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        )}
                    </button>
                </Tooltip>
            </div>

            {/* Event URL Display */}
            <div className="event-url-display">
                <input
                    type="text"
                    value={eventUrl}
                    readOnly
                    className="url-input"
                    onClick={(e) => e.target.select()}
                />
            </div>
        </div>
    );
};

export default EventShareButtons;