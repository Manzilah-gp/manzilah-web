import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

/**
 * UserManagementView - User management interface for admin users
 */
const UserManagementView = () => {
    const { t } = useTranslation();

    return (
        <Card style={{ minHeight: '400px' }}>
            <h2 style={{ fontSize: '24px' }}>{t('sidebar.userManagement')}</h2>
            <p>User management interface will appear here.</p>
            {/* User management components would go here */}
        </Card>
    );
};

export default UserManagementView;