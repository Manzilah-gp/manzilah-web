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
            color: '#3498db',
            precision: 0
        },
        {
            title: t('dashboard.students'),
            value: statistics.students,
            icon: <UserOutlined />,
            color: '#2ecc71',
            precision: 0
        },
        {
            title: t('dashboard.supervisors'),
            value: statistics.supervisors,
            icon: <TeamOutlined />,
            color: '#e74c3c',
            precision: 0
        },
        {
            title: t('dashboard.courses'),
            value: statistics.courses,
            icon: <BookOutlined />,
            color: '#f39c12',
            precision: 0
        }
    ];

    return (
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
            {cards.map((card, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                    <Card
                        hoverable
                        style={{
                            height: '120px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        styles={{
                            bodyStyle: {
                                width: '100%',
                                padding: '20px'
                            }
                        }}
                    >
                        <Statistic
                            title={
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    {card.title}
                                </span>
                            }
                            value={card.value}
                            prefix={card.icon}
                            valueStyle={{
                                color: card.color,
                                fontSize: '28px',
                                fontWeight: 'bold'
                            }}
                            style={{ width: '100%' }}
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default StatisticsCards;