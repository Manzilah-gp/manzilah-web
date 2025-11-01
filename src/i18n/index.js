import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            // Header
            'header.home': 'Home',
            'header.about': 'About Us',
            'header.courses': 'Courses',
            'header.mosques': 'Mosques',
            'header.registration': 'Registration',
            'header.login': 'Login',
            'header.logout': 'Logout',

            // Sidebar
            'sidebar.adminPanel': 'Admin Panel',
            'sidebar.statistics': 'Statistics',
            'sidebar.includeMosque': 'Include Mosque',
            'sidebar.approveEvents': 'Approve Events',
            'sidebar.recentUpdates': 'Recent Updates',

            // Dashboard
            'dashboard.title': 'Dashboard Overview',
            'dashboard.subtitle': 'Comprehensive view of ministry statistics and activities',
            'dashboard.mosques': 'Total Mosques',
            'dashboard.students': 'Total Students',
            'dashboard.supervisors': 'Supervisors',
            'dashboard.courses': 'Active Courses',
            'dashboard.chartTitle': 'Mosques Distribution by City in Palestine',

            // Footer
            'footer.description': 'Building a better future through education and community development',
            'footer.quickLinks': 'Quick Links',
            'footer.contact': 'Contact Info',
            'footer.followUs': 'Follow Us',
            'footer.rights': 'All rights reserved',

            // Common
            'common.loading': 'Loading...',
            'common.welcome': 'Welcome',
        }
    },
    ar: {
        translation: {
            // Header
            'header.home': 'الرئيسية',
            'header.about': 'من نحن',
            'header.courses': 'الدورات',
            'header.mosques': 'المساجد',
            'header.registration': 'التسجيل',
            'header.login': 'تسجيل الدخول',
            'header.logout': 'تسجيل الخروج',

            // Sidebar
            'sidebar.adminPanel': 'لوحة التحكم',
            'sidebar.statistics': 'الإحصائيات',
            'sidebar.includeMosque': 'إضافة مسجد',
            'sidebar.approveEvents': 'الموافقة على الفعاليات',
            'sidebar.recentUpdates': 'التحديثات الأخيرة',

            // Dashboard
            'dashboard.title': 'نظرة عامة على لوحة التحكم',
            'dashboard.subtitle': 'عرض شامل لإحصائيات وأنشطة الوزارة',
            'dashboard.mosques': 'إجمالي المساجد',
            'dashboard.students': 'إجمالي الطلاب',
            'dashboard.supervisors': 'المشرفين',
            'dashboard.courses': 'الدورات النشطة',
            'dashboard.chartTitle': 'توزيع المساجد حسب المدن في فلسطين',

            // Footer
            'footer.description': 'بناء مستقبل أفضل من خلال التعليم وتنمية المجتمع',
            'footer.quickLinks': 'روابط سريعة',
            'footer.contact': 'معلومات الاتصال',
            'footer.followUs': 'تابعنا',
            'footer.rights': 'جميع الحقوق محفوظة',

            // Common
            'common.loading': 'جاري التحميل...',
            'common.welcome': 'مرحبا',
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
    });

export default i18n;