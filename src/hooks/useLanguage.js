import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setCurrentLanguage(lng);

        // Update document direction for RTL/LTR
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
    };

    const toggleLanguage = () => {
        const newLang = currentLanguage === 'en' ? 'ar' : 'en';
        changeLanguage(newLang);
    };

    return {
        currentLanguage,
        changeLanguage,
        toggleLanguage,
        isRTL: currentLanguage === 'ar'
    };
};