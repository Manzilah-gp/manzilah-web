import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

/**
 * IncludeMosqueView - Form for adding new mosques to the system
 * Accessible only to admin users
 */
const IncludeMosqueView = () => {
    const { t } = useTranslation();

    return (
        <Card style={{ minHeight: '400px' }}>
            <h2 style={{ fontSize: '24px' }}>{t('sidebar.includeMosque')}</h2>
            <p>Form to add new mosques to the system will appear here.</p>
            {/* Mosque inclusion form components would go here */}
        </Card>
    );
};

export default IncludeMosqueView;