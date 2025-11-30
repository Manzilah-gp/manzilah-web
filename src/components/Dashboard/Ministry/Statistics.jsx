// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import StatisticsCards from '../StatisticsCards';
// import BarChart from '../BarChart';

// /**
//  * StatisticsView - Displays dashboard statistics and charts
//  * @param {Object} props
//  * @param {Array} props.chartData - Data for the bar chart
//  * @param {Object} props.statistics - Statistics data for cards
//  */
// const StatisticsView = ({ chartData, statistics }) => {
//     const { t } = useTranslation();

//     return (
//         <div className="dashboard-content">
//             <div className="content-header">
//                 <h2>{t('dashboard.title')}</h2>
//                 <p>{t('dashboard.subtitle')}</p>
//             </div>

//             <StatisticsCards statistics={statistics} />

//             <div className="bar-chart-container">
//                 <BarChart
//                     data={chartData}
//                     title={t('dashboard.chartTitle')}
//                 />
//             </div>
//         </div>
//     );
// };

// export default StatisticsView;

// [file name]: Statistics.jsx (UPDATED)
// components/Dashboard/Ministry/Statistics.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Typography, Spin, Alert, Button, Statistic, List } from 'antd';
import {
    BankOutlined,
    TeamOutlined,
    BookOutlined,
    CheckCircleOutlined,
    ReloadOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    getMinistryStatistics,
    getGovernorateStats,
    getMosqueStatistics,
    getMosqueEnrollmentTrends
} from '../../../api/dashboardApi';
import useAuth from '../../../hooks/useAuth';
import BarChart from '../BarChart';
import './Statistics.css';

const { Title, Text } = Typography;

/**
 * StatisticsView - Role-based dashboard with real data from backend
 * Shows different statistics based on user role (ministry_admin vs mosque_admin)
 */
const StatisticsView = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    // State management
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statistics, setStatistics] = useState({
        mosques: 0,
        students: 0,
        teachers: 0,
        courses: 0,
        activeEnrollments: 0
    });
    const [chartData, setChartData] = useState([]);
    const [additionalData, setAdditionalData] = useState({});

    /**
     * Fetch dashboard data on component mount
     */

    useEffect(() => {
        console.log("User object:", user);
        console.log("User roles:", user?.roles);
        console.log("User role:", user?.role);

        if (user && user.roles) {
            fetchDashboardData();
        }
    }, [user?.roles]);

    /**
     * Main data fetching function - calls appropriate API based on role
     */
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (user?.roles?.includes('ministry_admin')) {
                await fetchMinistryData();
                console.log("fetching Ministry admin statistics");

            } else if (user?.roles?.includes('mosque_admin')) {
                await fetchMosqueAdminData();
                console.log("fetching Mosque admin statistics");
            } else {
                // For other roles, show basic info
                setStatistics({
                    mosques: 0,
                    students: 0,
                    teachers: 0,
                    courses: 0
                });
            }

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch ministry-level statistics
     */
    const fetchMinistryData = async () => {
        try {
            // Fetch both statistics and chart data in parallel
            const [statsResponse, chartResponse] = await Promise.all([
                getMinistryStatistics(),
                getGovernorateStats()
            ]);

            const statsData = statsResponse.data.data;
            const chartData = chartResponse.data.data;

            // Set statistics for cards
            setStatistics({
                mosques: statsData.totalMosques || 0,
                students: statsData.totalStudents || 0,
                teachers: statsData.totalTeachers || 0,
                courses: statsData.totalCourses || 0,
                activeEnrollments: statsData.activeEnrollments || 0
            });

            // Set chart data for governorate distribution
            setChartData(chartData || []);

            // Set additional data like recent mosques
            setAdditionalData({
                recentMosques: statsData.recentMosques || []
            });

        } catch (error) {
            console.error('Error in fetchMinistryData:', error);
            throw error;
        }
    };

    /**
     * Fetch mosque admin statistics
     */
    const fetchMosqueAdminData = async () => {
        try {
            // Fetch mosque-specific data
            const [statsResponse, chartResponse] = await Promise.all([
                getMosqueStatistics(),
                getMosqueEnrollmentTrends()
            ]);

            const statsData = statsResponse.data.data;
            const chartData = chartResponse.data.data;

            // Set statistics for cards
            setStatistics({
                mosques: 1, // Mosque admin manages only one mosque
                students: statsData.studentCount || 0,
                teachers: statsData.teacherCount || 0,
                courses: statsData.courseCount || 0,
                activeEnrollments: statsData.activeEnrollments || 0
            });

            // Set chart data for enrollment trends
            setChartData(chartData || []);

            // Set additional mosque-specific data
            setAdditionalData({
                mosqueDetails: statsData.mosqueDetails || {},
                recentEnrollments: statsData.recentEnrollments || [],
                courseList: statsData.courseList || []
            });

        } catch (error) {
            console.error('Error in fetchMosqueAdminData:', error);
            throw error;
        }
    };

    /**
     * Get role-based content (titles, descriptions)
     */
    const getRoleBasedContent = () => {
        if (user?.roles?.includes('ministry_admin')) {
            return {
                title: 'Ministry Dashboard',
                subtitle: 'Overview of all mosques and activities across the system',
                chartTitle: 'Mosque Distribution by Governorate'
            };
        } else if (user?.roles?.includes('mosque_admin')) {
            return {
                title: 'Mosque Dashboard',
                subtitle: `Manage and monitor ${additionalData.mosqueDetails?.name || 'your mosque'}`,
                chartTitle: 'Course Enrollment Overview'
            };
        } else {
            return {
                title: 'Dashboard',
                subtitle: 'Your personal overview',
                chartTitle: 'Statistics'
            };
        }
    };

    const content = getRoleBasedContent();

    /**
     * Render statistics cards based on role
     */
    const renderStatisticsCards = () => {
        const cardConfigs = [
            {
                key: 'mosques',
                title: user?.roles?.includes('mosque_admin') ? 'My Mosque' : 'Total Mosques',
                value: statistics.mosques,
                icon: <BankOutlined />,
                color: '#1890ff',
                show: true
            },
            {
                key: 'students',
                title: 'Students',
                value: statistics.students,
                icon: <UserOutlined />,
                color: '#52c41a',
                show: true
            },
            {
                key: 'teachers',
                title: 'Teachers',
                value: statistics.teachers,
                icon: <TeamOutlined />,
                color: '#722ed1',
                show: true
            },
            {
                key: 'courses',
                title: 'Courses',
                value: statistics.courses,
                icon: <BookOutlined />,
                color: '#fa8c16',
                show: true
            },
            {
                key: 'enrollments',
                title: 'Active Enrollments',
                value: statistics.activeEnrollments,
                icon: <CheckCircleOutlined />,
                color: '#13c2c2',
                show: statistics.activeEnrollments !== undefined
            }
        ];

        return (
            <Row gutter={[16, 16]}>
                {cardConfigs.filter(config => config.show).map(config => (
                    <Col xs={24} sm={12} md={8} lg={6} key={config.key}>
                        <Card className="stat-card" hoverable>
                            <Statistic
                                title={config.title}
                                value={config.value}
                                prefix={
                                    <span style={{ color: config.color, fontSize: '24px' }}>
                                        {config.icon}
                                    </span>
                                }
                                valueStyle={{ color: config.color }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    /**
     * Render loading state
     */
    if (loading) {
        return (
            <div className="dashboard-loading">
                <Spin size="large" />
                <Text style={{ marginTop: 16, display: 'block' }}>
                    Loading dashboard data...
                </Text>
            </div>
        );
    }

    /**
     * Render error state
     */
    if (error) {
        return (
            <Alert
                message="Error Loading Dashboard"
                description={error}
                type="error"
                showIcon
                action={
                    <Button
                        size="small"
                        danger
                        onClick={fetchDashboardData}
                        icon={<ReloadOutlined />}
                    >
                        Retry
                    </Button>
                }
            />
        );
    }

    return (
        <div className="statistics-view">
            {/* Header Section */}
            <div className="dashboard-header">
                <div>
                    <Title level={2}>{content.title}</Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                        {content.subtitle}
                    </Text>
                </div>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchDashboardData}
                    loading={loading}
                >
                    Refresh
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="stats-section">
                {renderStatisticsCards()}
            </div>

            {/* Chart Section */}
            {chartData.length > 0 && (
                <div className="chart-section">
                    <Card>
                        <Title level={4} style={{ marginBottom: 24 }}>
                            {content.chartTitle}
                        </Title>
                        <BarChart
                            data={chartData}
                            title={content.chartTitle}
                            height={400}
                        />
                    </Card>
                </div>
            )}

            {/* Ministry Admin - Recent Mosques */}
            {user?.roles?.includes('ministry_admin') && additionalData.recentMosques?.length > 0 && (<div className="additional-section">
                <Card title="Recently Added Mosques">
                    <List
                        dataSource={additionalData.recentMosques}
                        renderItem={(mosque) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<BankOutlined style={{ fontSize: 24 }} />}
                                    title={mosque.name}
                                    description={`${mosque.region || ''}, ${mosque.governorate?.toUpperCase() || ''} - Admin: ${mosque.admin_name || 'Not assigned'}`}
                                />
                                <Text type="secondary">
                                    {new Date(mosque.created_at).toLocaleDateString()}
                                </Text>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
            )}

            {/* Mosque Admin - Mosque Details */}
            {user?.roles?.includes('mosque_admin') && additionalData.mosqueDetails && (
                <div className="additional-section">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Card title="Mosque Information">
                                <p><strong>Name:</strong> {additionalData.mosqueDetails.name}</p>
                                <p><strong>Location:</strong> {additionalData.mosqueDetails.region}, {additionalData.mosqueDetails.governorate?.toUpperCase()}</p>
                                <p><strong>Address:</strong> {additionalData.mosqueDetails.address || 'N/A'}</p>
                                <p><strong>Contact:</strong> {additionalData.mosqueDetails.contact_number || 'N/A'}</p>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title="Recent Enrollments">
                                <List
                                    dataSource={additionalData.recentEnrollments?.slice(0, 5) || []}
                                    renderItem={(enrollment) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={enrollment.student_name}
                                                description={`${enrollment.course_name} (${enrollment.course_type})`}
                                            />
                                            <Text type="secondary">
                                                {new Date(enrollment.enrollment_date).toLocaleDateString()}
                                            </Text>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default StatisticsView;
