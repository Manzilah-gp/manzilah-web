import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getCourseDetails } from '../../../api/publicBrowsing';
import './CourseDetailsPage.css';
import { checkEnrollmentEligibility, enrollInFreeCourse } from '../../../api/enrollment';
import useAuth from '../../../hooks/useAuth';
import StripePaymentModal from '../../../components/Payment/StripePaymentModal';  

const CourseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [enrolling, setEnrolling] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);  

    useEffect(() => {
        if (id) {
            fetchCourseDetails();
        }
    }, [id]);

    const fetchCourseDetails = async () => {
        setLoading(true);
        try {
            const response = await getCourseDetails(id);
            setCourse(response.data.data);
        } catch (error) {
            console.error('Error fetching course details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        // Check if logged in
        if (!user) {
            localStorage.setItem('enrollCourseId', id);
            navigate('/login', {
                state: {
                    message: 'Please login to enroll',
                    returnTo: `/public/course/${id}`
                }
            });
            return;
        }

        setEnrolling(true);

        try {
            // Check eligibility
            const eligibilityRes = await checkEnrollmentEligibility(id);
            const eligibility = eligibilityRes.data.data;

            if (!eligibility.eligible) {
                alert(`Cannot enroll:\n${eligibility.reasons.join('\n')}`);
                setEnrolling(false);
                return;
            }

            // Enroll based on price
            if (course.price_cents === 0) {
                // Free course - enroll directly
                const enrollRes = await enrollInFreeCourse(id);
                if (enrollRes.data.success) {
                    alert('Successfully enrolled!');
                    navigate('/my-enrollments');
                }
            } else {
                // ⭐ PAID COURSE - SHOW PAYMENT MODAL (NOT DIRECT ENROLLMENT!)
                setShowPaymentModal(true);
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            alert(error.response?.data?.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    const handleMosqueClick = (mosqueId) => {
        navigate(`/public/mosque/${mosqueId}`);
    };

    const formatPrice = (priceCents) => {
        return priceCents === 0 ? 'Free' : `₪${(priceCents / 100).toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div>Loading course details...</div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="error-container">
                <h2>Course not found</h2>
                <button className="nav-button" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="course-details-page">
            <Header />
            <div className="course-details-content">
                <div className="course-details-wrapper">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="back-button"
                    >
                        <span>←</span> Back
                    </button>

                    {/* Main Content Card */}
                    <div className="details-card">
                        {/* Header */}
                        <div className="details-header">
                            <div className="title-row">
                                <div>
                                    <h1 className="course-title-large">
                                        {course.name}
                                    </h1>
                                    <div className="tag-container">
                                        <span className="tag-blue">{course.course_type}</span>
                                        <span className="tag-purple">{course.schedule_type}</span>
                                        {course.is_online_enabled && (
                                            <span className="tag-green">🎥 Online Available</span>
                                        )}
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className={`price-text ${course.price_cents === 0 ? 'price-free' : 'price-paid'}`}>
                                        {formatPrice(course.price_cents)}
                                    </div>
                                    <div className="enrollment-status">
                                        {course.is_enrollment_open ? '🟢 Enrollment Open' : '🔴 Enrollment Closed'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Description */}
                        <div>
                            <h2 className="section-title">About this Course</h2>
                            <p className="description-text">
                                {course.description || 'No description available provided.'}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="info-grid">
                            {/* Key Info */}
                            <div>
                                <h3 className="sub-title">Course Information</h3>
                                <ul className="info-list">
                                    <li className="info-item">
                                        <span className="info-label">Target Audience:</span>
                                        {course.target_age_group} ({course.target_gender || 'Mixed'})
                                    </li>
                                    <li className="info-item">
                                        <span className="info-label">Level:</span>
                                        {course.memorization_level || 'General'}
                                        {course.juz_range_start && ` (Juz ${course.juz_range_start}-${course.juz_range_end})`}
                                    </li>
                                    <li className="info-item">
                                        <span className="info-label">Start Date:</span>
                                        {new Date(course.course_start_date).toLocaleDateString()}
                                    </li>
                                    <li className="info-item">
                                        <span className="info-label">Availability:</span>
                                        {course.available_spots} spots remaining
                                    </li>
                                    <li className="info-item">
                                        <span className="info-label">Teacher:</span>
                                        {course.teacher_name || 'TBA'}
                                    </li>
                                </ul>
                            </div>

                            {/* Schedule */}
                            <div>
                                <h3 className="sub-title">Weekly Schedule</h3>
                                {course.schedule && course.schedule.length > 0 ? (
                                    <div className="schedule-list">
                                        {course.schedule.map((slot, idx) => (
                                            <div key={idx} className="schedule-item">
                                                <div className="day-name">
                                                    {slot.day_of_week}
                                                </div>
                                                <div className="time-slot">
                                                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                                </div>
                                                {slot.location && (
                                                    <div className="location-snippet">
                                                        📍 {slot.location}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="schedule-placeholder">Schedule to be announced</p>
                                )}
                            </div>
                        </div>

                        {/* Mosque Info */}
                        <div className="mosque-info-box">
                            <div className="mosque-box-header">
                                <h3 className="sub-title" style={{ marginBottom: 0 }}>Hosted by</h3>
                                <button
                                    onClick={() => handleMosqueClick(course.mosque_id)}
                                    className="view-mosque-btn"
                                >
                                    View Mosque Profile →
                                </button>
                            </div>

                            <div className="mosque-details-flex">
                                <div className="mosque-icon-circle">
                                    🕌
                                </div>
                                <div>
                                    <h4 className="mosque-name">
                                        {course.mosque_name}
                                    </h4>
                                    <div className="mosque-address-info">
                                        <div>📍 {course.region}, {course.governorate}</div>
                                        {course.mosque_address && <div>🏠 {course.mosque_address}</div>}
                                        {course.mosque_contact && <div>📞 {course.mosque_contact}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enroll Button */}
                        <div style={{ marginTop: '32px' }}>
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling || !course.is_enrollment_open}
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    backgroundColor: course.is_enrollment_open ? '#667eea' : '#9ca3af',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: course.is_enrollment_open ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {enrolling ? 'Processing...' :
                                    !course.is_enrollment_open ? 'Enrollment Closed' :
                                        course.price_cents === 0 ? '🎓 Enroll Now (Free)' :
                                            `🎓 Enroll Now (${formatPrice(course.price_cents)})`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ⭐ PAYMENT MODAL - Shows when user clicks enroll on paid course */}
            <StripePaymentModal
                visible={showPaymentModal}
                onCancel={() => setShowPaymentModal(false)}
                course={course}
            />

            <Footer />
        </div>
    );
};

export default CourseDetailsPage;