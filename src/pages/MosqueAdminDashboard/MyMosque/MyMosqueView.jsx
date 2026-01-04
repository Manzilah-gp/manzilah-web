import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    EditOutlined,
    TeamOutlined,
    BookOutlined,
    UserOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    PlusOutlined,
    EyeOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import { getMosqueById } from '../../../api/mosque';
import { getCoursesByMosque, getMyMosqueId } from '../../../api/course';
import useAuth from '../../../hooks/useAuth';
import './MyMosqueView.css';

const MyMosqueView = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [mosque, setMosque] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const getMosqueIdForAdmin = async () => {
        const adminId = user.id;
        const response = await getMyMosqueId(adminId);

        return response.data.mosqueId;
    };


    useEffect(() => {
        fetchMosqueData();
    }, []);

    const fetchMosqueData = async () => {
        try {
            setLoading(true);
            const mosqueId = await getMosqueIdForAdmin();
            console.log('mosque id ', mosqueId);

            if (!mosqueId) {
                alert('Mosque not found for this admin');
                return;
            }

            const mosqueResponse = await getMosqueById(mosqueId);



            if (mosqueResponse.data) {
                setMosque(mosqueResponse.data.data);
            }
            console.log('mosque data ', mosqueResponse);

            const coursesResponse = await getCoursesByMosque(mosqueId);
            if (coursesResponse.data) {
                setCourses(coursesResponse.data);
            }
        } catch (error) {
            console.error('Error fetching mosque data:', error);
            alert('Failed to load mosque data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = () => {
        navigate('/mosque-admin/courses/create');
    };

    const handleViewCourses = () => {
        navigate('/mosque-admin/courses');
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px'
            }}>
                <div className="spinner" style={{
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3b82f6',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    if (!mosque) {
        return (
            <div style={{ padding: '32px' }}>
                <div style={{
                    backgroundColor: '#fed7d7',
                    color: '#9b2c2c',
                    padding: '16px',
                    borderRadius: '8px'
                }}>
                    Mosque not found. Please contact system administrator.
                </div>
            </div>
        );
    }

    return (
        <div className="my-mosque-container" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            padding: '32px 16px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '32px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            marginBottom: '8px'
                        }}>
                            {mosque.name}
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '18px' }}>
                            Manage your mosque details, courses, and activities
                        </p>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '24px'
                }}>
                    {/* Mosque Details Card */}
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
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <EnvironmentOutlined />
                            Mosque Details
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <h3 style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#6b7280',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase'
                                }}>
                                    Location
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <EnvironmentOutlined style={{ color: '#3b82f6' }} />
                                    <p style={{
                                        color: '#374151',
                                        fontSize: '16px',
                                        margin: 0
                                    }}>
                                        {mosque.address || 'No address provided'}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {mosque.governorate && (
                                        <span style={{
                                            backgroundColor: '#dbeafe',
                                            color: '#1e40af',
                                            padding: '6px 12px',
                                            borderRadius: '9999px',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}>
                                            {mosque.governorate}
                                        </span>
                                    )}
                                    {mosque.region && (
                                        <span style={{
                                            backgroundColor: '#f3f4f6',
                                            color: '#374151',
                                            padding: '6px 12px',
                                            borderRadius: '9999px',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}>
                                            {mosque.region}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}></div>

                            <div>
                                <h3 style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#6b7280',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase'
                                }}>
                                    Contact Information
                                </h3>
                                {mosque.contact_number ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <PhoneOutlined style={{ color: '#10b981' }} />
                                        <p style={{
                                            color: '#374151',
                                            fontSize: '16px',
                                            margin: 0
                                        }}>
                                            {mosque.contact_number}
                                        </p>
                                    </div>
                                ) : (
                                    <p style={{
                                        color: '#9ca3af',
                                        fontSize: '14px',
                                        fontStyle: 'italic',
                                        margin: 0
                                    }}>
                                        No contact number provided
                                    </p>
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}></div>

                            <div>
                                <h3 style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#6b7280',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase'
                                }}>
                                    Administrator
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3b82f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '16px'
                                    }}>
                                        {user.full_name?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <p style={{
                                            fontWeight: '600',
                                            color: '#1f2937',
                                            margin: '0 0 4px 0'
                                        }}>
                                            {user.full_name}
                                        </p>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#6b7280',
                                            margin: 0
                                        }}>
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {mosque.latitude && mosque.longitude && (
                                <>
                                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}></div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#6b7280',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase'
                                        }}>
                                            Coordinates
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            gap: '24px',
                                            fontSize: '14px',
                                            fontFamily: 'monospace'
                                        }}>
                                            <div>
                                                <span style={{
                                                    fontWeight: '600',
                                                    color: '#374151'
                                                }}>
                                                    Lat:
                                                </span>{' '}
                                                {parseFloat(mosque.latitude).toFixed(6)}
                                            </div>
                                            <div>
                                                <span style={{
                                                    fontWeight: '600',
                                                    color: '#374151'
                                                }}>
                                                    Lng:
                                                </span>{' '}
                                                {parseFloat(mosque.longitude).toFixed(6)}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Sidebar with Quick Actions and Recent Activity */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Quick Actions Card */}
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
                                Quick Actions
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    onClick={handleAddCourse}
                                    style={{
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <PlusOutlined />
                                    Add New Course
                                </button>

                                <button
                                    onClick={handleViewCourses}
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: '#3b82f6',
                                        border: '2px solid #3b82f6',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <EyeOutlined />
                                    View All Courses
                                </button>

                                <div style={{
                                    borderTop: '1px solid #e5e7eb',
                                    margin: '16px 0',
                                    paddingTop: '16px'
                                }}></div>

                                <div style={{
                                    padding: '16px',
                                    backgroundColor: '#eff6ff',
                                    borderRadius: '8px',
                                    borderLeft: '4px solid #3b82f6'
                                }}>
                                    <p style={{
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#1e40af',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        💡 Quick Tip
                                    </p>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#3b82f6',
                                        margin: 0,
                                        lineHeight: '1.5'
                                    }}>
                                        Keep your mosque information up to date to help students and parents find your courses easily.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Card */}
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
                                Recent Activity
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {courses.slice(0, 3).map((course) => (
                                    <div
                                        key={course.id}
                                        style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '8px',
                                            borderLeft: '3px solid #3b82f6',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => navigate(`/mosque-admin/courses/${course.id}`)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f9fafb';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <p style={{
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            color: '#1f2937',
                                            margin: '0 0 4px 0'
                                        }}>
                                            {course.name}
                                        </p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            margin: 0
                                        }}>
                                            {course.enrolled_students || 0} students enrolled
                                        </p>
                                    </div>
                                ))}
                                {courses.length === 0 && (
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#9ca3af',
                                        textAlign: 'center',
                                        padding: '32px 0',
                                        fontStyle: 'italic'
                                    }}>
                                        No courses yet. Create your first course!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyMosqueView;