import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

/**
 * SystemSettingsView - System configuration for admin users
 */
const SystemSettingsView = () => {
    const { t } = useTranslation();

    return (
        <Card style={{ minHeight: '400px' }}>
            <h2 style={{ fontSize: '24px' }}>{t('sidebar.systemSettings')}</h2>
            <p>System configuration settings will appear here.</p>
            {/* System settings components would go here */}
        </Card>
    );
};

export default SystemSettingsView;