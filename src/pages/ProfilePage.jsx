import React, { useEffect, useState } from "react";
import "../Styles/Profile.css";
import MainSideBar from "../components/MainSideBar/MainSideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserCalendar from "../components/Calender";
import {
  UserOutlined,
  MailOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined,
  EditOutlined,
  TrophyOutlined,
  DollarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout } = useAuth();

  // ✅ Sidebar state management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [roleData, setRoleData] = useState({});

  // ✅ Auto-collapse sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname]);

  // ✅ Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      console.log('🔑 Token:', token ? 'Exists' : 'Missing');

      if (!token) {
        console.error('❌ No token found');
        navigate('/login');
        return;
      }

      console.log('📡 Fetching from: http://localhost:5000/api/profile');

      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Data received:', data);

      if (data.success) {
        setUserData(data.user);
        setRoleData(data.roleSpecificData);
        console.log('✅ Active Roles:', data.user.activeRoles);
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير متوفر";
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatCurrency = (cents) => {
    return `$${(cents)}`;
  };

  const getRoleNameInArabic = (role) => {
    const roleMap = {
      'student': 'طالب',
      'teacher': 'معلم',
      'parent': 'ولي أمر',
      'donor': 'متبرع',
      'mosque_admin': 'مدير مسجد',
      'ministry_admin': 'مدير وزارة'
    };
    return roleMap[role] || role;
  };

  const renderGeneralInfo = () => (
    <div className="profile-section">
      <h3 className="section-title">المعلومات الشخصية</h3>
      <div className="info-grid">
        <div className="info-item">
          <UserOutlined className="info-icon" />
          <div>
            <span className="info-label">الاسم الكامل</span>
            <span className="info-value">{userData.full_name}</span>
          </div>
        </div>
        <div className="info-item">
          <MailOutlined className="info-icon" />
          <div>
            <span className="info-label">البريد الإلكتروني</span>
            <span className="info-value">{userData.email}</span>
          </div>
        </div>
        <div className="info-item">
          <PhoneOutlined className="info-icon" />
          <div>
            <span className="info-label">رقم الهاتف</span>
            <span className="info-value">{userData.phone || "غير متوفر"}</span>
          </div>
        </div>
        <div className="info-item">
          <CalendarOutlined className="info-icon" />
          <div>
            <span className="info-label">العمر</span>
            <span className="info-value">{calculateAge(userData.dob)} سنة</span>
          </div>
        </div>
        <div className="info-item">
          <HomeOutlined className="info-icon" />
          <div>
            <span className="info-label">المحافظة</span>
            <span className="info-value">{userData.location?.governorate || "غير محدد"}</span>
          </div>
        </div>
        <div className="info-item">
          <CheckCircleOutlined className="info-icon" />
          <div>
            <span className="info-label">حالة الحساب</span>
            <span className={`status-badge ${userData.approved ? 'approved' : 'pending'}`}>
              {userData.approved ? "مفعّل" : "قيد المراجعة"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentInfo = () => {
    if (!roleData.student) return null;
    const studentData = roleData.student;

    return (
      <div className="profile-section">
        <h3 className="section-title">معلومات الطالب</h3>

        <div className="stats-row">
          <div className="stat-card">
            <BookOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{studentData.enrollments?.length || 0}</h4>
              <p>الدورات المسجلة</p>
            </div>
          </div>
          <div className="stat-card">
            <TrophyOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{studentData.attendance_rate}%</h4>
              <p>نسبة الحضور</p>
            </div>
          </div>
          <div className="stat-card">
            <ClockCircleOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{studentData.sessions_attended}/{studentData.total_sessions}</h4>
              <p>الجلسات المحضورة</p>
            </div>
          </div>
        </div>

        {studentData.enrollments && studentData.enrollments.length > 0 && (
          <div className="enrollments-list">
            <h4>الدورات الحالية</h4>
            {studentData.enrollments.map((enrollment, idx) => (
              <div key={idx} className="enrollment-card">
                <div className="enrollment-header">
                  <h5>{enrollment.course_name}</h5>
                  <span className={`badge ${enrollment.status}`}>
                    {enrollment.status === 'active' ? 'نشط' : enrollment.status}
                  </span>
                </div>
                <p className="enrollment-teacher">المعلم: {enrollment.teacher_name}</p>
                <p className="enrollment-level">المستوى: {enrollment.current_level}</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{Math.round(enrollment.progress)}% مكتمل</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTeacherInfo = () => {
    if (!roleData.teacher) return null;
    const teacherData = roleData.teacher;

    return (
      <div className="profile-section">
        <h3 className="section-title">معلومات المعلم</h3>

        <div className="stats-row">
          <div className="stat-card">
            <TeamOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{teacherData.current_students}</h4>
              <p>الطلاب الحاليون</p>
            </div>
          </div>
          <div className="stat-card">
            <BookOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{teacherData.completed_courses}</h4>
              <p>الدورات المكتملة</p>
            </div>
          </div>
          <div className="stat-card">
            <TrophyOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{teacherData.average_rating}/5</h4>
              <p>التقييم ({teacherData.total_ratings} تقييم)</p>
            </div>
          </div>
        </div>

        <div className="certification-info">
          <h4>الشهادات والخبرة</h4>
          <div className="cert-grid">
            <div className="cert-item">
              <CheckCircleOutlined style={{ color: teacherData.certifications?.has_tajweed_certificate ? '#52c41a' : '#999' }} />
              <span>شهادة التجويد</span>
            </div>
            <div className="cert-item">
              <CheckCircleOutlined style={{ color: teacherData.certifications?.has_sharea_certificate ? '#52c41a' : '#999' }} />
              <span>شهادة الشريعة</span>
            </div>
            <div className="cert-item">
              <ClockCircleOutlined />
              <span>{teacherData.certifications?.experience_years || 0} سنوات خبرة</span>
            </div>
          </div>
        </div>

        {teacherData.expertise && teacherData.expertise.length > 0 && (
          <div className="expertise-info">
            <h4>مجالات التخصص</h4>
            {teacherData.expertise.map((exp, idx) => (
              <div key={idx} className="expertise-card">
                <p><strong>{exp.course_type === 'memorization' ? 'التحفيظ' : exp.course_type}</strong></p>
                {exp.max_level && <p>المستوى: {exp.max_level}</p>}
                <p>الأجر: {formatCurrency(exp.hourly_rate_cents)}/ساعة</p>
              </div>
            ))}
          </div>
        )}

        {teacherData.availability && teacherData.availability.length > 0 && (
          <div className="availability-info">
            <h4>أوقات التوفر</h4>
            <div className="availability-list">
              {teacherData.availability.map((slot, idx) => (
                <div key={idx} className="availability-slot">
                  <span className="day">{slot.day_of_week}</span>
                  <span className="time">{slot.start_time} - {slot.end_time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderParentInfo = () => {
    if (!roleData.parent) return null;
    const parentData = roleData.parent;

    return (
      <div className="profile-section">
        <h3 className="section-title">معلومات ولي الأمر</h3>

        {parentData.children && parentData.children.length > 0 ? (
          <div className="children-list">
            <h4>الأبناء المسجلون</h4>
            {parentData.children.map((child, idx) => (
              <div key={idx} className="child-card">
                <div className="child-header">
                  <UserOutlined className="child-icon" />
                  <div>
                    <h5>{child.name}</h5>
                    <p>{child.age} سنة</p>
                  </div>
                </div>
                <div className="child-stats">
                  <span>الدورات: {child.courses}</span>
                  <span>التقدم: {child.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${child.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>لا يوجد أبناء مسجلون</p>
        )}
      </div>
    );
  };

  const renderDonorInfo = () => {
    if (!roleData.donor) return null;
    const donorData = roleData.donor;

    return (
      <div className="profile-section">
        <h3 className="section-title">معلومات المتبرع</h3>

        <div className="stats-row">
          <div className="stat-card">
            <DollarOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{formatCurrency(donorData.total_donated_cents)}</h4>
              <p>إجمالي التبرعات</p>
            </div>
          </div>
          <div className="stat-card">
            <BookOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{donorData.campaigns_supported}</h4>
              <p>الحملات المدعومة</p>
            </div>
          </div>
          <div className="stat-card">
            <CalendarOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{formatDate(donorData.last_donation_date)}</h4>
              <p>آخر تبرع</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ✅ Toggle sidebar function
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <div>No Data for You</div>
      </>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-main" style={{ padding: '40px' }}>
        {/* Profile Header */}
        <div className="profile-header-enhanced">
          <div className="profile-avatar-large">
            <UserOutlined className="avatar-icon" />
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{userData.full_name}</h2>
            <p className="profile-email">
              <MailOutlined /> {userData.email}
            </p>
            <div className="roles-badges">
              {userData.activeRoles && userData.activeRoles.length > 0 ? (
                userData.activeRoles.map((role, idx) => (
                  <span key={idx} className="role-badge">
                    {getRoleNameInArabic(role)}
                  </span>
                ))
              ) : (
                <span className="role-badge">لا توجد أدوار نشطة</span>
              )}
            </div>
          </div>
          <button
            className="edit-profile-btn"
            onClick={() => navigate('/profile-details')}
          >
            <EditOutlined /> تعديل الملف الشخصي
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            نظرة عامة
          </button>
          {userData.activeRoles?.includes('student') && (
            <button
              className={`tab ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveTab('student')}
            >
              معلومات الطالب
            </button>
          )}
          {userData.activeRoles?.includes('teacher') && (
            <button
              className={`tab ${activeTab === 'teacher' ? 'active' : ''}`}
              onClick={() => setActiveTab('teacher')}
            >
              معلومات المعلم
            </button>
          )}
          {userData.activeRoles?.includes('parent') && (
            <button
              className={`tab ${activeTab === 'parent' ? 'active' : ''}`}
              onClick={() => setActiveTab('parent')}
            >
              معلومات ولي الأمر
            </button>
          )}
          {userData.activeRoles?.includes('donor') && (
            <button
              className={`tab ${activeTab === 'donor' ? 'active' : ''}`}
              onClick={() => setActiveTab('donor')}
            >
              معلومات المتبرع
            </button>
          )}
          <button
            className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            التقويم
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && renderGeneralInfo()}
          {activeTab === 'student' && renderStudentInfo()}
          {activeTab === 'teacher' && renderTeacherInfo()}
          {activeTab === 'parent' && renderParentInfo()}
          {activeTab === 'donor' && renderDonorInfo()}
          {activeTab === 'calendar' && <UserCalendar />}
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button
            className="profile-btn settings-btn"
            onClick={() => navigate('/profile-details')}
          >
            <SettingOutlined /> إعدادات الحساب
          </button>
          <button
            className="profile-btn logout-btn"
            onClick={handleLogout}
          >
            <LogoutOutlined /> تسجيل خروج
          </button>
        </div>
      </div>
    </div>


  );
}

export default ProfilePage;