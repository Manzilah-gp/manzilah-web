import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    VStack,
    HStack,
    Heading,
    useToast,
    Card,
    CardBody,
    NumberInput,
    NumberInputField,
    Switch,
    Flex,
    Text,
    Tag,
    IconButton,
    Divider,
    Radio,
    RadioGroup,
    Stack,
    Spinner,
    Badge
} from '@chakra-ui/react';
import {
    ArrowLeftOutlined,
    PlusOutlined,
    DeleteOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    SaveOutlined,
    CloseOutlined
} from '@ant-design/icons';
import {
    getCourseTypes,
    getMemorizationLevels,
    getCourseById,
    updateCourse
} from '../../../api/course';
import './EditCourseView.css';

const EditCourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [courseTypes, setCourseTypes] = useState([]);
    const [memorizationLevels, setMemorizationLevels] = useState([]);
    const [formData, setFormData] = useState(null);

    const [scheduleEntry, setScheduleEntry] = useState({
        day_of_week: 'sunday',
        start_time: '',
        end_time: '',
        location: ''
    });

    useEffect(() => {
        fetchInitialData().catch(error => {
            console.error('Fetch error:', error);
            toast({
                title: 'Error',
                description: `Failed to load: ${error.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        });
    }, [id]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);

            const [courseRes, typesRes, levelsRes] = await Promise.all([
                getCourseById(id),
                getCourseTypes(),
                getMemorizationLevels()
            ]);

            if (courseRes.data) {
                const course = courseRes.data;
                console.log('Course data:', course);

                setFormData({
                    ...course,
                    target_gender: course.target_gender || '',
                    target_age_group: course.target_age_group || 'all',
                    schedule: course.schedule || []
                });
            }

            if (typesRes.data) {
                setCourseTypes(typesRes.data);
            }

            if (levelsRes.data) {
                setMemorizationLevels(levelsRes.data);
            }
        } catch (error) {
            console.error('Error loading course:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to load course data',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            navigate('/dashboard/mosque-admin/courses');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addScheduleEntry = () => {
        if (!scheduleEntry.start_time || !scheduleEntry.end_time) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in start and end time',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        setFormData(prev => ({
            ...prev,
            schedule: [...prev.schedule, { ...scheduleEntry }]
        }));

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

        if (!formData.name || !formData.course_type_id) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all required fields',
                status: 'warning',
                duration: 3000,
            });
            return;
        }

        try {
            setSaving(true);

            const response = await updateCourse(id, formData);

            if (response.status === 200) {
                toast({
                    title: 'Success',
                    description: 'Course updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                navigate('/dashboard/mosque-admin/courses');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update course',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading || !formData) {
        return (
            <div className="page-loading" style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3498db',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }}></div>
                    <p style={{ color: '#666', marginTop: '16px' }}>Loading course...</p>
                </div>
            </div>
        );
    }

    const selectedCourseType = courseTypes.find(t => t.id === Number(formData.course_type_id));
    const isMemorizationType = selectedCourseType?.name === 'memorization';

    return (
        <div className="course-edit-container" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            padding: '32px 16px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '32px'
                }}>
                    <div>
                        <button
                            onClick={() => navigate('/dashboard/mosque-admin/courses')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#3b82f6',
                                cursor: 'pointer',
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
                            Edit Course: {formData.name}
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '18px' }}>
                            Update course details and settings
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Badge
                            colorScheme={formData.is_active ? 'green' : 'gray'}
                            fontSize="14px"
                            padding="6px 12px"
                            borderRadius="8px"
                        >
                            {formData.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Basic Information Card */}
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
                                Basic Information
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '8px'
                                    }}>
                                        Course Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '8px'
                                    }}>
                                        Course Type *
                                    </label>
                                    <select
                                        value={formData.course_type_id}
                                        onChange={(e) => handleInputChange('course_type_id', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            outline: 'none',
                                            backgroundColor: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {courseTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name} - {type.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {isMemorizationType && (
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '8px'
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
                                                borderRadius: '12px',
                                                fontSize: '16px',
                                                outline: 'none',
                                                backgroundColor: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="">Select level</option>
                                            {memorizationLevels.map(level => (
                                                <option key={level.id} value={level.id}>
                                                    {level.level_name} (Juz {level.juz_range_start}-{level.juz_range_end})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '8px'
                                    }}>
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            outline: 'none',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Course Details Card */}
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
                                Course Details
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '8px'
                                    }}>
                                        Duration (weeks)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.duration_weeks || ''}
                                        onChange={(e) => handleInputChange('duration_weeks', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '8px'
                                    }}>
                                        Total Sessions
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.total_sessions || ''}
                                        onChange={(e) => handleInputChange('total_sessions', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '8px'
                                    }}>
                                        Max Students
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.max_students || ''}
                                        onChange={(e) => handleInputChange('max_students', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '8px'
                                    }}>
                                        Price (Shekel)
                                    </label>
                                    <input
                                        type="number"
                                        step="1"
                                        value={formData.price_cents}
                                        onChange={(e) => handleInputChange('price_cents', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '12px'
                                    }}>
                                        Course Format
                                    </label>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="course_format"
                                                value="short"
                                                checked={formData.course_format === 'short'}
                                                onChange={(e) => handleInputChange('course_format', e.target.value)}
                                                style={{ width: '16px', height: '16px' }}
                                            />
                                            <span>Short Course</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="course_format"
                                                value="long"
                                                checked={formData.course_format === 'long'}
                                                onChange={(e) => handleInputChange('course_format', e.target.value)}
                                                style={{ width: '16px', height: '16px' }}
                                            />
                                            <span>Long Course</span>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '12px'
                                    }}>
                                        Delivery Method
                                    </label>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="schedule_type"
                                                value="onsite"
                                                checked={formData.schedule_type === 'onsite'}
                                                onChange={(e) => handleInputChange('schedule_type', e.target.value)}
                                                style={{ width: '16px', height: '16px' }}
                                            />
                                            <span>On-site</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="schedule_type"
                                                value="online"
                                                checked={formData.schedule_type === 'online'}
                                                onChange={(e) => handleInputChange('schedule_type', e.target.value)}
                                                style={{ width: '16px', height: '16px' }}
                                            />
                                            <span>Online</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="schedule_type"
                                                value="hybrid"
                                                checked={formData.schedule_type === 'hybrid'}
                                                onChange={(e) => handleInputChange('schedule_type', e.target.value)}
                                                style={{ width: '16px', height: '16px' }}
                                            />
                                            <span>Hybrid</span>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '12px'
                                    }}>
                                        Target Age Group
                                    </label>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="target_age_group"
                                                value="all"
                                                checked={formData.target_age_group === 'all'}
                                                onChange={(e) => handleInputChange('target_age_group', e.target.value)}
                                                style={{ width: '16px', height: '16px' }}
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
                                                style={{ width: '16px', height: '16px' }}
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
                                                style={{ width: '16px', height: '16px' }}
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
                                                style={{ width: '16px', height: '16px' }}
                                            />
                                            <span>Adults</span>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '12px'
                                    }}>
                                        Target Gender
                                    </label>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="target_gender"
                                                value=""
                                                checked={!formData.target_gender || formData.target_gender === ''}
                                                onChange={(e) => handleInputChange('target_gender', e.target.value)}
                                                style={{ width: '16px', height: '16px' }}
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
                                                style={{ width: '16px', height: '16px' }}
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
                                                style={{ width: '16px', height: '16px' }}
                                            />
                                            <span>Female Only</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Card */}
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
                                Class Schedule
                            </h2>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'end' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '8px'
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
                                                borderRadius: '12px',
                                                fontSize: '16px',
                                                outline: 'none',
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
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '8px'
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
                                                borderRadius: '12px',
                                                fontSize: '16px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '8px'
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
                                                borderRadius: '12px',
                                                fontSize: '16px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            onClick={addScheduleEntry}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                width: '100%',
                                                padding: '12px 16px',
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            <PlusOutlined />
                                            Add Schedule
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {formData.schedule.length > 0 && (
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '16px'
                                    }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                                            Scheduled Sessions ({formData.schedule.length})
                                        </h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {formData.schedule.map((entry, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '16px',
                                                    backgroundColor: '#f9fafb',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e5e7eb'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <span style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#dbeafe',
                                                        color: '#1e40af',
                                                        borderRadius: '8px',
                                                        fontWeight: '600',
                                                        textTransform: 'capitalize',
                                                        fontSize: '14px'
                                                    }}>
                                                        {entry.day_of_week}
                                                    </span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <ClockCircleOutlined style={{ color: '#6b7280' }} />
                                                        <span style={{ fontWeight: '600', color: '#374151' }}>
                                                            {entry.start_time} - {entry.end_time}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeScheduleEntry(index)}
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        color: '#dc2626',
                                                        cursor: 'pointer',
                                                        padding: '8px',
                                                        borderRadius: '6px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <DeleteOutlined />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '24px',
                            borderRadius: '16px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                            accentColor: '#10b981'
                                        }}
                                    />
                                </div>
                                <div>
                                    <span style={{ fontWeight: '600', color: '#374151' }}>Active Course</span>
                                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                                        When active, students can enroll in this course
                                    </p>
                                </div>
                            </label>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard/mosque-admin/courses')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 24px',
                                        backgroundColor: 'transparent',
                                        border: '2px solid #d1d5db',
                                        color: '#374151',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <CloseOutlined />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 24px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        opacity: saving ? 0.7 : 1
                                    }}
                                >
                                    {saving ? (
                                        <>
                                            <div className="spinner" style={{
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderTop: '2px solid white',
                                                borderRadius: '50%',
                                                width: '16px',
                                                height: '16px',
                                                animation: 'spin 1s linear infinite'
                                            }}></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <SaveOutlined />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCourseView;