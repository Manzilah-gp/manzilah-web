import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { useLanguage } from '../hooks/useLanguage';
import arEG from 'antd/locale/ar_EG';
import enUS from 'antd/locale/en_US';

const AntdConfigProvider = ({ children }) => {
    const { currentLanguage, isRTL } = useLanguage();

    const antdLocale = currentLanguage === 'ar' ? arEG : enUS;

    return (
        <ConfigProvider
            locale={antdLocale}
            direction={isRTL ? 'rtl' : 'ltr'}
            theme={{
                token: {
                    colorPrimary: '#1e3c72',
                    borderRadius: 8,
                    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                },
                algorithm: theme.defaultAlgorithm,
            }}
        >
            {children}
        </ConfigProvider>
    );
};

export default AntdConfigProvider;