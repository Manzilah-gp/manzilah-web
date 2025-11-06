import React, { useState } from "react";
import { Menu, Button, Select, Dropdown, Space, Drawer } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  GlobalOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  BookOutlined,
  BankOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../Styles/Header_Footer.css"
const { Option } = Select;

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const user = null; // Replace with auth logic if needed

  const navigationItems = [
    { key: "home", label: t("Home"), icon: <HomeOutlined />, onClick: () => navigate("/") },
    { key: "about", label: t("About Us"), icon: <InfoCircleOutlined />, onClick: () => navigate("/about") },
    { key: "courses", label: t("Courses"), icon: <BookOutlined />, onClick: () => navigate("/courses") },
    { key: "mosques", label: t("Mosques"), icon: <BankOutlined />, onClick: () => navigate("/mosques") },
    { key: "registration", label: t("Registration"), icon: <FormOutlined />, onClick: () => navigate("/registration") },
  ];

  const userMenuItems = [
    { key: "logout", icon: <LogoutOutlined />, label: t("Logout"), onClick: () => console.log("Logout") },
  ];

  return (
    <>
      <header className="site-header">
        <div className="logo" onClick={() => navigate("/")}>Manzilah</div>

        {/* Desktop Menu */}
        <Menu mode="horizontal" items={navigationItems} className="desktop-menu" />

        {/* Right Side */}
        <Space className="header-right">
          <Select defaultValue="en" suffixIcon={<GlobalOutlined />} style={{ width: 90 }}>
            <Option value="en">EN</Option>
            <Option value="ar">AR</Option>
          </Select>

          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
              <Button icon={<UserOutlined />}>{user.name}</Button>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate("/login")}>{t("Login")}</Button>
          )}

          <Button
            type="text"
            icon={<MenuOutlined />}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuVisible(true)}
          />
        </Space>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
      >
        <Menu mode="vertical" items={navigationItems} />
      </Drawer>
    </>
  );
};

export default Header;
