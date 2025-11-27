// import React, { useState, useEffect } from 'react';
// import { Layout } from 'antd';
// import { useTranslation } from 'react-i18next';
// import useAuth from '../../hooks/useAuth';
// import StatisticsView from '../../components/Dashboard/Ministry/Statistics';
// import './MinistryDashboard.css';

// const { Content, Sider } = Layout;

// /**
//  * MinistryDashboard - Main dashboard component with role-based access
//  * Handles responsive layout and dynamic content based on user role
//  */
// const MinistryDashboard = () => {
//     const { t } = useTranslation();
//     const { user } = useAuth();

//     // State management
//     // const [activeItem, setActiveItem] = useState('statistics');
//     const [chartData, setChartData] = useState([]);
//     const [statistics, setStatistics] = useState({
//         mosques: 0,
//         students: 0,
//         supervisors: 0,
//         courses: 0
//     });
//     const [loading, setLoading] = useState(true);
//     const [collapsed, setCollapsed] = useState(false);
//     const [mobileView, setMobileView] = useState(false);
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//     /**
//      * Fetch dashboard data on component mount
//      * In a real app, this would call your API
//      */
//     useEffect(() => {
//         fetchDashboardData();
//         checkMobileView();
//         window.addEventListener('resize', checkMobileView);

//         return () => {
//             window.removeEventListener('resize', checkMobileView);
//         };
//     }, []);

//     /**
//      * Check if we're in mobile view based on window width
//      */
//     const checkMobileView = () => {
//         setMobileView(window.innerWidth <= 768);
//         if (window.innerWidth <= 768) {
//             setCollapsed(true);
//         }
//     };

//     /**
//      * Mock data fetch - replace with actual API calls
//      */
//     const fetchDashboardData = async () => {
//         try {
//             setLoading(true);

//             // Mock data - replace with API calls
//             const mockChartData = [
//                 { label: 'Gaza', value: 45 },
//                 { label: 'Ramallah', value: 32 },
//                 { label: 'Hebron', value: 28 },
//                 { label: 'Nablus', value: 25 },
//                 { label: 'Jerusalem', value: 22 },
//                 { label: 'Bethlehem', value: 18 },
//                 { label: 'Jenin', value: 15 },
//             ];

//             const mockStatistics = {
//                 mosques: 185,
//                 students: 2540,
//                 supervisors: 120,
//                 courses: 45
//             };

//             setChartData(mockChartData);
//             setStatistics(mockStatistics);
//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /**
//      * Render the active content based on selected sidebar item
//      */
//     /*
//     const renderActiveContent = () => {
//         // Show loading state
//         if (loading) {
//             return (
//                 <div className="dashboard-loading">
//                     <div className="loading-spinner"></div>
//                     <div>{t('common.loading')}</div>
//                 </div>
//             );
//         }

//         // Route to appropriate view component
//         switch (activeItem) {
//             case 'statistics':
//                 return <StatisticsView chartData={chartData} statistics={statistics} />;

//             case 'add-mosque':
//                 return <AddMosqueView />;

//             case 'mosque-list':
//                 return <MosqueListView />;



//             default:
//         return <StatisticsView chartData={chartData} statistics={statistics} />;
//         }
//     };
// */
//     return (
//         // <Layout className="dashboard-layout">
//         //     <Header
//         //         onMenuToggle={() => setCollapsed(!collapsed)}
//         //         showMobileMenu={mobileView}
//         //     />

//         //     <Layout className="site-layout">

//         //         <MainSideBar
//         //             // activeItem={activeItem}
//         //             // onItemClick={setActiveItem}
//         //             collapsed={sidebarCollapsed}
//         //             onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
//         //         />


//         //         {/* Main Content Area */}
//         //         <Layout className="main-content-wrapper">
//         //             <Content className="dashboard-main-content">
//         //                 <div className="content-scroll-wrapper">
//         //                     {renderActiveContent()}
//         //                 </div>
//         //             </Content>
//         //         </Layout>
//         //     </Layout>

//         //     <Footer />
//         // </Layout>
//         <StatisticsView chartData={chartData} statistics={statistics} />

//     );
// };

// export default MinistryDashboard;


import React, { useState, useEffect } from 'react';
import { Layout, Spin, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import StatisticsView from '../../components/Dashboard/Ministry/Statistics';
import { getMinistryStatistics, getMosqueStatistics, getGovernorateStats } from '../../api/dashboardApi';
import { getMosqueCountByGovernorate } from '../../api/mosque';
import './MinistryDashboard.css';

const { Content } = Layout;

/**
 * MinistryDashboard - Main dashboard component with role-based access
 * Fetches real data from database based on user role
 */
const MinistryDashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    // State management
    const [chartData, setChartData] = useState([]);
    const [statistics, setStatistics] = useState({
        mosques: 0,
        students: 0,
        supervisors: 0,
        courses: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch dashboard data based on user role
     */
    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    /**
     * Fetch real data from API based on user role
     */
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (user?.role === 'ministry_admin') {
                await fetchMinistryData();
            } else if (user?.role === 'mosque_admin') {
                await fetchMosqueData();
            } else {
                // Default to ministry data or handle other roles
                await fetchMinistryData();
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(t('dashboard.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch ministry-level statistics (governorate-wise)
     */
    const fetchMinistryData = async () => {
        try {
            // Fetch overall statistics
            const statsResponse = await getMinistryStatistics();
            const statsData = statsResponse.data;

            // Fetch governorate distribution for chart
            const chartResponse = await getMosqueCountByGovernorate();
            const chartData = chartResponse.data;

            setStatistics({
                mosques: statsData.totalMosques || 0,
                students: statsData.totalStudents || 0,
                supervisors: statsData.totalSupervisors || 0,
                courses: statsData.totalCourses || 0
            });

            // Transform chart data for the bar chart component
            const transformedChartData = chartData.map(item => ({
                label: item.governorate,
                value: item.mosqueCount,
                // Additional data that might be useful
                governorate: item.governorate,
                count: item.mosqueCount
            }));

            setChartData(transformedChartData);
        } catch (error) {
            console.error('Error fetching ministry data:', error);
            throw error;
        }
    };

    /**
     * Fetch mosque-level statistics (for mosque admin)
     * This would show statistics specific to the admin's mosque
     */
    const fetchMosqueData = async () => {
        try {
            // For mosque admin, we need to get their mosque ID
            // This could come from user context or JWT token
            const userMosqueId = user?.mosqueId; // Assuming this is available in user context

            if (!userMosqueId) {
                throw new Error('Mosque ID not found for mosque admin');
            }

            const response = await getMosqueStatistics(userMosqueId);
            const mosqueData = response.data;

            setStatistics({
                mosques: 1, // Mosque admin only manages one mosque
                students: mosqueData.studentCount || 0,
                supervisors: mosqueData.supervisorCount || 0,
                courses: mosqueData.courseCount || 0
            });

            // For mosque admin, chart could show course enrollment or attendance trends
            setChartData(mosqueData.chartData || []);
        } catch (error) {
            console.error('Error fetching mosque data:', error);
            throw error;
        }
    };

    /**
     * Render loading state
     */
    const renderLoading = () => (
        <div className="dashboard-loading">
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>{t('common.loading')}</div>
        </div>
    );

    /**
     * Render error state
     */
    const renderError = () => (
        <Alert
            message={t('dashboard.errorTitle')}
            description={error}
            type="error"
            showIcon
            action={
                <button
                    onClick={fetchDashboardData}
                    className="ant-btn ant-btn-primary ant-btn-sm"
                >
                    {t('common.retry')}
                </button>
            }
        />
    );

    return (
        <Layout className="dashboard-layout">
            <Content className="dashboard-main-content">
                <div className="content-scroll-wrapper">
                    {loading && renderLoading()}
                    {error && !loading && renderError()}
                    {!loading && !error && (
                        <StatisticsView
                            chartData={chartData}
                            statistics={statistics}
                            userRole={user?.role}
                        />
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default MinistryDashboard;

