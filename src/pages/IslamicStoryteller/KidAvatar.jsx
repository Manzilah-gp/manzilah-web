import React, { useEffect, useRef, useState } from "react";
import "./KidAvatar.css";

const KidAvatar = ({ speaking }) => {
    const [blink, setBlink] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(false);
    const [handAngle, setHandAngle] = useState(0);

    const blinkRef = useRef(null);
    const speakRef = useRef(null);

    // Blinking
    useEffect(() => {
        blinkRef.current = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 120);
        }, 3000);

        return () => clearInterval(blinkRef.current);
    }, []);

    // Speaking animation
    useEffect(() => {
        if (speakRef.current) clearInterval(speakRef.current);

        if (speaking) {
            let t = 0;
            speakRef.current = setInterval(() => {
                t++;
                setMouthOpen(Math.sin(t) > 0);
                setHandAngle(Math.sin(t * 0.6) * 20);
            }, 120);
        } else {
            setMouthOpen(false);
            setHandAngle(0);
        }

        return () => clearInterval(speakRef.current);
    }, [speaking]);

    return (
        <div className="kid-container">
            <div className="kid-avatar">

                {/* Head */}
                <div className="kid-head">
                    <div className="hair" />

                    <div className={`eye left ${blink ? "blink" : ""}`}>
                        <div className="pupil" />
                    </div>
                    <div className={`eye right ${blink ? "blink" : ""}`}>
                        <div className="pupil" />
                    </div>

                    <div className={`mouth ${mouthOpen ? "open" : ""}`} />
                </div>

                {/* Body */}
                <div className="hoodie">
                    <div className="hoodie-strings" />
                </div>

                {/* Arms */}
                <div
                    className="arm left"
                    style={{ transform: `rotate(${handAngle}deg)` }}
                />
                <div
                    className="arm right"
                    style={{ transform: `rotate(${-handAngle}deg)` }}
                />

                {/* Speaking waves */}
                {speaking && (
                    <div className="waves">
                        <span />
                        <span />
                        <span />
                    </div>
                )}
            </div>
        </div>
    );
};

export default KidAvatar;
