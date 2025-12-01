import React, { useEffect, useState } from "react";
import "../Styles/Profile.css";
import MainSideBar from "../components/MainSideBar/MainSideBar";
import Sidebar from "../components/Side"
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

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [roleData, setRoleData] = useState({});

  // Fetch user profile data
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserData(data.user);
      setRoleData(data.roleSpecificData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  // Mock data for demonstration (remove when API is connected)
  const mockUserData = {
    id: 1,
    full_name: "أحمد محمد",
    email: "ahmad@example.com",
    phone: "+970599123456",
    gender: "male",
    dob: "2000-05-15",
    created_at: "2024-01-15",
    approved: true,
    location: {
      governorate: "nablus",
      region: "Old City",
      address_line1: "شارع الحسبة"
    },
    roles: ["student","parent"],
    activeRole: "mosque_admin"
  };

  const mockRoleData = {
    student: {
      enrollments: [
        {
          course_name: "تحفيظ القرآن - المستوى الأول",
          teacher_name: "الشيخ محمود",
          progress: 75,
          current_level: "Juz 1-5",
          status: "active",
          enrollment_date: "2024-09-01"
        }
      ],
      attendance_rate: 89,
      total_sessions: 45,
      sessions_attended: 40,
      evaluations: [
        { teacher_name: "الشيخ محمود", rating: 5, comments: "طالب مجتهد" }
      ]
    },
    teacher: {
      certifications: {
        has_tajweed_certificate: true,
        has_sharea_certificate: false,
        experience_years: 5,
        status: "approved"
      },
      expertise: [
        { course_type: "memorization", max_level: "Level 3", hourly_rate_cents: 5000 }
      ],
      availability: [
        { day_of_week: "sunday", start_time: "09:00", end_time: "12:00" },
        { day_of_week: "tuesday", start_time: "16:00", end_time: "19:00" }
      ],
      current_students: 15,
      completed_courses: 8,
      average_rating: 4.7
    },
    parent: {
      children: [
        { name: "فاطمة أحمد", age: 12, courses: 2, progress: 65 },
        { name: "عمر أحمد", age: 10, courses: 1, progress: 80 }
      ]
    },
    donor: {
      total_donated_cents: 150000,
      campaigns_supported: 5,
      last_donation_date: "2024-11-20"
    }
  };

  const user = userData || mockUserData;
  const roles = roleData && Object.keys(roleData).length > 0 ? roleData : mockRoleData;

  const calculateAge = (dob) => {
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
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const renderGeneralInfo = () => (
    <div className="profile-section">
      <h3 className="section-title">المعلومات الشخصية</h3>
      <div className="info-grid">
        <div className="info-item">
          <UserOutlined className="info-icon" />
          <div>
            <span className="info-label">الاسم الكامل</span>
            <span className="info-value">{user.full_name}</span>
          </div>
        </div>
        <div className="info-item">
          <MailOutlined className="info-icon" />
          <div>
            <span className="info-label">البريد الإلكتروني</span>
            <span className="info-value">{user.email}</span>
          </div>
        </div>
        <div className="info-item">
          <PhoneOutlined className="info-icon" />
          <div>
            <span className="info-label">رقم الهاتف</span>
            <span className="info-value">{user.phone || "غير متوفر"}</span>
          </div>
        </div>
        <div className="info-item">
          <CalendarOutlined className="info-icon" />
          <div>
            <span className="info-label">العمر</span>
            <span className="info-value">{calculateAge(user.dob)} سنة</span>
          </div>
        </div>
        <div className="info-item">
          <HomeOutlined className="info-icon" />
          <div>
            <span className="info-label">المحافظة</span>
            <span className="info-value">{user.location?.governorate || "غير محدد"}</span>
          </div>
        </div>
        <div className="info-item">
          <CheckCircleOutlined className="info-icon" />
          <div>
            <span className="info-label">حالة الحساب</span>
            <span className={`status-badge ${user.approved ? 'approved' : 'pending'}`}>
              {user.approved ? "مفعّل" : "قيد المراجعة"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentInfo = () => {
    if (!roles.student) return null;
    const studentData = roles.student;

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

        <div className="enrollments-list">
          <h4>الدورات الحالية</h4>
          {studentData.enrollments?.map((enrollment, idx) => (
            <div key={idx} className="enrollment-card">
              <div className="enrollment-header">
                <h5>{enrollment.course_name}</h5>
                <span className={`badge ${enrollment.status}`}>{enrollment.status}</span>
              </div>
              <p className="enrollment-teacher">المعلم: {enrollment.teacher_name}</p>
              <p className="enrollment-level">المستوى: {enrollment.current_level}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${enrollment.progress}%`}}
                ></div>
              </div>
              <span className="progress-text">{enrollment.progress}% مكتمل</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTeacherInfo = () => {
    if (!roles.teacher) return null;
    const teacherData = roles.teacher;

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
              <p>التقييم</p>
            </div>
          </div>
        </div>

        <div className="certification-info">
          <h4>الشهادات والخبرة</h4>
          <div className="cert-grid">
            <div className="cert-item">
              <CheckCircleOutlined style={{color: teacherData.certifications.has_tajweed_certificate ? '#52c41a' : '#999'}} />
              <span>شهادة التجويد</span>
            </div>
            <div className="cert-item">
              <CheckCircleOutlined style={{color: teacherData.certifications.has_sharea_certificate ? '#52c41a' : '#999'}} />
              <span>شهادة الشريعة</span>
            </div>
            <div className="cert-item">
              <ClockCircleOutlined />
              <span>{teacherData.certifications.experience_years} سنوات خبرة</span>
            </div>
          </div>
        </div>

        <div className="expertise-info">
          <h4>مجالات التخصص</h4>
          {teacherData.expertise?.map((exp, idx) => (
            <div key={idx} className="expertise-card">
              <p><strong>{exp.course_type === 'memorization' ? 'التحفيظ' : exp.course_type}</strong></p>
              <p>الحد الأقصى: {exp.max_level}</p>
              <p>الأجر: {formatCurrency(exp.hourly_rate_cents)}/ساعة</p>
            </div>
          ))}
        </div>

        <div className="availability-info">
          <h4>أوقات التوفر</h4>
          <div className="availability-list">
            {teacherData.availability?.map((slot, idx) => (
              <div key={idx} className="availability-slot">
                <span className="day">{slot.day_of_week}</span>
                <span className="time">{slot.start_time} - {slot.end_time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderParentInfo = () => {
    if (!roles.parent) return null;
    const parentData = roles.parent;

    return (
      <div className="profile-section">
        <h3 className="section-title">معلومات ولي الأمر</h3>
        
        <div className="children-list">
          <h4>الأبناء المسجلون</h4>
          {parentData.children?.map((child, idx) => (
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
                  style={{width: `${child.progress}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDonorInfo = () => {
    if (!roles.donor) return null;
    const donorData = roles.donor;

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

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-layout">
        <Sidebar />

        <div className="profile-main">
          {/* Profile Header */}
          <div className="profile-header-enhanced">
            <div className="profile-avatar-large">
              <UserOutlined className="avatar-icon" />
            </div>
            <div className="profile-header-info">
              <h2 className="profile-name">{user.full_name}</h2>
              <p className="profile-email">
                <MailOutlined /> {user.email}
              </p>
              <div className="roles-badges">
                {user.roles?.map((role, idx) => (
                  <span key={idx} className="role-badge">
                    {role === 'student' ? 'طالب' : 
                     role === 'teacher' ? 'معلم' :
                     role === 'parent' ? 'ولي أمر' :
                     role === 'donor' ? 'متبرع' :
                     role === 'mosque_admin' ? 'مدير مسجد' :
                     role === 'ministry_admin' ? 'مدير وزارة' : role}
                  </span>
                ))}
              </div>
            </div>
            <button className="edit-profile-btn">
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
            {user.roles?.includes('student') && (
              <button 
                className={`tab ${activeTab === 'student' ? 'active' : ''}`}
                onClick={() => setActiveTab('student')}
              >
                معلومات الطالب
              </button>
            )}
            {user.roles?.includes('teacher') && (
              <button 
                className={`tab ${activeTab === 'teacher' ? 'active' : ''}`}
                onClick={() => setActiveTab('teacher')}
              >
                معلومات المعلم
              </button>
            )}
            {user.roles?.includes('parent') && (
              <button 
                className={`tab ${activeTab === 'parent' ? 'active' : ''}`}
                onClick={() => setActiveTab('parent')}
              >
                معلومات ولي الأمر
              </button>
            )}
            {user.roles?.includes('donor') && (
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
            <button className="profile-btn settings-btn">
              <SettingOutlined /> إعدادات الحساب
            </button>
            <button className="profile-btn logout-btn">
              <LogoutOutlined /> تسجيل خروج
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProfilePage;