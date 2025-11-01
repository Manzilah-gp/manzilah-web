import React from 'react';
import { Card, Menu } from 'antd';
import {
    BarChartOutlined,
    BankOutlined,
    CheckCircleOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const SideList = ({ items, activeItem, onItemClick }) => {
    const { t } = useTranslation();

    const getIcon = (iconName) => {
        const iconMap = {
            '📊': <BarChartOutlined />,
            '🕌': <BankOutlined />,
            '✅': <CheckCircleOutlined />,
            '🔄': <SyncOutlined />,
        };
        return iconMap[iconName] || <BarChartOutlined />;
    };

    const menuItems = items.map(item => ({
        key: item.id,
        icon: getIcon(item.icon),
        label: t(item.translationKey),
    }));


    return (
        <Card
            style={{
                height: 'fit-content',
                minHeight: '500px'
            }}
            bodyStyle={{ padding: 0 }}
        >
            <div style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                padding: '16px',
                textAlign: 'center'
            }}>
                <h3 style={{
                    margin: 0,
                    color: 'white',
                    fontSize: '16px'
                }}>
                    {t('sidebar.adminPanel')}
                </h3>
            </div>
            <Menu
                mode="vertical"
                selectedKeys={[activeItem]}
                items={menuItems}
                onClick={({ key }) => onItemClick(key)}
                style={{ border: 'none' }}
            />
        </Card>
    );
};

export default SideList;