import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useToast,
} from '@chakra-ui/react';
import {
    ArrowLeftOutlined,
    ReloadOutlined,
    ClockCircleOutlined,
    LaptopOutlined,
    HomeOutlined,
    GlobalOutlined,
    CheckCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    getCourseById,
    getSuggestedTeachers,
    assignTeacherToCourse
} from '../../../../api/course';
import TeacherSelectionModal from '../../../../components/Course/TeacherSelectionModal';
import './AssignTeacherView.css';

const AssignTeacherView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [course, setCourse] = useState(null);
    const [suggestedTeachers, setSuggestedTeachers] = useState([]);
    const [showTeacherModal, setShowTeacherModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch course details
            const courseRes = await getCourseById(id);

            if (courseRes.data) {
                const courseData = courseRes.data;
                setCourse(courseData);

                // Prepare suggestion criteria
                const suggestionData = {
                    course_type_id: courseData.course_type_id,
                    course_level: courseData.course_level,
                    schedule: courseData.schedule,
                    mosque_id: courseData.mosque_id,
                    target_gender: courseData.target_gender
                };

                // Fetch teacher suggestions
                const teachersRes = await getSuggestedTeachers(suggestionData);

                if (teachersRes.data) {
                    setSuggestedTeachers(teachersRes.data);
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to load course data',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTeacher = async (teacher) => {
        try {
            setAssigning(true);

            const response = await assignTeacherToCourse(id, teacher.id);
            console.log('assignTeacher', response);
            if (response.status === 200) {
                toast({
                    title: 'Success',
                    description: `${teacher.full_name} has been assigned to this course`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Navigate back to course list
                navigate('/mosque-admin/courses');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to assign teacher',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setAssigning(false);
            setShowTeacherModal(false);
        }
    };

    if (loading || !course) {
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
                    <p style={{ color: '#666', marginTop: '16px' }}>Loading course data...</p>
                </div>
            </div>
        );
    }

    const getScheduleIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'online':
                return <LaptopOutlined style={{ width: '16px', height: '16px' }} />;
            case 'onsite':
                return <HomeOutlined style={{ width: '16px', height: '16px' }} />;
            case 'hybrid':
                return <GlobalOutlined style={{ width: '16px', height: '16px' }} />;
            default:
                return <HomeOutlined style={{ width: '16px', height: '16px' }} />;
        }
    };

    return (
        <div className="assign-teacher-container" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            padding: '32px 16px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <button
                        onClick={() => navigate('/mosque-admin/courses')}
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
                        Assign Teacher
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '18px' }}>
                        Select a qualified teacher for: {course.name}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Course Information Card */}
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
                            Course Information
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                                    Course Name
                                </h3>
                                <p style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                                    {course.name}
                                </p>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                                    Course Type
                                </h3>
                                <span style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#dbeafe',
                                    color: '#1e40af',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '14px'
                                }}>
                                    {course.course_type}
                                </span>
                            </div>

                            {course.memorization_level && (
                                <div>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                                        Level
                                    </h3>
                                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                                        {course.memorization_level}
                                    </p>
                                </div>
                            )}

                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                                    Format
                                </h3>
                                <span style={{
                                    padding: '6px 12px',
                                    backgroundColor: course.course_format === 'short' ? '#dbeafe' : '#f3e8ff',
                                    color: course.course_format === 'short' ? '#1e40af' : '#7c3aed',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '14px'
                                }}>
                                    {course.course_format === 'short' ? 'Short Course' : 'Long Course'}
                                </span>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                                    Delivery
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {getScheduleIcon(course.schedule_type)}
                                    <span style={{
                                        padding: '6px 12px',
                                        backgroundColor: course.schedule_type === 'online' ? '#d1fae5' :
                                            course.schedule_type === 'onsite' ? '#fed7aa' : '#ccfbf1',
                                        color: course.schedule_type === 'online' ? '#065f46' :
                                            course.schedule_type === 'onsite' ? '#9a3412' : '#0f766e',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        textTransform: 'capitalize'
                                    }}>
                                        {course.schedule_type}
                                    </span>
                                </div>
                            </div>

                            {course.target_gender && (
                                <div>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                                        Target Gender
                                    </h3>
                                    <span style={{
                                        padding: '6px 12px',
                                        backgroundColor: course.target_gender === 'male' ? '#dbeafe' : '#fce7f3',
                                        color: course.target_gender === 'male' ? '#1e40af' : '#be185d',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '14px'
                                    }}>
                                        {course.target_gender === 'male' ? 'Male Only' : 'Female Only'}
                                    </span>
                                </div>
                            )}

                            {course.schedule && course.schedule.length > 0 && (
                                <div style={{ gridColumn: 'span 2' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px' }}>
                                        Class Schedule
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {course.schedule.map((slot, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '12px 16px',
                                                    backgroundColor: '#f9fafb',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e7eb'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        backgroundColor: '#dbeafe',
                                                        color: '#1e40af',
                                                        borderRadius: '6px',
                                                        fontWeight: '600',
                                                        fontSize: '14px',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {slot.day_of_week}
                                                    </span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <ClockCircleOutlined style={{ color: '#6b7280', fontSize: '14px' }} />
                                                        <span style={{ fontWeight: '600', color: '#374151' }}>
                                                            {slot.start_time} - {slot.end_time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Teacher Suggestions Summary */}
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
                            Available Teachers
                        </h2>

                        {suggestedTeachers.length === 0 ? (
                            <div style={{
                                padding: '24px',
                                backgroundColor: '#fef3c7',
                                border: '1px solid #fbbf24',
                                borderRadius: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ color: '#d97706', fontSize: '20px' }}>⚠️</div>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
                                            No teachers found
                                        </h3>
                                        <p style={{ color: '#92400e', fontSize: '14px' }}>
                                            No teachers found matching all course requirements.
                                            You may need to adjust course parameters or wait for more teachers to register.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                                            Found {suggestedTeachers.length} qualified teacher(s)
                                        </span>
                                        <span style={{
                                            padding: '2px 8px',
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            Best Matches
                                        </span>
                                    </div>

                                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                                        Teachers are selected based on:
                                    </p>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '12px',
                                        marginBottom: '24px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CheckCircleOutlined style={{ color: '#10b981' }} />
                                            <span style={{ fontSize: '14px', color: '#374151' }}>Course type expertise</span>
                                        </div>
                                        {course.course_level && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <CheckCircleOutlined style={{ color: '#10b981' }} />
                                                <span style={{ fontSize: '14px', color: '#374151' }}>Memorization level capability</span>
                                            </div>
                                        )}
                                        {course.target_gender && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <CheckCircleOutlined style={{ color: '#10b981' }} />
                                                <span style={{ fontSize: '14px', color: '#374151' }}>Gender matching</span>
                                            </div>
                                        )}
                                        {course.schedule && course.schedule.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <CheckCircleOutlined style={{ color: '#10b981' }} />
                                                <span style={{ fontSize: '14px', color: '#374151' }}>Schedule availability</span>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CheckCircleOutlined style={{ color: '#10b981' }} />
                                            <span style={{ fontSize: '14px', color: '#374151' }}>Current workload</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button
                                        onClick={() => setShowTeacherModal(true)}
                                        disabled={assigning}
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
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        {assigning ? (
                                            <>
                                                <div className="spinner" style={{
                                                    border: '2px solid rgba(255,255,255,0.3)',
                                                    borderTop: '2px solid white',
                                                    borderRadius: '50%',
                                                    width: '16px',
                                                    height: '16px',
                                                    animation: 'spin 1s linear infinite'
                                                }}></div>
                                                Loading...
                                            </>
                                        ) : (
                                            <>
                                                <UserOutlined />
                                                View & Select Teacher
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={fetchData}
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
                                        <ReloadOutlined />
                                        Refresh Suggestions
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Alternative Options */}
                    <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '24px',
                        borderRadius: '16px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                            Alternative Options
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                            If you can't find a suitable teacher right now:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <span style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>•</span>
                                <span style={{ fontSize: '14px', color: '#374151' }}>
                                    You can leave the course without a teacher and assign one later
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <span style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>•</span>
                                <span style={{ fontSize: '14px', color: '#374151' }}>
                                    Consider adjusting the course schedule to match teacher availability
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <span style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>•</span>
                                <span style={{ fontSize: '14px', color: '#374151' }}>
                                    Check back as new teachers complete their registration
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/mosque-admin/courses')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'transparent',
                                border: '1px solid #d1d5db',
                                color: '#374151',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Assign Teacher Later
                        </button>
                    </div>
                </div>
            </div>

            {/* Teacher Selection Modal */}
            <TeacherSelectionModal
                isOpen={showTeacherModal}
                onClose={() => setShowTeacherModal(false)}
                teachers={suggestedTeachers}
                onSelect={handleAssignTeacher}
                courseData={course}
            />
        </div>
    );
};

export default AssignTeacherView;