import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getPublicMosques } from '../../../api/publicBrowsing';
import './PublicMosquesPage.css';
import { getGovernorates } from '../../../util/getGovernates';

const PublicMosquesPage = () => {
    const [mosques, setMosques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        governorate: 'all',
        search: ''
    });
    const navigate = useNavigate();
    useEffect(() => {
        fetchMosques();
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
                            />
                        </div>

                        {/* Governorate Filter */}
                        <select
                            value={filters.governorate}
                            onChange={(e) => setFilters({ ...filters, governorate: e.target.value })}
                            className="filter-select"
                        >
                            {governorates.map(gov => (
                                <option key={gov.value} value={gov.value}>
                                    {gov.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <p className="results-count">
                    {loading ? 'Loading...' : `Found ${mosques.length} centers`}
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

/**
 * 
 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    SearchOutlined, 
    EnvironmentOutlined, 
    BookOutlined, 
    TeamOutlined,
    PhoneOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';

// This would be your API call - replace with actual import
const getPublicMosques = async (filters) => {
    // Mock data for demonstration
    return {
        data: {
            success: true,
            data: [
                {
                    id: 1,
                    name: "Al-Aqsa Mosque",
                    governorate: "nablus",
                    region: "Old City",
                    address: "Old City Street, Nablus",
                    contact_number: "09-234-5678",
                    active_courses_count: 15,
                    total_students_count: 120
                },
                {
                    id: 2,
                    name: "Omar Mosque",
                    governorate: "ramallah",
                    region: "City Center",
                    address: "Main Street, Ramallah",
                    contact_number: "02-298-7654",
                    active_courses_count: 8,
                    total_students_count: 80
                }
            ]
        }
    };
};

const PublicMosquesPage = () => {
    const navigate = useNavigate();
    const [mosques, setMosques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        governorate: 'all',
        search: ''
    });

    useEffect(() => {
        fetchMosques();
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

    const handleMosqueClick = (mosqueId) => {
        navigate(`/mosques/${mosqueId}`);
    };

    const governorates = [
        { value: 'all', label: 'All Governorates' },
        { value: 'nablus', label: 'Nablus' },
        { value: 'ramallah', label: 'Ramallah' },
        { value: 'hebron', label: 'Hebron' },
        { value: 'jerusalem', label: 'Jerusalem' },
        { value: 'bethlehem', label: 'Bethlehem' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
               
                <div style={{
                    textAlign: 'center',
                    color: 'white',
                    marginBottom: '40px'
                }}>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        Browse Quran Centers
                    </h1>
                    <p style={{ fontSize: '20px', opacity: 0.9 }}>
                        Find the perfect center for your Quranic education journey
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '32px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <SearchOutlined style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '18px'
                            }} />
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <select
                            value={filters.governorate}
                            onChange={(e) => setFilters({ ...filters, governorate: e.target.value })}
                            style={{
                                padding: '14px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '16px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            {governorates.map(gov => (
                                <option key={gov.value} value={gov.value}>
                                    {gov.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <p style={{
                    color: 'white',
                    fontSize: '18px',
                    marginBottom: '24px',
                    opacity: 0.9
                }}>
                    {loading ? 'Loading...' : `Found ${mosques.length} centers`}
                </p>

                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        color: 'white',
                        padding: '60px',
                        fontSize: '18px'
                    }}>
                        Loading centers...
                    </div>
                ) : mosques.length === 0 ? (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '60px',
                        textAlign: 'center'
                    }}>
                        <EnvironmentOutlined style={{ fontSize: '64px', color: '#d1d5db', marginBottom: '16px' }} />
                        <h3 style={{ color: '#374151', marginBottom: '8px' }}>No centers found</h3>
                        <p style={{ color: '#6b7280' }}>Try adjusting your search filters</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '24px'
                    }}>
                        {mosques.map(mosque => (
                            <div
                                key={mosque.id}
                                onClick={() => handleMosqueClick(mosque.id)}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    padding: '28px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    border: '2px solid transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                                    e.currentTarget.style.borderColor = '#667eea';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}
                            >
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <span style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '24px'
                                    }}>
                                        🕌
                                    </span>
                                    {mosque.name}
                                </h3>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '12px',
                                    color: '#6b7280',
                                    marginBottom: '12px'
                                }}>
                                    <EnvironmentOutlined style={{ fontSize: '18px', marginTop: '2px' }} />
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '500' }}>
                                            {mosque.region}, {mosque.governorate.charAt(0).toUpperCase() + mosque.governorate.slice(1)}
                                        </p>
                                        {mosque.address && (
                                            <p style={{ margin: 0, fontSize: '14px' }}>{mosque.address}</p>
                                        )}
                                    </div>
                                </div>

                                {mosque.contact_number && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#6b7280',
                                        marginBottom: '20px'
                                    }}>
                                        <PhoneOutlined style={{ fontSize: '18px' }} />
                                        <span>{mosque.contact_number}</span>
                                    </div>
                                )}

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                    marginBottom: '20px',
                                    paddingTop: '20px',
                                    borderTop: '1px solid #e5e7eb'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#667eea'
                                    }}>
                                        <BookOutlined style={{ fontSize: '20px' }} />
                                        <div>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                                {mosque.active_courses_count}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                Active Courses
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#764ba2'
                                    }}>
                                        <TeamOutlined style={{ fontSize: '20px' }} />
                                        <div>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                                {mosque.total_students_count}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                Students
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    color: '#667eea',
                                    fontWeight: '600',
                                    fontSize: '16px'
                                }}>
                                    <span>View Details</span>
                                    <ArrowRightOutlined />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicMosquesPage;

 */