import React, { useState, useEffect } from 'react';
import { getMosqueDetails } from '../../../api/publicBrowsing';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import './MosqueDetailsPage.css';

const MosqueDetailsPage = () => {
    const [mosque, setMosque] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id: mosqueId } = useParams();

    useEffect(() => {
        fetchMosqueDetails();
    }, [mosqueId]);

    const fetchMosqueDetails = async () => {
        setLoading(true);
        try {
            const response = await getMosqueDetails(mosqueId);
            setMosque(response.data.data);
        } catch (error) {
            console.error('Error fetching mosque details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewCourse = (courseId) => {
        navigate(`/public/course/${courseId}`);
    };

    const formatPrice = (price) => {
        return price === 0 ? 'Free' : `₪${price}`;
    };

    const getAgeGroupLabel = (ageGroup) => {
        const labels = {
            children: '👶 Children (Under 13)',
            teenagers: '👦 Teenagers (13-17)',
            adults: '👨 Adults (18+)',
            all: '👥 All Ages'
        };
        return labels[ageGroup] || ageGroup;
    };

    const getGenderLabel = (gender) => {
        if (!gender) return '⚧️ Mixed (All Genders)';
        return gender === 'male' ? '♂️ Male Only' : '♀️ Female Only';
    };

    if (loading) {
        return (
            <div className="loading-container">
                Loading mosque details...
            </div>
        );
    }

    if (!mosque) {
        return (
            <div className="error-container">
                <h2>Mosque not found</h2>
                <button className="goback-btn" onClick={() => window.history.back()}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="mosque-details-page">
            <Header />
            <div className="mosque-details-content">
                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="back-button"
                >
                    <span>←</span> Back to Mosques
                </button>

                {/* Mosque Header */}
                <div className="mosque-header-card">
                    <div className="mosque-info-wrapper">
                        <div className="mosque-main-icon">
                            🕌
                        </div>
                        <div className="mosque-title-wrapper">
                            <h1 className="mosque-title">
                                {mosque.name}
                            </h1>
                            <div className="mosque-meta">
                                <div className="meta-item">
                                    <span>📍</span>
                                    <span>{mosque.region}, {mosque.governorate}</span>
                                </div>
                                {mosque.contact_number && (
                                    <div className="meta-item">
                                        <span>📞</span>
                                        <span>{mosque.contact_number}</span>
                                    </div>
                                )}
                                {mosque.admin_name && (
                                    <div className="meta-item">
                                        <span>👨‍💼</span>
                                        <span>{mosque.admin_name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {mosque.address && (
                        <div className="mosque-address-box">
                            <strong>Address:</strong> {mosque.address}
                        </div>
                    )}
                </div>

                {/* Courses Section */}
                <div className="courses-section">
                    <h2 className="courses-section-title">
                        Available Courses ({mosque.courses?.length || 0})
                    </h2>

                    {mosque.courses?.length === 0 ? (
                        <div className="no-courses-box">
                            <span className="no-courses-icon">📚</span>
                            <h3 className="no-courses-title">No courses available</h3>
                            <p className="no-courses-text">Check back later for new courses</p>
                        </div>
                    ) : (
                        <div className="courses-grid">
                            {mosque.courses?.map(course => (
                                <div
                                    key={course.id}
                                    className="course-card"
                                    onClick={() => handleViewCourse(course.id)}
                                >
                                    {/* Course Header */}
                                    <div className="card-header">
                                        <div className="card-title-row">
                                            <h3 className="card-title">
                                                {course.name}
                                            </h3>
                                            <span className={`card-price ${course.price_cents === 0 ? 'card-price-free' : 'card-price-paid'}`}>
                                                {formatPrice(course.price_cents)}
                                            </span>
                                        </div>

                                        <div className="card-tags">
                                            <span className="tag tag-blue">
                                                {course.course_type}
                                            </span>
                                            <span className="tag tag-purple">
                                                {course.schedule_type}
                                            </span>
                                            {course.is_online_enabled && (
                                                <span className="tag tag-green">
                                                    🎥 Video Call
                                                </span>
                                            )}
                                        </div>

                                        {course.description && (
                                            <p className="card-description">
                                                {course.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Course Details */}
                                    <div className="course-details-section">
                                        <div className="details-grid">
                                            <div>
                                                <div className="detail-label">
                                                    👥 Enrollment
                                                </div>
                                                <div>{course.enrolled_count}/{course.max_students} ({course.available_spots} spots left)</div>
                                            </div>
                                            <div>
                                                <div className="detail-label">
                                                    📅 Starts
                                                </div>
                                                <div>{new Date(course.course_start_date).toLocaleDateString()}</div>
                                            </div>
                                            <div>
                                                <div className="detail-label">
                                                    ⏰ Deadline
                                                </div>
                                                <div>
                                                    {course.days_until_deadline > 0
                                                        ? `${course.days_until_deadline} days left`
                                                        : 'Today'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="detail-label">
                                                    👨‍🏫 Teacher
                                                </div>
                                                <div>{course.teacher_name || 'TBA'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Schedule */}
                                    {course.schedule?.length > 0 && (
                                        <div className="schedule-box">
                                            <div className="schedule-header">
                                                📆 Schedule:
                                            </div>
                                            {course.schedule.map((s, idx) => (
                                                <div key={idx} className="schedule-row">
                                                    {s.day_of_week.charAt(0).toUpperCase() + s.day_of_week.slice(1)}: {s.start_time} - {s.end_time}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Eligibility */}
                                    <div className="eligibility-box">
                                        <span className="eligibility-tag tag-amber">
                                            {getAgeGroupLabel(course.target_age_group)}
                                        </span>
                                        <span className="eligibility-tag tag-indigo">
                                            {getGenderLabel(course.target_gender)}
                                        </span>
                                    </div>

                                    {/* View Course Button */}
                                    <button className="view-course-btn">
                                        View Course Details →
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MosqueDetailsPage;