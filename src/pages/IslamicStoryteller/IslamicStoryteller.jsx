import React, { useState, useRef, useEffect, Suspense } from 'react';
// import { ISLAMIC_STORIES, STORY_CATEGORIES, AGE_GROUPS } from '../../util/stories.ar';
import * as storiesAR from '../../util/storiesar';
import * as storiesEN from '../../util/storiesen';

import useAuth from '../../hooks/useAuth';
import BirdAvatar from './BirdAvatar';
import { useTranslation } from 'react-i18next';

const IslamicStoryteller = () => {
    const { user } = useAuth();
    const [selectedStory, setSelectedStory] = useState(null);
    const [customText, setCustomText] = useState('');
    const [speaking, setSpeaking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [useCustomText, setUseCustomText] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [ageFilter, setAgeFilter] = useState('all');
    const audioRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const { t } = useTranslation();
    const [storyLang, setStoryLang] = useState('en');

    const storiesSource = storyLang === 'ar' ? storiesAR : storiesEN;

    const {
        ISLAMIC_STORIES,
        STORY_CATEGORIES,
        AGE_GROUPS
    } = storiesSource;


    // Check if user is VIP (has subscription)
    const isVIP = true;
    // const isVIP = user?.subscription === 'premium' || user?.roles?.includes('ministry_admin');

    // Filter stories
    const filteredStories = ISLAMIC_STORIES.filter(story => {
        const categoryMatch = categoryFilter === 'all' || story.category === categoryFilter;
        const ageMatch = ageFilter === 'all' || story.ageGroup === ageFilter;
        return categoryMatch && ageMatch;
    });

    // Free Text-to-Speech (Browser API)
    const speakWithBrowser = async (text) => {
        try {
            setSpeaking(true);

            // Cancel any ongoing speech
            synthRef.current.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = storyLang === 'ar' ? 'ar-SA' : 'en-US';

            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 1;

            // Get Arabic voices
            const voices = synthRef.current.getVoices();
            const voice = voices.find(v =>
                storyLang === 'ar'
                    ? v.lang.startsWith('ar')
                    : v.lang.startsWith('en')
            );

            if (voice) {
                utterance.voice = voice;
            }

            utterance.onend = () => {
                setSpeaking(false);
            };

            utterance.onerror = () => {
                setSpeaking(false);
                alert('❌ خطأ في تشغيل الصوت');
            };

            synthRef.current.speak(utterance);

        } catch (error) {
            console.error('Speech error:', error);
            setSpeaking(false);
        }
    };

    const sanitizeTextForTTS = (text) => {
        return text
            .normalize('NFC')
            .replace(/[\u200E\u200F\u202A-\u202E]/g, '') // RTL/LTR marks
            .replace(/\uFEFF/g, '') // BOM
            .replace(/\s+/g, ' ')
            .trim();
    };


    // VIP Text-to-Speech (ElevenLabs)
    const speakWithAI = async (rawText) => {
        const text = sanitizeTextForTTS(rawText);
        if (!isVIP) {
            speakWithBrowser(text);
            return;
        }

        try {
            setLoading(true);
            setSpeaking(true);

            console.log('Speaking text (length):', text.length);

            // API key stored in environment variable (hidden from users)
            const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

            if (!API_KEY) {
                console.warn('Missing ElevenLabs API Key, falling back to browser speech');
                speakWithBrowser(text);
                setLoading(false);
                return;
            }

            const response = await fetch(
                'https://api.elevenlabs.io/v1/text-to-speech/gjmrEqlBoh5agvpfP3M1',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg',
                        'Content-Type': 'application/json',
                        'xi-api-key': API_KEY
                    },
                    body: JSON.stringify({
                        text: text, // Send exact text
                        model_id: 'eleven_multilingual_v2',
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.75,
                            style: 0.5,
                            use_speaker_boost: true
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorStatus = response.status;
                console.warn(`ElevenLabs API returned ${errorStatus}, falling back to browser speech`);

                if (response.status === 401) {
                    // Alert the user that the Premium voice is unavailable due to auth
                    alert('⚠️ Premium voice unavailable (Unavailable). Using Standard voice.');
                }

                // Fallback for ANY API error (401, 400, 500 etc)
                speakWithBrowser(text);
                setLoading(false);
                return;
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            if (audioRef.current) {
                audioRef.current.pause();
            }

            audioRef.current = new Audio(audioUrl);

            audioRef.current.onended = () => {
                setSpeaking(false);
                setLoading(false);
            };

            audioRef.current.onerror = () => {
                setSpeaking(false);
                setLoading(false);
                alert('❌ خطأ في تشغيل الصوت');
            };

            await audioRef.current.play();
            setLoading(false);

        } catch (error) {
            console.error('AI Speech error details:', error);
            // Fallback for network errors or other exceptions
            speakWithBrowser(text);
            setLoading(false);
        }
    };

    const handleSpeak = () => {
        const textToSpeak = useCustomText ? customText : selectedStory?.content;

        if (!textToSpeak?.trim()) {
            alert('⚠️ يرجى اختيار قصة أو إدخال نص أولاً');
            return;
        }

        if (isVIP) {
            speakWithAI(textToSpeak);
        } else {
            speakWithBrowser(textToSpeak);
        }
    };

    const stopSpeaking = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        synthRef.current.cancel();
        setSpeaking(false);
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'Arial, sans-serif'
        }}>

            {/* 3D Canvas future work*/}

            <div style={{ flex: 1, position: 'relative', alignContent: 'center' }}>
                {/* 2D Bird Avatar */}
                <div style={{
                    flex: 1,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                    <BirdAvatar speaking={speaking} />
                    {/* <KidAvatar speaking={speaking} /> */}


                    {/* Status Overlay */}
                    {speaking && (
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(16, 185, 129, 0.95)',
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: '50px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                            animation: 'pulse 2s infinite',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>

                        </div>
                    )}
                </div>

                {/* Status Overlay */}
                {speaking && (
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(16, 185, 129, 0.95)',
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '50px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        animation: 'pulse 2s infinite',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                    </div>
                )}

                {/* VIP Badge */}
                {isVIP && (
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '50px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>

                    </div>
                )}
            </div>

            {/* Control Panel */}
            <div style={{
                width: '450px',
                background: 'white',
                padding: '24px',
                overflowY: 'auto',
                boxShadow: '-5px 0 15px rgba(0,0,0,0.1)'
            }}>

                {/* Header */}
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '8px'
                    }}>
                        📖{t('storyteller.title')}
                    </h1>
                    {/* <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        {isVIP ? '✨ Premium AI Narrator' : '🎙️ Free Text-to-Speech'}
                    </p> */}

                </div>

                {/* Mode Toggle */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '24px',
                    background: '#f3f4f6',
                    padding: '8px',
                    borderRadius: '12px'
                }}>
                    <button
                        onClick={() => setUseCustomText(false)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: !useCustomText ? '#667eea' : 'transparent',
                            color: !useCustomText ? 'white' : '#4b5563',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        📚 {t('storyteller.readyStories')}
                    </button>
                    <button
                        onClick={() => setUseCustomText(true)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: useCustomText ? '#667eea' : 'transparent',
                            color: useCustomText ? 'white' : '#4b5563',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        ✍️ {t('storyteller.customText')}
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <button
                            onClick={() => setStoryLang('ar')}
                            style={{
                                flex: 1,
                                padding: '8px',
                                background: storyLang === 'ar' ? '#667eea' : '#e5e7eb',
                                color: storyLang === 'ar' ? 'white' : '#374151',
                                borderRadius: '8px',
                                fontWeight: 'bold'
                            }}
                        >
                            عربي
                        </button>

                        <button
                            onClick={() => setStoryLang('en')}
                            style={{
                                flex: 1,
                                padding: '8px',
                                background: storyLang === 'en' ? '#667eea' : '#e5e7eb',
                                color: storyLang === 'en' ? 'white' : '#374151',
                                borderRadius: '8px',
                                fontWeight: 'bold'
                            }}
                        >
                            English
                        </button>
                    </div>

                </div>

                {/* Custom Text Input */}
                {useCustomText ? (
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            marginBottom: '12px',
                            fontSize: '16px'
                        }}>
                            ✍️ {t('storyteller.writeText')}
                        </label>
                        <textarea
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            placeholder={t('storyteller.writeTextPlaceholder')}
                            style={{
                                width: '100%',
                                minHeight: '200px',
                                padding: '16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '16px',
                                lineHeight: '1.8',
                                resize: 'vertical',
                                fontFamily: 'Arial, sans-serif'
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '8px',
                            fontSize: '12px',
                            color: '#6b7280'
                        }}>
                            <span>{customText.length} {t('storyteller.letter')}</span>
                            <span>{Math.ceil(customText.split(' ').length / 150)}{t('storyteller.minutes')}</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Filters */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '24px'
                        }}>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{
                                    padding: '10px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            >
                                {STORY_CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>

                            <select
                                value={ageFilter}
                                onChange={(e) => setAgeFilter(e.target.value)}
                                style={{
                                    padding: '10px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            >
                                {AGE_GROUPS.map(age => (
                                    <option key={age.value} value={age.value}>{age.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Stories List */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                marginBottom: '12px'
                            }}>
                                📚 {t('storyteller.readyStories')} ({filteredStories.length}):
                            </h3>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                maxHeight: '300px',
                                overflowY: 'auto'
                            }}>
                                {filteredStories.map(story => (
                                    <div
                                        key={story.id}
                                        onClick={() => setSelectedStory(story)}
                                        style={{
                                            padding: '14px',
                                            background: selectedStory?.id === story.id ? '#eff6ff' : '#f9fafb',
                                            border: selectedStory?.id === story.id ? '2px solid #667eea' : '1px solid #e5e7eb',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'start',
                                            marginBottom: '6px'
                                        }}>
                                            <h4 style={{
                                                fontSize: '15px',
                                                fontWeight: 'bold',
                                                color: '#1f2937',
                                                margin: 0
                                            }}>
                                                {story.title}
                                            </h4>
                                            <span style={{
                                                background: '#dbeafe',
                                                color: '#1e40af',
                                                padding: '3px 8px',
                                                borderRadius: '10px',
                                                fontSize: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                {story.category}
                                            </span>
                                        </div>
                                        <p style={{
                                            fontSize: '11px',
                                            color: '#10b981',
                                            fontWeight: '600',
                                            margin: 0
                                        }}>
                                            💡 {story.moral}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Selected Story Preview */}
                        {selectedStory && (
                            <div style={{
                                background: '#f0fdf4',
                                border: '2px solid #86efac',
                                borderRadius: '12px',
                                padding: '16px',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#166534',
                                    marginBottom: '10px'
                                }}>
                                    📖 {selectedStory.title}
                                </h3>
                                <div style={{
                                    fontSize: '13px',
                                    lineHeight: '1.7',
                                    color: '#15803d',
                                    whiteSpace: 'pre-line',
                                    maxHeight: '150px',
                                    overflowY: 'auto',
                                    padding: '10px',
                                    background: 'white',
                                    borderRadius: '8px'
                                }}>
                                    {selectedStory.content}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <button
                        onClick={handleSpeak}
                        disabled={speaking || loading || (!useCustomText && !selectedStory) || (useCustomText && !customText.trim())}
                        style={{
                            flex: 1,
                            padding: '16px',
                            background: speaking || loading ? '#d1d5db' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: (speaking || loading || (!useCustomText && !selectedStory)) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {loading ? '⏳ ' + t('storyteller.loading') : speaking ? '🗣️ ' + t('storyteller.speaking') : '▶️ ' + t('storyteller.start')}
                    </button>

                    {speaking && (
                        <button
                            onClick={stopSpeaking}
                            style={{
                                padding: '16px 24px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            ⏹️
                        </button>
                    )}
                </div>

                {/* VIP Upgrade Prompt */}
                {!isVIP && (
                    <div style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        border: '2px solid #f59e0b',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '12px'
                        }}>
                            <span style={{ fontSize: '32px' }}>⭐</span>
                            <div>
                                <h4 style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#92400e',
                                    margin: '0 0 4px 0'
                                }}>
                                    ترقية إلى VIP
                                </h4>
                                <p style={{
                                    fontSize: '13px',
                                    color: '#b45309',
                                    margin: 0
                                }}>
                                    احصل على صوت احترافي بالذكاء الاصطناعي
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => alert('🚧 صفحة الاشتراكات قيد التطوير')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            اشترك الآن 💳
                        </button>
                    </div>
                )}

                {/* Instructions */}
                <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '14px',
                    fontSize: '12px',
                    color: '#1e40af',
                    lineHeight: '1.6'
                }}>
                    <strong>📋 {t('storyteller.howTo')} :</strong>
                    <ul style={{ paddingRight: '20px', margin: '8px 0 0 0' }}>
                        <li>{t('storyteller.step1')}</li>
                        <li>{t('storyteller.step2')}</li>
                        <li>{t('storyteller.step3')}</li>
                    </ul>
                </div>
            </div>

            <style>
                {`
          @keyframes pulse {
            0%, 100% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.05); }
          }
        `}
            </style>
        </div >
    );
};

export default IslamicStoryteller;