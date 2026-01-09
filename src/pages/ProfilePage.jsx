import React, { useEffect, useState } from "react";
import "../Styles/Profile.css";

import CalendarPage from "./Calendar/CalendarPage";
import AdminEventManagement from "../components/Admin/AdminEventManagement";
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
  DashboardOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserEvents from '../hooks/useUserEvents';
import ParentRelationshipSection from '../components/Profile/ParentRelationshipSection';
import StudentParentRequestsSection from '../components/Profile/StudentParentRequestsSection';

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

  // Calendar hook
  const { events, loading: calendarLoading, error } = useUserEvents();

  // Check if user is a mosque admin
  const isMosqueAdmin = userData?.activeRoles?.includes('mosque_admin');

  console.log('Calendar events:', events);
  console.log('Calendar Loading:', calendarLoading);
  console.log('Calendar Error:', error);
  console.log('Is Mosque Admin:', isMosqueAdmin);

  // Auto-collapse sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname]);

  // Handle window resize
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
    // Check if navigation included a tab state from sidebar
    if (location.state?.tab) {
      const targetTab = location.state.tab;

      // Validate tab exists (including new admin tab)
      const validTabs = ['overview', 'student', 'teacher', 'parent', 'donor', 'calendar', 'admin'];

      if (validTabs.includes(targetTab)) {
        console.log('Opening tab from sidebar:', targetTab);
        setActiveTab(targetTab);

        // Clear the state so back button works normally
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      console.log('🔑 Token:', token ? 'Exists' : 'Missing');

      if (!token) {
        console.error('No token found');
        navigate('/login');
        return;
      }

      console.log('Fetching from: http://localhost:5000/api/profile');

      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


      console.log('Response for Hala:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Data received:', data);

      if (data.success) {
        setUserData(data.user);
        setRoleData(data.roleSpecificData);
        console.log('Active Roles:', data.user.activeRoles);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !userData) {
      console.warn('Profile data missing after load, redirecting to login...');
      navigate('/login');
    }
  }, [loading, userData, navigate]);

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
    if (!dateString) return "Not Available";
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatCurrency = (cents) => {
    return `$${(cents)}`;
  };

  const getRoleNameInArabic = (role) => {
    const roleMap = {
      'student': 'student',
      'teacher': 'teacher',
      'parent': 'parent',
      'donor': 'donor',
      'mosque_admin': 'mosque admin',
      'ministry_admin': 'ministry admin'
    };
    return roleMap[role] || role;
  };

  const renderGeneralInfo = () => (
    <div className="profile-section">
      <h3 className="section-title">Personal Information</h3>
      <div className="info-grid">
        <div className="info-item">
          <UserOutlined className="info-icon" />
          <div>
            <span className="info-label">Full Name</span>
            <span className="info-value">{userData.full_name}</span>
          </div>
        </div>
        <div className="info-item">
          <MailOutlined className="info-icon" />
          <div>
            <span className="info-label">Email</span>
            <span className="info-value">{userData.email}</span>
          </div>
        </div>
        <div className="info-item">
          <PhoneOutlined className="info-icon" />
          <div>
            <span className="info-label">Phone Number</span>
            <span className="info-value">{userData.phone || "Not Available"}</span>
          </div>
        </div>
        <div className="info-item">
          <CalendarOutlined className="info-icon" />
          <div>
            <span className="info-label">Age</span>
            <span className="info-value">{calculateAge(userData.dob)} Year</span>
          </div>
        </div>
        <div className="info-item">
          <HomeOutlined className="info-icon" />
          <div>
            <span className="info-label">City</span>
            <span className="info-value">{userData.location?.governorate || "undefined"}</span>
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
        <h3 className="section-title">Student Information</h3>

        <div className="stats-row">
          <div className="stat-card">
            <BookOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{studentData.enrollments?.length || 0}</h4>
              <p>Courses Registered</p>
            </div>
          </div>
          <div className="stat-card">
            <TrophyOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{studentData.attendance_rate}%</h4>
              <p>Attendance percentage</p>
            </div>
          </div>
          <div className="stat-card">
            <ClockCircleOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{studentData.sessions_attended}/{studentData.total_sessions}</h4>
              <p>Sessions attended</p>
            </div>
          </div>
        </div>

        {studentData.enrollments && studentData.enrollments.length > 0 && (
          <div className="enrollments-list">
            <h4>Current Courses</h4>
            {studentData.enrollments.map((enrollment, idx) => (
              <div key={idx} className="enrollment-card">
                <div className="enrollment-header">
                  <h5>{enrollment.course_name}</h5>
                  <span className={`badge ${enrollment.status}`}>
                    {enrollment.status === 'active' ? 'Active' : enrollment.status}
                  </span>
                </div>
                <p className="enrollment-teacher">Teacher: {enrollment.teacher_name}</p>
                <p className="enrollment-level">Level: {enrollment.current_level}</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{Math.round(enrollment.progress)}% Done</span>
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
        <h3 className="section-title">Teacher Information</h3>

        <div className="stats-row">
          <div className="stat-card">
            <TeamOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{teacherData.current_students}</h4>
              <p>Current Students</p>
            </div>
          </div>
          <div className="stat-card">
            <BookOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{teacherData.completed_courses}</h4>
              <p>Completed sessions</p>
            </div>
          </div>
        </div>

        <div className="certification-info">
          <h4>Certificates and Experience</h4>
          <div className="cert-grid">
            <div className="cert-item">
              <CheckCircleOutlined style={{ color: teacherData.certifications?.has_tajweed_certificate ? '#52c41a' : '#999' }} />
              <span>Tajweed Certificate</span>
            </div>
            <div className="cert-item">
              <CheckCircleOutlined style={{ color: teacherData.certifications?.has_sharea_certificate ? '#52c41a' : '#999' }} />
              <span>Sharia Certificate</span>
            </div>
            <div className="cert-item">
              <ClockCircleOutlined />
              <span>{teacherData.certifications?.experience_years || 0} Years of experience</span>
            </div>
          </div>
        </div>

        {teacherData.expertise && teacherData.expertise.length > 0 && (
          <div className="expertise-info">
            <h4>Areas of specialization</h4>
            {teacherData.expertise.map((exp, idx) => (
              <div key={idx} className="expertise-card">
                <p><strong>{exp.course_type === 'memorization' ? 'Memorization' : exp.course_type}</strong></p>
                {exp.max_level && <p>Level: {exp.max_level}</p>}
                <p>Hourly Rate: {formatCurrency(exp.hourly_rate_cents)}/Hour</p>
              </div>
            ))}
          </div>
        )}

        {teacherData.availability && teacherData.availability.length > 0 && (
          <div className="availability-info">
            <h4>Availability times</h4>
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
        <h3 className="section-title">Parents Information</h3>

        {parentData.children && parentData.children.length > 0 ? (
          <div className="children-list">
            <h4>Registered Children</h4>
            {parentData.children.map((child, idx) => (
              <div key={idx} className="child-card">
                <div className="child-header">
                  <UserOutlined className="child-icon" />
                  <div>
                    <h5>{child.name}</h5>
                    <p>{child.age} Year</p>
                  </div>
                </div>
                <div className="child-stats">
                  <span>Courses: {child.courses}</span>
                  <span>Progress: {child.progress}%</span>
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
          <p>No Registered Children</p>
        )}
      </div>
    );
  };

  const renderDonorInfo = () => {
    if (!roleData.donor) return null;
    const donorData = roleData.donor;

    return (
      <div className="profile-section">
        <h3 className="section-title">Donor Information</h3>

        <div className="stats-row">
          <div className="stat-card">
            <DollarOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{formatCurrency(donorData.total_donated_cents)}</h4>
              <p>Total donations</p>
            </div>
          </div>
          <div className="stat-card">
            <BookOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{donorData.campaigns_supported}</h4>
              <p>Sponsored campaigns</p>
            </div>
          </div>
          <div className="stat-card">
            <CalendarOutlined className="stat-icon" />
            <div className="stat-content">
              <h4>{formatDate(donorData.last_donation_date)}</h4>
              <p>Last Donation</p>
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

  // Toggle sidebar function
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    // Only redirect if loading is finished and we still have no data
    // Note: fetchUserProfile covers most auth failures, this is a fallback
    return <div style={{ padding: '20px', textAlign: 'center' }}>Redirecting to login...</div>;
  }

  return (
    <div className="profile-page">
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
              <span className="role-badge">No active roles</span>
            )}
          </div>
        </div>
        <button
          className="edit-profile-btn"
          onClick={() => navigate('/profile-details')}
        >
          <EditOutlined /> Edit profile
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        {userData.activeRoles?.includes('student') && (
          <button
            className={`tab ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            Student Information
          </button>
        )}
        {userData.activeRoles?.includes('teacher') && (
          <button
            className={`tab ${activeTab === 'teacher' ? 'active' : ''}`}
            onClick={() => setActiveTab('teacher')}
          >
            Teacher Information
          </button>
        )}
        {userData.activeRoles?.includes('parent') && (
          <button
            className={`tab ${activeTab === 'parent' ? 'active' : ''}`}
            onClick={() => setActiveTab('parent')}
          >
            Parent Information
          </button>
        )}
        {userData.activeRoles?.includes('donor') && (
          <button
            className={`tab ${activeTab === 'donor' ? 'active' : ''}`}
            onClick={() => setActiveTab('donor')}
          >
            Donor Information
          </button>
        )}
        {/* ===================================================== */}
        {/* ADMIN TAB (ONLY for mosque admins) */}
        {/* ===================================================== */}
        {isMosqueAdmin && (
          <button
            className={`tab admin-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <DashboardOutlined /> Manage Events
          </button>
        )}
        <button
          className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && renderGeneralInfo()}

        {activeTab === 'student' && (
          <>
            {renderStudentInfo()}

            {/* ⭐ NEW: Student Parent Requests Section */}
            {userData.activeRoles?.includes('student') && (
              <StudentParentRequestsSection />
            )}
          </>
        )}

        {activeTab === 'teacher' && renderTeacherInfo()}

        {activeTab === 'parent' && (
          <>
            {renderParentInfo()}

            {/* ⭐ NEW: Parent Relationship Section */}
            {userData.activeRoles?.includes('parent') && (
              <ParentRelationshipSection />
            )}
          </>
        )}

        {activeTab === 'donor' && renderDonorInfo()}

        {/* ADMIN EVENT MANAGEMENT TAB (ONLY for mosque admins) */}
        {activeTab === 'admin' && isMosqueAdmin && (
          <div className="admin-tab-content">
            <AdminEventManagement />
          </div>
        )}

        {activeTab === 'calendar' && (
          <div>
            <CalendarPage
              events={events || []}
              loading={calendarLoading}
              title="Your Event Schedule"
              subtitle="Events you're attending"
              showAttendingBadge={true}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button
          className="profile-btn settings-btn"
          onClick={() => navigate('/profile-details')}
        >
          <SettingOutlined /> Profile Settings
        </button>
        <button
          className="profile-btn logout-btn"
          onClick={handleLogout}
        >
          <LogoutOutlined /> Log out
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;