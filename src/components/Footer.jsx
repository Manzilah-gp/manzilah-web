import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import {
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Footer: AntFooter } = Layout;
const { Text, Link, Title } = Typography;

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <AntFooter style={{
            background: '#2c3e50',
            color: 'white',
            width: '100%',
            padding: '48px 80px',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={8}>
                        <Title level={4} style={{ color: 'white', marginBottom: '16px' }}>
                            Manzilah Ministry
                        </Title>
                        <Text style={{ color: '#bdc3c7', lineHeight: '1.6' }}>
                            {t('footer.description')}
                        </Text>
                    </Col>

                    <Col xs={24} md={4}>
                        <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>
                            {t('footer.quickLinks')}
                        </Title>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Link href="/" style={{ color: '#bdc3c7' }}>{t('header.home')}</Link>
                            <Link href="/about" style={{ color: '#bdc3c7' }}>{t('header.about')}</Link>
                            <Link href="/courses" style={{ color: '#bdc3c7' }}>{t('header.courses')}</Link>
                            <Link href="/mosques" style={{ color: '#bdc3c7' }}>{t('header.mosques')}</Link>
                        </Space>
                    </Col>

                    <Col xs={24} md={6}>
                        <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>
                            {t('footer.contact')}
                        </Title>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text style={{ color: '#bdc3c7' }}>Email: info@manzilah.org</Text>
                            <Text style={{ color: '#bdc3c7' }}>Phone: +970 123 456 789</Text>
                            <Text style={{ color: '#bdc3c7' }}>Address: Palestine</Text>
                        </Space>
                    </Col>

                    <Col xs={24} md={6}>
                        <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>
                            {t('footer.followUs')}
                        </Title>
                        <Space size="middle">
                            <FacebookOutlined style={{ fontSize: '20px', color: '#bdc3c7', cursor: 'pointer' }} />
                            <TwitterOutlined style={{ fontSize: '20px', color: '#bdc3c7', cursor: 'pointer' }} />
                            <InstagramOutlined style={{ fontSize: '20px', color: '#bdc3c7', cursor: 'pointer' }} />
                        </Space>
                    </Col>
                </Row>

                <div style={{
                    borderTop: '1px solid #34495e',
                    marginTop: '32px',
                    paddingTop: '24px',
                    textAlign: 'center'
                }}>
                    <Text style={{ color: '#bdc3c7' }}>
                        &copy; {currentYear} Manzilah Ministry. {t('footer.rights')}
                    </Text>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;