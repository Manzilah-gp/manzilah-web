// Create a new file: BirdAvatar.jsx
import React, { useState, useEffect, useRef } from 'react';
import './BirdAvatar.css'; // We'll create this CSS file
import { useTranslation } from 'react-i18next';

const BirdAvatar = ({ speaking }) => {
    const [isBlinking, setIsBlinking] = useState(false);
    const [wingPos, setWingPos] = useState(0);
    const [mouthOpen, setMouthOpen] = useState(false);

    const blinkInterval = useRef(null);
    const animationInterval = useRef(null);
    const { t } = useTranslation();

    // Eye blinking
    useEffect(() => {
        blinkInterval.current = setInterval(() => {
            if (!speaking) {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 150);
            }
        }, 3000);

        return () => {
            if (blinkInterval.current) clearInterval(blinkInterval.current);
        };
    }, [speaking]);

    // Animation when speaking
    useEffect(() => {
        if (animationInterval.current) {
            clearInterval(animationInterval.current);
        }

        if (speaking) {
            let wingCounter = 0;
            let mouthCounter = 0;

            animationInterval.current = setInterval(() => {
                // Wing flapping (every 200ms)
                wingCounter++;
                setWingPos(Math.sin(wingCounter * 0.5) * 20);

                // Mouth opening/closing (every 100ms)
                mouthCounter++;
                setMouthOpen(Math.sin(mouthCounter) > 0);

                // Blinking while speaking
                if (Math.random() > 0.95) {
                    setIsBlinking(true);
                    setTimeout(() => setIsBlinking(false), 100);
                }
            }, 100);
        } else {
            setWingPos(0);
            setMouthOpen(false);
        }

        return () => {
            if (animationInterval.current) {
                clearInterval(animationInterval.current);
            }
        };
    }, [speaking]);

    return (
        <div className="bird-container">
            <div className="bird-body">
                {/* Body */}
                <div className="body-main"></div>

                {/* Head */}
                <div className="bird-head">
                    {/* Eyes */}
                    <div className={`bird-eye left-eye ${isBlinking ? 'blinking' : ''}`}>
                        <div className="eye-pupil"></div>
                    </div>
                    <div className={`bird-eye right-eye ${isBlinking ? 'blinking' : ''}`}>
                        <div className="eye-pupil"></div>
                    </div>

                    {/* Beak */}
                    <div className={`bird-beak ${mouthOpen ? 'open' : ''}`}>
                        <div className="beak-upper"></div>
                        <div className="beak-lower"></div>
                    </div>
                </div>

                {/* Wings */}
                <div
                    className="bird-wing left-wing"
                    style={{ transform: `rotate(${wingPos}deg)` }}
                ></div>
                <div
                    className="bird-wing right-wing"
                    style={{ transform: `rotate(-${wingPos}deg)` }}
                ></div>

                {/* Tail */}
                <div className="bird-tail"></div>

                {/* Legs */}
                <div className="bird-leg left-leg"></div>
                <div className="bird-leg right-leg"></div>

                {/* Speaking effect */}
                {speaking && (
                    <div className="speaking-effect">
                        <div className="sound-wave"></div>
                        <div className="sound-wave delay-1"></div>
                        <div className="sound-wave delay-2"></div>
                    </div>
                )}
            </div>

            {/* Speech bubble */}
            {speaking && (
                <div className="speech-bubble">
                    <div className="bubble-text">🗣️ {t('storyteller.tellingStory')}</div>
                </div>
            )}
        </div>
    );
};

export default BirdAvatar;