import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MainSideBar from '../../components/MainSideBar/MainSideBar';
import StatisticsView from '../../components/Dashboard/Ministry/Statistics';
import IncludeMosqueView from '../../components/Dashboard/Ministry/IncludeMosque';
import ApproveEventsView from '../../components/Dashboard/Ministry/ApproveEvents';
import UserManagementView from '../../components/View/UserManagementView';
import SystemSettingsView from '../../components/View/SystemSettingsView';
import AddMosqueView from './AddMosque/AddMosqueView';
import MosqueListView from './MosqueList/MosqueListView';
import './MinistryDashboard.css';

const { Content, Sider } = Layout;

/**
 * MinistryDashboard - Main dashboard component with role-based access
 * Handles responsive layout and dynamic content based on user role
 */
const MinistryDashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    // State management
    const [activeItem, setActiveItem] = useState('statistics');
    const [chartData, setChartData] = useState([]);
    const [statistics, setStatistics] = useState({
        mosques: 0,
        students: 0,
        supervisors: 0,
        courses: 0
    });
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileView, setMobileView] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    /**
     * Fetch dashboard data on component mount
     * In a real app, this would call your API
     */
    useEffect(() => {
        fetchDashboardData();
        checkMobileView();
        window.addEventListener('resize', checkMobileView);

        return () => {
            window.removeEventListener('resize', checkMobileView);
        };
    }, []);

    /**
     * Check if we're in mobile view based on window width
     */
    const checkMobileView = () => {
        setMobileView(window.innerWidth <= 768);
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        }
    };

    /**
     * Mock data fetch - replace with actual API calls
     */
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Mock data - replace with API calls
            const mockChartData = [
                { label: 'Gaza', value: 45 },
                { label: 'Ramallah', value: 32 },
                { label: 'Hebron', value: 28 },
                { label: 'Nablus', value: 25 },
                { label: 'Jerusalem', value: 22 },
                { label: 'Bethlehem', value: 18 },
                { label: 'Jenin', value: 15 },
            ];

            const mockStatistics = {
                mosques: 185,
                students: 2540,
                supervisors: 120,
                courses: 45
            };

            setChartData(mockChartData);
            setStatistics(mockStatistics);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Render the active content based on selected sidebar item
     */
    const renderActiveContent = () => {
        // Show loading state
        if (loading) {
            return (
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <div>{t('common.loading')}</div>
                </div>
            );
        }

        // Route to appropriate view component
        switch (activeItem) {
            case 'statistics':
                return <StatisticsView chartData={chartData} statistics={statistics} />;

            case 'add-mosque':
                return <AddMosqueView />;

            case 'mosque-list':
                return <MosqueListView />;



            default:
                return <StatisticsView chartData={chartData} statistics={statistics} />;
        }
    };

    return (
        <Layout className="dashboard-layout">
            <Header
                onMenuToggle={() => setCollapsed(!collapsed)}
                showMobileMenu={mobileView}
            />

            <Layout className="site-layout">

                <MainSideBar
                    activeItem={activeItem}
                    onItemClick={setActiveItem}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />


                {/* Main Content Area */}
                <Layout className="main-content-wrapper">
                    <Content className="dashboard-main-content">
                        <div className="content-scroll-wrapper">
                            {renderActiveContent()}
                        </div>
                    </Content>
                </Layout>
            </Layout>

            <Footer />
        </Layout>
    );
};

export default MinistryDashboard;