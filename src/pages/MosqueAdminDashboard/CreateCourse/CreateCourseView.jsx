// src/pages/MosqueAdminDashboard/CreateCourse/CreateCourseView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftOutlined,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {
    getCourseTypes,
    getMemorizationLevels,
    createCourse,
    getSuggestedTeachers
} from '../../../api/course';
import TeacherSelectionModal from '../../../components/Course/TeacherSelectionModal';
import './CreateCourseView.css';

const CreateCourseView = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [courseTypes, setCourseTypes] = useState([]);
    const [memorizationLevels, setMemorizationLevels] = useState([]);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [suggestedTeachers, setSuggestedTeachers] = useState([]);

    // Get mosque_id from user context
    const mosqueId = localStorage.getItem('user_mosque_id') || 1;

    // Form state
    const [formData, setFormData] = useState({
        mosque_id: mosqueId,
        teacher_id: null,
        course_type_id: '',
        name: '',
        description: '',
        course_format: 'short',
        difficulty_level: 1,
        price_cents: 0,
        duration_weeks: null,
        total_sessions: null,
        max_students: null,
        schedule_type: 'onsite',
        target_age_group: 'all',
        target_gender: '',
        course_level: null,
        is_active: true,
        schedule: []
    });

    const [scheduleEntry, setScheduleEntry] = useState({
        day_of_week: 'sunday',
        start_time: '',
        end_time: '',
        location: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [typesRes, levelsRes] = await Promise.all([
                getCourseTypes(),
                getMemorizationLevels()
            ]);

            if (typesRes.data) {
                setCourseTypes(typesRes.data);
            }

            if (levelsRes.data) {
                setMemorizationLevels(levelsRes.data);
            }


        } catch (error) {
            alert('Failed to load initial data');
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addScheduleEntry = () => {
        if (!scheduleEntry.start_time || !scheduleEntry.end_time) {
            alert('Please fill in start and end time');
            return;
        }

        setFormData(prev => ({
            ...prev,
            schedule: [...prev.schedule, { ...scheduleEntry }]
        }));

        // Reset entry
        setScheduleEntry({
            day_of_week: 'sunday',
            start_time: '',
            end_time: '',
            location: ''
        });
    };

    const removeScheduleEntry = (index) => {
        setFormData(prev => ({
            ...prev,
            schedule: prev.schedule.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.course_type_id) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const response = await createCourse(formData);
            if (response.status === 201) {
                alert('Course created successfully');
                navigate('/dashboard/mosque-admin/courses');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    const handleGetTeacherSuggestions = async () => {
        if (!formData.course_type_id) {
            alert('Please select a course type first');
            return;
        }

        try {
            setLoading(true);
            const suggestionData = {
                course_type_id: formData.course_type_id,
                course_level: formData.course_level,
                schedule: formData.schedule,
                mosque_id: formData.mosque_id,
                target_gender: formData.target_gender
            };

            const response = await getSuggestedTeachers(suggestionData);

            if (response.data) {
                setSuggestedTeachers(response.data);
                setShowTeacherModal(true);
            }
        } catch (error) {
            alert('Failed to get teacher suggestions');
        } finally {
            setLoading(false);
        }
    };

    const selectedCourseType = courseTypes.find(t => t.id === Number(formData.course_type_id));
    const isMemorizationType = selectedCourseType?.name === 'memorization';

    return (
        <div className="create-course-container" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            padding: '32px 16px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <button
                        onClick={() => navigate('/dashboard/mosque-admin/courses')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            padding: '8px 0',
                            fontSize: '16px',
                            marginBottom: '16px'
                        }}
                    >
                        <ArrowLeftOutlined />
                        Back to Courses
                    </button>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '8px'
                    }}>
                        Create New Course
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '18px' }}>
                        Fill in the details to create a new course
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Basic Information Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#1f2937',
                                marginBottom: '20px'
                            }}>
                                Basic Information
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Course Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="e.g., Tajweed for Beginners"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Course Type *
                                    </label>
                                    <select
                                        value={formData.course_type_id}
                                        onChange={(e) => {
                                            const selectedId = parseInt(e.target.value);
                                            handleInputChange('course_type_id', selectedId);

                                            if (selectedId !== 1) { // If not memorization (id=1)
                                                handleInputChange('course_level', null);
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            outline: 'none',
                                            placeholder: 'select course type'
                                        }}
                                        defaultValue='select course type'
                                    >
                                        <option value="" disabled >
                                            Select a course type
                                        </option>
                                        {courseTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name.charAt(0).toUpperCase() + type.name.slice(1)} - {type.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {isMemorizationType && (
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            Memorization Level
                                        </label>
                                        <select
                                            value={formData.course_level || ''}
                                            onChange={(e) => handleInputChange('course_level', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                backgroundColor: 'white',
                                                cursor: 'pointer',
                                                outline: 'none',
                                                placeholder: 'memorization level'
                                            }}
                                            defaultValue='memorization level'
                                        >
                                            <option value="" disabled >
                                                memorization level
                                            </option>
                                            {memorizationLevels.map(level => (
                                                <option key={level.id} value={level.id}>
                                                    {level.level_name} (Juz {level.juz_range_start}-{level.juz_range_end})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Course description..."
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            resize: 'vertical',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            Course Format
                                        </label>
                                        <select
                                            value={formData.course_format}
                                            onChange={(e) => handleInputChange('course_format', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                backgroundColor: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="short">Short Course</option>
                                            <option value="long">Long Course</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            Delivery Method
                                        </label>
                                        <select
                                            value={formData.schedule_type}
                                            onChange={(e) => handleInputChange('schedule_type', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                backgroundColor: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="onsite">On-site</option>
                                            <option value="online">Online</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Details Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#1f2937',
                                marginBottom: '20px'
                            }}>
                                Course Details
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            Duration (weeks)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.duration_weeks || ''}
                                            onChange={(e) => handleInputChange('duration_weeks', e.target.value)}
                                            placeholder="e.g., 12"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            Total Sessions
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.total_sessions || ''}
                                            onChange={(e) => handleInputChange('total_sessions', e.target.value)}
                                            placeholder="e.g., 24"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            Max Students
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.max_students || ''}
                                            onChange={(e) => handleInputChange('max_students', e.target.value)}
                                            placeholder="e.g., 20"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            Price (Shekel)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price_cents}
                                            onChange={(e) => handleInputChange('price_cents', e.target.value)}
                                            placeholder="0.00"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '12px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Target Age Group
                                    </label>
                                    <div style={{ display: 'flex', gap: '24px', marginBottom: '8px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="target_age_group"
                                                value="all"
                                                checked={formData.target_age_group === 'all'}
                                                onChange={(e) => handleInputChange('target_age_group', e.target.value)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                            />
                                            <span>All</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="target_age_group"
                                                value="children"
                                                checked={formData.target_age_group === 'children'}
                                                onChange={(e) => handleInputChange('target_age_group', e.target.value)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                            />
                                            <span>Children</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="target_age_group"
                                                value="teenagers"
                                                checked={formData.target_age_group === 'teenagers'}
                                                onChange={(e) => handleInputChange('target_age_group', e.target.value)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                            />
                                            <span>Teenagers</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="target_age_group"
                                                value="adults"
                                                checked={formData.target_age_group === 'adults'}
                                                onChange={(e) => handleInputChange('target_age_group', e.target.value)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                            />
                                            <span>Adults</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '12px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Target Gender (Important for teacher matching)
                                    </label>
                                    <div style={{ display: 'flex', gap: '24px', marginBottom: '8px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="target_gender"
                                                value=""
                                                checked={formData.target_gender === ''}
                                                onChange={(e) => handleInputChange('target_gender', e.target.value)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                            />
                                            <span>Mixed (No Restriction)</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="target_gender"
                                                value="male"
                                                checked={formData.target_gender === 'male'}
                                                onChange={(e) => handleInputChange('target_gender', e.target.value)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                            />
                                            <span>Male Only</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="target_gender"
                                                value="female"
                                                checked={formData.target_gender === 'female'}
                                                onChange={(e) => handleInputChange('target_gender', e.target.value)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                            />
                                            <span>Female Only</span>
                                        </label>
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                        This affects teacher suggestions based on gender matching
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#1f2937',
                                marginBottom: '20px'
                            }}>
                                Class Schedule
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            Day
                                        </label>
                                        <select
                                            value={scheduleEntry.day_of_week}
                                            onChange={(e) => setScheduleEntry(prev => ({
                                                ...prev,
                                                day_of_week: e.target.value
                                            }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                backgroundColor: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="sunday">Sunday</option>
                                            <option value="monday">Monday</option>
                                            <option value="tuesday">Tuesday</option>
                                            <option value="wednesday">Wednesday</option>
                                            <option value="thursday">Thursday</option>
                                            <option value="friday">Friday</option>
                                            <option value="saturday">Saturday</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={scheduleEntry.start_time}
                                            onChange={(e) => setScheduleEntry(prev => ({
                                                ...prev,
                                                start_time: e.target.value
                                            }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                backgroundColor: 'white'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={scheduleEntry.end_time}
                                            onChange={(e) => setScheduleEntry(prev => ({
                                                ...prev,
                                                end_time: e.target.value
                                            }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                backgroundColor: 'white'
                                            }}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addScheduleEntry}
                                        style={{
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '44px'
                                        }}
                                    >
                                        <PlusOutlined />
                                    </button>
                                </div>

                                {formData.schedule.length > 0 && (
                                    <>
                                        <div style={{ borderTop: '1px solid #e5e7eb', margin: '16px 0' }}></div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {formData.schedule.map((entry, index) => (
                                                <div
                                                    key={index}
                                                    className="schedule-entry-item"
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '12px 16px',
                                                        backgroundColor: '#f9fafb',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                        <span style={{
                                                            backgroundColor: '#dbeafe',
                                                            color: '#1e40af',
                                                            padding: '4px 12px',
                                                            borderRadius: '9999px',
                                                            fontSize: '14px',
                                                            fontWeight: '500'
                                                        }}>
                                                            {entry.day_of_week.charAt(0).toUpperCase() + entry.day_of_week.slice(1)}
                                                        </span>
                                                        <span style={{ color: '#374151' }}>
                                                            {entry.start_time} - {entry.end_time}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeScheduleEntry(index)}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            border: 'none',
                                                            color: '#dc2626',
                                                            cursor: 'pointer',
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        <DeleteOutlined />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '24px',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontWeight: '600' }}>Active Course</span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button
                                    type="button"
                                    onClick={handleGetTeacherSuggestions}
                                    disabled={loading}
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: '#3b82f6',
                                        border: '1px solid #3b82f6',
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        opacity: loading ? 0.5 : 1
                                    }}
                                >
                                    Preview Teacher Suggestions
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        opacity: loading ? 0.5 : 1
                                    }}
                                >
                                    {loading ? 'Creating...' : 'Create Course'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Teacher Selection Modal */}
                {showTeacherModal && (
                    <TeacherSelectionModal
                        isOpen={showTeacherModal}
                        onClose={() => setShowTeacherModal(false)}
                        teachers={suggestedTeachers}
                        onSelect={(teacher) => {
                            console.log('Selected teacher:', teacher);
                            formData.teacher_id = teacher.id;
                            setShowTeacherModal(false);
                        }}
                        courseData={formData}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateCourseView;