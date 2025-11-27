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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Typography } from 'antd';
import StatisticsCards from '../StatisticsCards';
import BarChart from '../BarChart';

const { Title, Text } = Typography;

/**
 * StatisticsView - Displays dashboard statistics and charts with role-based content
 * @param {Object} props
 * @param {Array} props.chartData - Data for the bar chart
 * @param {Object} props.statistics - Statistics data for cards
 * @param {string} props.userRole - User role to customize display
 */
const StatisticsView = ({ chartData, statistics, userRole }) => {
    const { t } = useTranslation();

    // Role-based titles and descriptions
    const getRoleBasedContent = () => {
        if (userRole === 'mosque_admin') {
            return {
                title: t('dashboard.mosqueAdmin.title'),
                subtitle: t('dashboard.mosqueAdmin.subtitle'),
                chartTitle: t('dashboard.mosqueAdmin.chartTitle')
            };
        }

        // Default to ministry admin
        return {
            title: t('dashboard.ministryAdmin.title'),
            subtitle: t('dashboard.ministryAdmin.subtitle'),
            chartTitle: t('dashboard.ministryAdmin.chartTitle')
        };
    };

    const content = getRoleBasedContent();

    return (
        <div className="dashboard-content">
            {/* Header with role-based content */}
            <div className="content-header">
                <Title level={2}>{content.title}</Title>
                <Text type="secondary" style={{ fontSize: '1.1rem' }}>
                    {content.subtitle}
                </Text>
            </div>

            {/* Statistics Cards */}
            <div className="stats-section">
                <StatisticsCards
                    statistics={statistics}
                    userRole={userRole}
                />
            </div>

            {/* Bar Chart with role-based data */}
            <div className="bar-chart-container">
                <Card>
                    <Title level={4} style={{ textAlign: 'center', marginBottom: 32 }}>
                        {content.chartTitle}
                    </Title>
                    <BarChart
                        data={chartData}
                        title={content.chartTitle}
                        height={400}
                    />
                </Card>
            </div>

            {/* Additional insights based on role */}
            {userRole === 'ministry_admin' && chartData.length > 0 && (
                <div className="insights-section">
                    <Card title={t('dashboard.insights')}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <div className="insight-item">
                                    <Text strong>{t('dashboard.topGovernorate')}: </Text>
                                    <Text>
                                        {chartData.reduce((max, item) =>
                                            item.value > max.value ? item : max,
                                            chartData[0]).label}
                                    </Text>
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div className="insight-item">
                                    <Text strong>{t('dashboard.totalGovernorates')}: </Text>
                                    <Text>{chartData.length}</Text>
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div className="insight-item">
                                    <Text strong>{t('dashboard.avgMosquesPerGov')}: </Text>
                                    <Text>
                                        {Math.round(chartData.reduce((sum, item) =>
                                            sum + item.value, 0) / chartData.length)}
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default StatisticsView;
