import React, { useState } from 'react';
import { Menu } from 'antd';
import {
    BarChartOutlined,
    BankOutlined,
    CheckCircleOutlined,
    UserOutlined,
    SettingOutlined,
    MenuOutlined,
    LeftOutlined,
    LogoutOutlined,
    SearchOutlined,
    DownOutlined,
    WechatOutlined,
    ProfileOutlined,
    UnorderedListOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import './MainSideBar.css';
import Sider from 'antd/es/layout/Sider';

const MainSideBar = ({ activeItem, onItemClick }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    // Define menu items with role permissions
    const getMenuItems = () => {
        const baseItems = [
            {
                key: 'statistics',
                icon: <BarChartOutlined />,
                label: t('sidebar.statistics'),
                roles: ['student', 'mosque_admin', 'ministry_admin', 'parent', 'teacher'],
                link: '/dashboard/ministry/statistics'
            }
            , {
                key: 'profile',
                icon: <ProfileOutlined />,
                label: t('sidebar.profile'),
                roles: ['student', 'mosque_admin', 'ministry_admin', 'parent', 'teacher'],
                link: '/profile'

            }
        ];

        const adminItems = [
            {
                key: 'add-mosque',
                icon: <BankOutlined />,
                label: t('sidebar.includeMosque'),
                roles: ['admin'],
                children: [
                    { key: 'add-mosque', label: 'Add Mosque', link: '/dashboard/ministry/add-mosque', icon: <PlusOutlined /> },
                    {
                        key: 'mosque-list', label: 'Mosque List', link: '/dashboard/ministry/mosque-list', icon: <UnorderedListOutlined />,
                    }
                ]
            },
            {
                key: 'approve-donationds',
                icon: <CheckCircleOutlined />,
                label: t('sidebar.Donationds'),
                roles: ['admin'],
                children: [
                    { key: 'pending-donationds', label: 'Pending Donationds', link: '/dashboard/ministry/pending-events' },
                    { key: 'approved-donationds', label: 'Approved Donationds', link: '/dashboard/ministry/approved-events' },
                    { key: 'rejected-donationds', label: 'Rejected Donationds', link: '/dashboard/ministry/rejected-events' }
                ]
            },
            // {
            //     key: 'user-management',
            //     icon: <UserOutlined />,
            //     label: t('sidebar.userManagement'),
            //     roles: ['admin'],
            //     children: [
            //         { key: 'add-user', label: 'Add Mosque Admin' },
            //         { key: 'user-list', label: 'Admin List' },
            //         { key: 'role-management', label: 'Role Management' }
            //     ]
            // },
            {
                key: 'system-settings',
                icon: <SettingOutlined />,
                label: t('sidebar.systemSettings'),
                roles: ['admin'],
                children: [
                    { key: 'general-settings', label: 'General Settings', link: '/general-settings' },
                    { key: 'notification-settings', label: 'Notifications', link: '/notification-settings' },
                ]
            }
        ];

        // Combine and filter items based on user role
        const allItems = [...baseItems, ...adminItems];
        // For now, return all items - implement role filtering later
        // return allItems.filter(item => item.roles.includes(user.role));
        return allItems;
    };

    const toggleDropdown = (key) => {
        setOpenDropdown(openDropdown === key ? null : key);
    };

    const handleItemClick = (key) => {
        onItemClick(key);
        // Close dropdown when item is selected (for mobile)
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        }
    };

    const menuItems = getMenuItems();

    return (
        <Sider
            width={280}
            breakpoint="lg"
            collapsedWidth={80}
            collapsible
            collapsed={collapsed}
            onCollapse={() => setCollapsed(!collapsed)}
            trigger={null}
            style={{ background: '#151A2D' }}

        >
            {/* Mobile Menu Button */}
            <button
                className="sidebar-menu-button"
                onClick={() => setCollapsed(!collapsed)}
            >
                <MenuOutlined />
            </button>

            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                {/* className={`sidebar ${collapsed ? 'collapsed' : ''}`} */}

                {/* Sidebar Header */}
                <header className="sidebar-header">
                    {/* <div className="header-logo">
                        <div className="logo-placeholder">
                            <BankOutlined style={{ fontSize: '24px', color: '#EEF2FF' }} />
                        </div>
                        <span className="app-name">Main Bar</span>
                    </div> */}

                    <button
                        className="sidebar-toggler"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <LeftOutlined style={{
                            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }} />
                    </button>
                </header>

                {/* User Info Section */}
                <div className="user-info-section">
                    <div className={`user-avatar${collapsed ? 'collapsed' : ''}`}>
                        <UserOutlined />
                    </div>
                    <div className="user-details">
                        <h4 className="user-name">{user?.name || 'User'}</h4>
                        <p className="user-role">{user?.role || 'N/A'}</p>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    <ul className="nav-list primary-nav">
                        {menuItems.map(item => (
                            <li
                                key={item.key}
                                className={`nav-item ${item.children ? 'dropdown-container' : ''} ${openDropdown === item.key ? 'open' : ''}`}
                            >
                                {item.children ? (
                                    <>
                                        <a
                                            href="#"
                                            className="nav-link dropdown-toggle"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleDropdown(item.key);
                                            }}
                                        >
                                            <span className="nav-icon">{item.icon}</span>
                                            <span className="nav-label">{item.label}</span>
                                            <span className="dropdown-icon">
                                                <DownOutlined style={{
                                                    transform: openDropdown === item.key ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s ease'
                                                }} />
                                            </span>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li className="nav-item">
                                                <a className="nav-link dropdown-title">{item.label}</a>
                                            </li>
                                            {item.children.map(child => (
                                                <li key={child.key} className="nav-item">
                                                    <a
                                                        href={child.link || '#'}
                                                        className="nav-link dropdown-link"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleItemClick(child.key);
                                                        }}
                                                    >
                                                        {child.icon && <span className="nav-icon">{child.icon} </span>}
                                                        {child.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <a
                                        href={item.link || '#'}
                                        className={`nav-link ${activeItem === item.key ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleItemClick(item.key);
                                        }}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span className="nav-label">{item.label}</span>
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Secondary Navigation */}
                    <ul className="nav-list secondary-nav">
                        <li className="nav-item">
                            <a href="/chat" className="nav-link">
                                <span className="nav-icon"><WechatOutlined /></span>
                                <span className="nav-label">{t('sidebar.chat')}</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/login" className="nav-link">
                                <span className="nav-icon"><LogoutOutlined /></span>
                                <span className="nav-label">{t('sidebar.signout')}</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
        </Sider>
    );
};

export default MainSideBar;