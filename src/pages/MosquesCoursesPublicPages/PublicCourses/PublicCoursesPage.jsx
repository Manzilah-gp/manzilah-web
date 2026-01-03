import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getPublicCourses, getFilterOptions } from '../../../api/publicBrowsing';
import './PublicCoursesPage.css';
import { getGovernorates } from '../../../util/getGovernates';

const PublicCoursesPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState({
        governorates: [],
        courseTypes: [],
        ageGroups: [],
        genders: [],
        scheduleTypes: [],
        priceFilters: []
    });

    const [filters, setFilters] = useState({
        search: '',
        governorate: 'all',
        course_type: 'all',
        target_age_group: 'all',
        target_gender: 'all',
        schedule_type: 'all',
        price_filter: 'all'
    });

    useEffect(() => {
        const initData = async () => {
            try {
                // Fetch filter options first
                const optionsRes = await getFilterOptions();
                if (optionsRes.data && optionsRes.data.success) {
                    setFilterOptions(optionsRes.data.data);
                }
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };
        initData();
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [filters]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await getPublicCourses(filters);
            setCourses(response.data.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = (courseId) => {
        navigate(`/public/course/${courseId}`);
    };

    const formatPrice = (priceCents) => {
        return priceCents === 0 ? 'Free' : `₪${priceCents}`;
    };

    return (
        <div className="public-courses-page">
            <Header />
            <div className="public-courses-content">
                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title">
                        Browse Quran Courses
                    </h1>
                    <p className="page-subtitle">
                        Find the perfect course to enhance your Quranic knowledge
                    </p>
                </div>

                {/* Filters */}
                <div className="filters-container">
                    <div className="filters-grid">
                        {/* Search */}
                        <div className="search-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by course name, description..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="search-input"
                            />
                        </div>

                        {/* Governorate Filter */}
                        <select
                            value={filters.governorate}
                            onChange={(e) => setFilters({ ...filters, governorate: e.target.value })}
                            className="filter-select"
                        >
                            {getGovernorates().map(gov => (
                                <option key={gov.value} value={gov.value}>
                                    {gov.label}
                                </option>
                            ))}
                        </select>

                        {/* Course Type Filter */}
                        <select
                            value={filters.course_type}
                            onChange={(e) => setFilters({ ...filters, course_type: e.target.value })}
                            className="filter-select"
                        >
                            <option value="all">All Course Types</option>
                            {filterOptions.courseTypes.map(type => (
                                <option key={type.id} value={type.name}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                        {/* Age Group Filter */}
                        <select
                            value={filters.target_age_group}
                            onChange={(e) => setFilters({ ...filters, target_age_group: e.target.value })}
                            className="filter-select"
                        >
                            <option value="all">All Age Groups</option>
                            {/* Static fallback if empty, otherwise dynamic */}
                            {['children', 'teenagers', 'adults'].map(age => (
                                <option key={age} value={age}>
                                    {age.charAt(0).toUpperCase() + age.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* Gender Filter */}
                        <select
                            value={filters.target_gender}
                            onChange={(e) => setFilters({ ...filters, target_gender: e.target.value })}
                            className="filter-select"
                        >
                            <option value="all">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

                        {/* Schedule Type Filter */}
                        <select
                            value={filters.schedule_type}
                            onChange={(e) => setFilters({ ...filters, schedule_type: e.target.value })}
                            className="filter-select"
                        >
                            <option value="all">All Schedules</option>
                            <option value="onsite">Onsite</option>
                            <option value="online">Online</option>
                            <option value="hybrid">Hybrid</option>
                        </select>

                        {/* Price Filter */}
                        <select
                            value={filters.price_filter}
                            onChange={(e) => setFilters({ ...filters, price_filter: e.target.value })}
                            className="filter-select"
                        >
                            <option value="all">All Prices</option>
                            <option value="free">Free</option>
                            <option value="paid">Paid</option>
                        </select>

                    </div>
                </div>

                {/* Results Count */}
                <p className="results-count">
                    {loading ? 'Loading...' : `Found ${courses.length} courses`}
                </p>

                {/* Courses Grid */}
                {loading ? (
                    <div className="loading-message">
                        Loading courses...
                    </div>
                ) : courses.length === 0 ? (
                    <div className="no-results">
                        <span className="no-results-icon">📚</span>
                        <h3 className="no-results-title">No courses found</h3>
                        <p className="no-results-text">Try adjusting your search filters</p>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {courses.map(course => (
                            <div
                                key={course.id}
                                onClick={() => handleCourseClick(course.id)}
                                className="course-card"
                            >
                                {/* Course Header */}
                                <div className="course-header">
                                    <div className="course-title-row">
                                        <h3 className="course-title">
                                            {course.name}
                                        </h3>
                                        <span className={`course-price ${course.price_cents === 0 ? 'free' : 'paid'}`}>
                                            {formatPrice(course.price_cents)}
                                        </span>
                                    </div>

                                    <div className="course-tags">
                                        <span className="course-tag tag-blue">
                                            {course.course_type}
                                        </span>
                                        <span className="course-tag tag-purple">
                                            {course.schedule_type}
                                        </span>
                                        {course.target_age_group && (
                                            <span className="course-tag tag-amber">
                                                {course.target_age_group}
                                            </span>
                                        )}
                                        {course.target_gender && (
                                            <span className="course-tag tag-green">
                                                {course.target_gender}
                                            </span>
                                        )}
                                    </div>

                                    <p className="course-description">
                                        {course.description}
                                    </p>
                                </div>

                                {/* Main Details */}
                                <div className="course-details">
                                    <div className="detail-row">
                                        <span className="detail-icon">🕌</span>
                                        <span className="detail-text">{course.mosque_name}</span>
                                    </div>

                                    <div className="detail-row" style={{ marginBottom: '16px' }}>
                                        <span className="detail-icon">📍</span>
                                        <span>{course.region}, {course.governorate}</span>
                                    </div>

                                    <div className="course-meta">
                                        <div>
                                            <span style={{ marginRight: '4px' }}>📆</span>
                                            {new Date(course.course_start_date).toLocaleDateString()}
                                        </div>
                                        <div>
                                            <span style={{ marginRight: '4px' }}>👤</span>
                                            {course.available_spots > 900 ? 'Open' : `${course.available_spots} spots left`}
                                        </div>
                                    </div>

                                    <div className="view-details-btn">
                                        <span>View Details</span>
                                        <span>→</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default PublicCoursesPage;
