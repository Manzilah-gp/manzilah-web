import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getPublicMosques, getClosestMosques } from '../../../api/publicBrowsing';
import './PublicMosquesPage.css';
import { getGovernorates } from '../../../util/getGovernates';
import useAuth from '../../../hooks/useAuth';

const PublicMosquesPage = () => {
    const [mosques, setMosques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        governorate: 'all',
        search: ''
    });
    const [showClosest, setShowClosest] = useState(false);
    const [loadingClosest, setLoadingClosest] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        // Don't fetch all mosques if we're showing closest mosques
        if (!showClosest) {
            fetchMosques();
        }
    }, [filters]);

    const fetchMosques = async () => {
        setLoading(true);
        try {
            const response = await getPublicMosques(filters);
            setMosques(response.data.data || []);
        } catch (error) {
            console.error('Error fetching mosques:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClosestMosques = async () => {
        // Check if user is logged in
        if (!user) {
            alert('Please log in to find nearest centers');
            navigate('/login');
            return;
        }

        setLoadingClosest(true);
        try {
            const response = await getClosestMosques();
            console.log('closest mosques', response.data.data);

            // Set showClosest FIRST to prevent useEffect from triggering
            setShowClosest(true);
            setMosques(response.data.data || []);
        } catch (error) {
            console.error('Error fetching closest mosques:', error);
            if (error.response?.status === 404) {
                alert('Location not found. Please add your location in your profile to use this feature.');
            } else {
                alert('Failed to fetch nearest centers. Please try again.');
            }
        } finally {
            setLoadingClosest(false);
        }
    };


    const handleShowAll = () => {
        setShowClosest(false);
        fetchMosques();
    };


    const handleMosqueClick = (mosqueId) => {
        navigate(`/public/mosque/${mosqueId}`);
    };

    const governorates = getGovernorates();

    return (
        <div className="public-mosques-page">
            <Header />
            <div className="public-mosques-content">
                {/* Header Section */}
                <div className="page-header">
                    <h1 className="page-title">
                        Browse Quran Centers
                    </h1>
                    <p className="page-subtitle">
                        Find the perfect center for your Quranic education journey
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
                                placeholder="Search by name or location..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="search-input"
                                disabled={showClosest}
                            />
                        </div>

                        {/* Governorate Filter */}
                        <select
                            value={filters.governorate}
                            onChange={(e) => setFilters({ ...filters, governorate: e.target.value })}
                            className="filter-select"
                            disabled={showClosest}
                        >
                            {governorates.map(gov => (
                                <option key={gov.value} value={gov.value}>
                                    {gov.label}
                                </option>
                            ))}
                        </select>

                        {/* Find Nearest Button */}
                        {!showClosest ? (
                            <button
                                onClick={fetchClosestMosques}
                                className="nearest-btn"
                                disabled={loadingClosest}
                            >
                                <span className="btn-icon">📍</span>
                                {loadingClosest ? 'Finding...' : 'Find Nearest Centers'}
                            </button>
                        ) : (
                            <button
                                onClick={handleShowAll}
                                className="show-all-btn"
                            >
                                <span className="btn-icon">🕌</span>
                                Show All Centers
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <p className="results-count">
                    {loading ? 'Loading...' : showClosest
                        ? `Your ${mosques.length} nearest centers`
                        : `Found ${mosques.length} centers`}
                </p>

                {/* Mosques Grid */}
                {loading ? (
                    <div className="loading-message">
                        Loading centers...
                    </div>
                ) : mosques.length === 0 ? (
                    <div className="no-results">
                        <span className="no-results-icon">🕌</span>
                        <h3 className="no-results-title">No centers found</h3>
                        <p className="no-results-text">Try adjusting your search filters</p>
                    </div>
                ) : (
                    <div className="mosques-grid">
                        {mosques.map(mosque => (
                            <div
                                key={mosque.id}
                                onClick={() => handleMosqueClick(mosque.id)}
                                className="mosque-card"
                            >
                                {/* Mosque Name */}
                                <h3 className="mosque-header">
                                    <span className="mosque-icon">
                                        🕌
                                    </span>
                                    {mosque.name}
                                    {showClosest && mosque.distance_km !== undefined && (
                                        <span className="distance-badge">
                                            {mosque.distance_km.toFixed(1)} km
                                        </span>
                                    )}
                                </h3>

                                {/* Location */}
                                <div className="mosque-location">
                                    <span className="location-icon">📍</span>
                                    <div>
                                        <p className="location-text">
                                            {mosque.region}, {mosque.governorate.charAt(0).toUpperCase() + mosque.governorate.slice(1)}
                                        </p>
                                        {mosque.address && (
                                            <p className="address-text">{mosque.address}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Contact */}
                                {mosque.contact_number && (
                                    <div className="mosque-contact">
                                        <span className="contact-icon">📞</span>
                                        <span>{mosque.contact_number}</span>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="mosque-stats">
                                    <div className="stat-item active-courses">
                                        <span className="stat-icon">📚</span>
                                        <div>
                                            <div className="stat-value">
                                                {mosque.active_courses_count}
                                            </div>
                                            <div className="stat-label">
                                                Active Courses
                                            </div>
                                        </div>
                                    </div>

                                    <div className="stat-item students">
                                        <span className="stat-icon">👥</span>
                                        <div>
                                            <div className="stat-value">
                                                {mosque.total_students_count}
                                            </div>
                                            <div className="stat-label">
                                                Students
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <div className="view-details-btn">
                                    <span>View Details</span>
                                    <span>→</span>
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

export default PublicMosquesPage;
