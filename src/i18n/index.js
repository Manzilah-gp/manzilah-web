import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            // Header
            'header.profile': 'Profile',
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
            'sidebar.userManagement': 'User Management',
            'sidebar.systemSettings': 'System Settings',
            'sidebar.dashboard': 'Dashboard',

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
            'common.submit': 'Submit',
            'common.next': 'Next',
            'common.previous': 'Previous',

            // login | register 
            'auth.createAccount': 'Create Account',
            'auth.signIn': 'Sign In',
            'auth.orSignUpWith': 'or sign up with',
            'auth.fullName': 'Full Name ',
            'auth.email': 'E-mail',
            'auth.password': 'Password ',
            'auth.phone': 'Phone Number',
            'auth.selectGender': ' Select Gender',
            'auth.female': 'female',
            'auth.male': 'male',
            'auth.dateOfBirth': 'Date of Birth',
            'auth.forgotPassword': 'Forgot Password?',
            'auth.teacherRegister': 'Or Register as Teacher?',
            //location info
            'auth.city': 'City',
            'auth.region': 'Region/State',
            'auth.postalCode': 'Postal Code',
            'auth.addressLine1': 'Address Line 1',
            'auth.addressLine2': 'Address Line 2',
            'auth.locationInfo': 'Location Information',
            'auth.searchLocation': 'Search Location',
            'auth.enterLocation': 'Enter your location',
            'auth.locationHelp': 'Start typing to see location suggestions',
            'auth.locationSuggestion': 'Location helps us suggest nearby mosques and courses',
            // Teacher Registration
            'teacher.registration': 'Teacher Registration',
            'teacher.newRegistration': 'New Teacher Registration',
            'teacher.personalInfo': 'Personal Information',
            'teacher.qualifications': 'Qualifications & Certificates',
            'teacher.preferences': 'Expertise & Preferences',
            'teacher.courseExpertise': 'Course Types You Can Teach',
            'teacher.maxLevel': 'Maximum Teaching Level for Memorization',
            'teacher.teachingStyle': 'Preferred Teaching Style',
            'teacher.agePreference': 'Preferred Student Age Group',
            'teacher.hourlyRate': 'Hourly Rate (Shekel)',
            'teacher.preferredMosques': 'Preferred Mosques',
            'teacher.teachingFormat': 'Preferred Teaching Format',
            'teacher.availability': 'Availability Schedule',
            'teacher.selectAtLeastOne': 'Please select at least one course type',
            'teacher.selectMaxLevel': 'Please select maximum level',
            'teacher.selectMosque': 'Please select at least one mosque',
            'teacher.selectFormat': 'Please select teaching format',
            'teacher.selectDaysandTimes': ' Select preferred days and times for teaching',
            'teacher.joinUs': 'Join our team of exceptional teachers and help build an informed and educated generation',
            // Course types
            'course.memorization': 'Quran Memorization (Hifz)',
            'course.tajweed': 'Tajweed',
            'course.feqh': 'Islamic Jurisprudence (Feqh)',
            // Teaching formats
            'format.online': 'Online Only',
            'format.onsite': 'In-Person Only',
            'format.hybrid': 'Mixed (Online & In-Person)',
            // Age preferences
            'age.children': 'Children (6-12 years)',
            'age.teens': 'Teens (13-18 years)',
            'age.adults': 'Adults (18+ years)',
            'age.all': 'All Ages',
            // Days of week
            'day.sunday': 'Sunday',
            'day.monday': 'Monday',
            'day.tuesday': 'Tuesday',
            'day.wednesday': 'Wednesday',
            'day.thursday': 'Thursday',
            'day.friday': 'Friday',
            'day.saturday': 'Saturday',
            'time.start': 'Start Time',
            'time.end': 'End Time',

            // memorization levels
            'level.level1': 'First 5 Juz',
            'level.level2': 'Second 5 Juz',
            'level.level3': 'Third 5 Juz',
            'level.level4': 'Fourth 5 Juz',
            'level.level5': 'Fifth 5 Juz',
            'level.level6': 'Sixth 5 Juz',
            'juz.juz1': 'Juz 1-5',
            'juz.juz2': 'Juz 6-10',
            'juz.juz3': 'Juz 11-15',
            'juz.juz4': 'Juz 16-20',
            'juz.juz5': 'Juz 21-25',
            'juz.juz6': 'Juz 26-30',




        }
    },
    ar: {
        translation: {
            // Header
            'header.profile': 'الملف الشخصي',
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
            'sidebar.userManagement': 'إدارة المستخدمين',
            'sidebar.systemSettings': 'إعدادات النظام',
            'sidebar.dashboard': ' لوحة التحكم',

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
            'common.submit': 'إرسال',
            'common.next': 'التالي',
            'common.previous': 'السابق',
            // login | register 
            'auth.createAccount': 'إنشاء حساب',
            'auth.signIn': 'تسجيل الدخول',
            'auth.orSignUpWith': 'أو سجل باستخدام',
            'auth.fullName': 'الاسم الكامل',
            'auth.email': 'البريد الإلكتروني',
            'auth.password': 'كلمة المرور',
            'auth.phone': 'رقم الهاتف',
            'auth.selectGender': 'اختر الجنس',
            'auth.female': 'أنثى',
            'auth.male': 'ذكر',
            'auth.dateOfBirth': 'تاريخ الميلاد',
            'auth.forgotPassword': 'هل نسيت كلمة المرور؟',
            'auth.teacherRegister': 'أو سجل كمعلم؟',

            //location info
            'auth.city': 'المدينة',
            'auth.region': 'المنطقة/المحافظة',
            'auth.postalCode': 'الرمز البريدي',
            'auth.addressLine1': 'العنوان 1',
            'auth.addressLine2': 'العنوان 2',
            'auth.locationInfo': 'معلومات الموقع',
            'auth.searchLocation': 'ابحث عن الموقع',
            'auth.enterLocation': 'أدخل موقعك',
            'auth.locationHelp': 'ابدأ الكتابة لرؤية اقتراحات المواقع',
            'auth.locationSuggestion': 'الموقع يساعدنا في اقتراح المساجد والدورات القريبة',

            // Teacher Registration
            'teacher.registration': 'تسجيل معلم',
            'teacher.newRegistration': 'تسجيل معلم جديد',
            'teacher.personalInfo': 'المعلومات الشخصية',
            'teacher.qualifications': 'المؤهلات والشهادات',
            'teacher.preferences': 'التخصص والتفضيلات',
            'teacher.courseExpertise': 'نوع الدورة التي يمكنك تدريسها',
            'teacher.maxLevel': 'أعلى مستوى يمكنك تدريسه في الحفظ',
            'teacher.teachingStyle': 'أسلوب التدريس المفضل',
            'teacher.agePreference': 'الفئة العمرية المفضلة',
            'teacher.hourlyRate': 'السعر بالساعة (شيكل)',
            'teacher.preferredMosques': 'المساجد المفضلة للتدريس فيها',
            'teacher.teachingFormat': 'طريقة التدريس المفضلة',
            'teacher.availability': 'جدول التوفر',
            'teacher.selectAtLeastOne': 'يرجى اختيار نوع دورة واحدة على الأقل',
            'teacher.selectMaxLevel': 'يرجى تحديد أعلى مستوى',
            'teacher.selectMosque': 'يرجى اختيار مسجد واحد على الأقل',
            'teacher.selectFormat': 'يرجى اختيار طريقة التدريس',
            'teacher.availability': 'جدول التوفر',
            'teacher.selectDaysandTimes': ' اختر الأيام والأوقات المناسبة للتدريس',
            'teacher.joinUs': 'انضم إلى فريقنا من المعلمين المتميزين وساعد في بناء جيل واعٍ ومثقف',
            // Course types
            'course.memorization': 'حفظ القرآن (Hifz)',
            'course.tajweed': 'التجويد (Tajweed)',
            'course.feqh': 'الفقه (Feqh)',

            // Teaching formats
            'format.online': 'أونلاين فقط',
            'format.onsite': 'حضوري فقط',
            'format.hybrid': 'مختلط (أونلاين وحضوري)',
            // Age preferences
            'age.children': 'أطفال (6-12 سنة)',
            'age.teens': 'مراهقين (13-18 سنة)',
            'age.adults': 'كبار (18+ سنة)',
            'age.all': 'جميع الأعمار',
            // Days of week
            'day.sunday': 'الأحد',
            'day.monday': 'الإثنين',
            'day.tuesday': 'الثلاثاء',
            'day.wednesday': 'الأربعاء',
            'day.thursday': 'الخميس',
            'day.friday': 'الجمعة',
            'day.saturday': 'السبت',
            'time.start': 'وقت البدء',
            'time.end': 'وقت الانتهاء',
            // memorization levels
            'level.level1': 'الخمس أجزاء الأوىى',
            'level.level2': 'الخمس أجزاء الثانية',
            'level.level3': 'الخمس أجزاء الثالثة',
            'level.level4': 'الخمس أجزاء الرابعة',
            'level.level5': 'الخمس أجزاء الخامسة',
            'level.level6': 'الخمس أجزاء السادسة',
            'juz.juz1': 'الجزء 1-5',
            'juz.juz2': 'الجزء 6-10',
            'juz.juz3': 'الجزء 11-15',
            'juz.juz4': 'الجزء 16-20',
            'juz.juz5': 'الجزء 21-25',
            'juz.juz6': 'الجزء 26-30',

            //buttons
            'button.submit': 'إرسال',
            'button.next': 'التالي',
            'button.previous': 'السابق',



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