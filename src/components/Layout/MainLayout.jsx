// components/Layout/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import MainSideBar from '../MainSideBar/MainSideBar';
import './MainLayout.css';

const { Content } = Layout;

/**
 * DashboardLayout - Reusable layout wrapper for all dashboard pages
 * Includes Header, Sidebar, and Footer
 * Uses Outlet for nested routing
 */
const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileView, setMobileView] = useState(false);

    // Check for mobile view on mount and resize
    useEffect(() => {
        checkMobileView();
        window.addEventListener('resize', checkMobileView);
        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    const checkMobileView = () => {
        const isMobile = window.innerWidth <= 768;
        setMobileView(isMobile);
        if (isMobile) {
            setCollapsed(true);
        }
    };

    return (
        <Layout className="dashboard-layout">
            {/* Fixed Header */}
            <Header
                onMenuToggle={() => setCollapsed(!collapsed)}
                showMobileMenu={mobileView}
            />

            <Layout className="site-layout">
                {/* Sidebar - only show for authenticated users */}
                <MainSideBar
                    collapsed={collapsed}
                    onToggleCollapse={() => setCollapsed(!collapsed)}
                />

                {/* Main Content Area - renders child routes */}
                <Layout className="main-content-wrapper">
                    <Content className="dashboard-main-content">
                        <div className="content-scroll-wrapper">
                            {/* This is where nested route components render */}
                            <Outlet />
                        </div>
                    </Content>
                </Layout>
            </Layout>

            {/* Footer */}
            <Footer />
        </Layout>
    );
};

export default DashboardLayout;
