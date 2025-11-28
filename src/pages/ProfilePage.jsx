// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import "../Styles/Profile.css";
import MainSideBar from "../components/MainSideBar/MainSideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserCalendar from "../components/Calender";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  UserOutlined,
  MailOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

function ProfilePage() {
  const [role, setRole] = useState("طالب"); // Default role
  const [events, setEvents] = useState([
    { title: "حلقة تحفيظ", date: "2025-01-10" },
    { title: "اختبار تجويد", date: "2025-01-15" },
  ]);

  const user = {
    name: "اسم المستخدم",
    email: "user@example.com",
  };

  // Stat boxes content based on role
  const getStats = (role) => {
    switch (role) {
      case "طالب":
        return [
          { icon: <BookOutlined />, value: 12, label: "عدد المحفوظ" },
          { icon: <SettingOutlined />, value: 4, label: "الدورات النشطة" },
          { icon: <UserOutlined />, value: "89%", label: "نسبة التقدم" },
        ];
      case "مشرف":
        return [
          { icon: <UserOutlined />, value: 20, label: "عدد الطلاب" },
          { icon: <BookOutlined />, value: 5, label: "عدد الحلقات" },
          { icon: <SettingOutlined />, value: "95%", label: "نسبة الالتزام" },
        ];
      case "أدمن":
        return [
          { icon: <UserOutlined />, value: 150, label: "عدد المستخدمين" },
          { icon: <BookOutlined />, value: 10, label: "عدد المشرفين" },
          { icon: <SettingOutlined />, value: 7, label: "عدد الحلقات" },
        ];
      case "ولي أمر":
        return [
          { icon: <UserOutlined />, value: 2, label: "عدد الأبناء" },
          { icon: <BookOutlined />, value: "75%", label: "متوسط التقدم" },
          { icon: <SettingOutlined />, value: 5, label: "التنبيهات" },
        ];
      case "متبرع":
        return [
          { icon: <UserOutlined />, value: 5, label: "عدد التبرعات" },
          { icon: <BookOutlined />, value: "1500$", label: "المبلغ المتبرع" },
          { icon: <SettingOutlined />, value: 3, label: "المشاريع المدعومة" },
        ];
      default:
        return [];
    }
  };

  const stats = getStats(role);

  const handleDateClick = (info) => {
    const title = prompt("أدخل عنوان الحدث:");
    if (title) setEvents([...events, { title, date: info.dateStr }]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".profile-header, .stat-box").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [role]);

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-layout">
        <MainSideBar />

        <div className="profile-main">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              <UserOutlined className="avatar-icon" />
            </div>

            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email"><MailOutlined /> {user.email}</p>

            <div className="role-select">
              <label>Role: </label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="طالب">طالب</option>
                <option value="مشرف">مشرف</option>
                <option value="أدمن">أدمن</option>
                <option value="ولي أمر">ولي أمر</option>
                <option value="متبرع">متبرع</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-box">
                {stat.icon}
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <UserCalendar />


          {/* Buttons */}
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
