import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
    BankOutlined,
    UserOutlined,
    TeamOutlined,
    BookOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const StatisticsCards = ({ statistics }) => {
    const { t } = useTranslation();

    const cards = [
        {
            title: t('dashboard.mosques'),
            value: statistics.mosques,
            icon: <BankOutlined />,
            color: '#3498db'
        },
        {
            title: t('dashboard.students'),
            value: statistics.students,
            icon: <UserOutlined />,
            color: '#2ecc71'
        },
        {
            title: t('dashboard.supervisors'),
            value: statistics.supervisors,
            icon: <TeamOutlined />,
            color: '#e74c3c'
        },
        {
            title: t('dashboard.courses'),
            value: statistics.courses,
            icon: <BookOutlined />,
            color: '#f39c12'
        }
    ];

    return (
        <Row gutter={[16, 16]}>
            {cards.map((card, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                    <Card>
                        <Statistic
                            title={card.title}
                            value={card.value}
                            prefix={card.icon}
                            valueStyle={{ color: card.color }}
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default StatisticsCards;