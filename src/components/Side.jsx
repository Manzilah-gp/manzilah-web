import React from "react";
import "../Styles/Profile.css";
import {
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom"; // <-- مهم جدا

function Sidebar() {
  const navigate = useNavigate(); // <-- تعريفه

  return (
    <div className="profile-sidebar">

      <div className="sidebar-section">
        <h3 className="sidebar-title">القائمة</h3>

        <ul>
          <li onClick={() => navigate("/profile-details")}>
            <UserOutlined /> الملف الشخصي
          </li>

          <li onClick={() => navigate("/profile")}>
            <DashboardOutlined /> لوحة التحكم
          </li>

          <li>
            <BookOutlined /> الحفظ والدروس
          </li>

          <li>
            <CalendarOutlined /> التقويم
          </li>
        </ul>
      </div>

    </div>
  );
}

export default Sidebar;
