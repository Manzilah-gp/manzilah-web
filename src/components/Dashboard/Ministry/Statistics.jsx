import React from 'react';
import { useTranslation } from 'react-i18next';
import StatisticsCards from '../StatisticsCards';
import BarChart from '../BarChart';

/**
 * StatisticsView - Displays dashboard statistics and charts
 * @param {Object} props
 * @param {Array} props.chartData - Data for the bar chart
 * @param {Object} props.statistics - Statistics data for cards
 */
const StatisticsView = ({ chartData, statistics }) => {
    const { t } = useTranslation();

    return (
        <div className="dashboard-content">
            <div className="content-header">
                <h2>{t('dashboard.title')}</h2>
                <p>{t('dashboard.subtitle')}</p>
            </div>

            <StatisticsCards statistics={statistics} />

            <div className="bar-chart-container">
                <BarChart
                    data={chartData}
                    title={t('dashboard.chartTitle')}
                />
            </div>
        </div>
    );
};

export default StatisticsView;