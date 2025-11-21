// src/components/Sidebar.jsx
import React from "react";
import "../Styles/Profile.css";
import {
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

function Sidebar() {
  return (
    <div className="profile-sidebar">

      <div className="sidebar-section">
        <h3 className="sidebar-title">القائمة</h3>

        <ul>
          <li><UserOutlined /> الملف الشخصي</li>
          <li><DashboardOutlined /> لوحة التحكم</li>
          <li><BookOutlined /> الحفظ والدروس</li>
          <li><CalendarOutlined /> التقويم</li>
        </ul>
      </div>

    </div>
  );
}

export default Sidebar;
