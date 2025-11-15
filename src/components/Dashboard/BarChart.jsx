import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';

const BarChart = ({ data, title }) => {
    const { t } = useTranslation();
    const maxValue = Math.max(...data.map(item => item.value));

    return (
        <Card title={title}>
            <Row gutter={[16, 16]} style={{ height: '300px', alignItems: 'flex-end' }}>
                {data.map((item, index) => (
                    <Col
                        key={index}
                        flex={1}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '8px',
                            fontSize: '12px',
                            fontWeight: '500'
                        }}>
                            {item.label}
                        </div>
                        <div
                            style={{
                                height: `${(item.value / maxValue) * 200}px`,
                                width: '80%',
                                background: `hsl(${index * 40}, 70%, 50%)`,
                                borderRadius: '4px 4px 0 0',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                padding: '4px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.opacity = '0.8';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.opacity = '1';
                            }}
                        >
                            {item.value}
                        </div>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default BarChart;