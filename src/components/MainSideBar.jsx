import React from 'react';
import { Card, Menu } from 'antd';
import {
    BarChartOutlined,
    BankOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    UserOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';


const MainSideBar = ({ activeItem, onItemClick }) => {
    const { t } = useTranslation();
    const { user, hasRole, hasAnyRole } = useAuth();

    // Define menu items with role permissions
    const getMenuItems = () => {
        const baseItems = [
            {
                key: 'statistics',
                icon: <BarChartOutlined />,
                label: t('sidebar.statistics'),
                roles: ['student', 'mosque_admin', 'ministry_admin', 'parent', 'teacher'] // All roles can see statistics
            }
        ];

        const adminItems = [
            {
                key: 'include-mosque',
                icon: <BankOutlined />,
                label: t('sidebar.includeMosque'),
                roles: ['admin']
            },
            {
                key: 'approve-events',
                icon: <CheckCircleOutlined />,
                label: t('sidebar.approveEvents'),
                roles: ['admin']
            },
            {
                key: 'user-management',
                icon: <UserOutlined />,
                label: t('sidebar.userManagement'),
                roles: ['admin']
            },
            {
                key: 'system-settings',
                icon: <SettingOutlined />,
                label: t('sidebar.systemSettings'),
                roles: ['admin']
            }
        ];

        // Combine and filter items based on user role
        const allItems = [...baseItems, ...adminItems];
        // Filter items based on user role-- use later
        // return allItems.filter(item => item.roles.includes(user.role));
        return allItems;
    };

    const menuItems = getMenuItems();

    return (
        <Card
            style={{
                height: 'fit-content',
                minHeight: '500px'
            }}
            styles={{ body: { padding: 0 } }}
        >
            {/* Sidebar Header with User Info */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                padding: '16px',
                textAlign: 'center'
            }}>
                <h3 style={{
                    margin: 0,
                    color: 'white',
                    fontSize: '16px',
                    marginBottom: '4px'
                }}>
                    {t('sidebar.dashboard')}
                </h3>
                <p style={{
                    margin: 0,
                    fontSize: '12px',
                    opacity: 0.8
                }}>
                    {t('sidebar.role')}: {user?.role || 'N/A'}
                </p>
            </div>

            {/* Navigation Menu */}
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

export default MainSideBar;