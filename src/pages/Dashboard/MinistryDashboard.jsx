import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Spin, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SideList from '../../components/SideList';
import BarChart from '../../components/BarChart';
import StatisticsCards from '../../components/StatisticsCards';
//import { dashboardAPI } from '../../api/api';
//import './UserDashboard.css';

const { Content, Sider } = Layout;

const ministryDashboard = () => {
    const { t } = useTranslation();

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

    const sideListItems = [
        {
            id: 'statistics',
            translationKey: 'sidebar.statistics',
            icon: '📊'
        },
        {
            id: 'include-mosque',
            translationKey: 'sidebar.includeMosque',
            icon: '🕌'
        },
        {
            id: 'approve-events',
            translationKey: 'sidebar.approveEvents',
            icon: '✅'
        },
        {
            id: 'recent-updates',
            translationKey: 'sidebar.recentUpdates',
            icon: '🔄'
        },
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Mock data
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

    const renderActiveContent = () => {
        switch (activeItem) {
            case 'statistics':
                return (
                    <div style={{ padding: '24px 0' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h1 style={{
                                fontSize: '28px',
                                margin: 0,
                                color: '#1e3c72'
                            }}>
                                {t('dashboard.title')}
                            </h1>
                            <p style={{
                                fontSize: '16px',
                                color: '#666',
                                margin: '8px 0 0 0'
                            }}>
                                {t('dashboard.subtitle')}
                            </p>
                        </div>

                        <StatisticsCards statistics={statistics} />

                        <div style={{ marginTop: '24px' }}>
                            <BarChart
                                data={chartData}
                                title={t('dashboard.chartTitle')}
                            />
                        </div>
                    </div>
                );

            case 'include-mosque':
                return (
                    <Card>
                        <h2>{t('sidebar.includeMosque')}</h2>
                        <p>Form to add new mosques to the system will appear here.</p>
                    </Card>
                );

            case 'approve-events':
                return (
                    <Card>
                        <h2>{t('sidebar.approveEvents')}</h2>
                        <p>Event approval interface will appear here.</p>
                    </Card>
                );

            case 'recent-updates':
                return (
                    <Card>
                        <h2>{t('sidebar.recentUpdates')}</h2>
                        <p>Latest system updates and activities will appear here.</p>
                    </Card>
                );

            default:
                return (
                    <Card>
                        <h2>Welcome to Admin Dashboard</h2>
                        <p>Select an item from the sidebar to get started.</p>
                    </Card>
                );
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large" tip={t('common.loading')} />
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header />

            <Layout>
                {/* Sidebar */}
                <Sider
                    width={280}
                    breakpoint="lg"
                    collapsedWidth="0"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    style={{
                        background: 'white',
                    }}
                    trigger={null}
                >
                    <SideList
                        items={sideListItems}
                        activeItem={activeItem}
                        onItemClick={setActiveItem}
                    />
                </Sider>

                {/* Main Content */}
                <Layout>
                    <Content style={{
                        margin: '24px',
                        background: '#f0f2f5',
                        borderRadius: '8px'
                    }}>
                        <div style={{
                            padding: '24px',
                            background: 'white',
                            borderRadius: '8px',
                            minHeight: 'calc(100vh - 112px)'
                        }}>
                            {renderActiveContent()}
                        </div>
                    </Content>
                </Layout>
            </Layout>

            <Footer />
        </Layout>
    );
};

export default ministryDashboard;