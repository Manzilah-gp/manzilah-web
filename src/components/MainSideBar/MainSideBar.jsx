import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import {
    BarChartOutlined,
    BankOutlined,
    CheckCircleOutlined,
    UserOutlined,
    SettingOutlined,
    MenuOutlined,
    LeftOutlined,
    LogoutOutlined,
    WechatOutlined,
    ProfileOutlined,
    UnorderedListOutlined,
    PlusOutlined,
    DownOutlined,
    TeamOutlined,
    BookOutlined,
    DollarOutlined,
    CalendarOutlined,
    ScheduleOutlined,
    YuqueOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import './MainSideBar.css';
import { Label } from 'recharts';

const { Sider } = Layout;

/**
 * MainSideBar - Navigation sidebar with role-based filtering
 * Only shows menu items that the current user has access to
 */
const MainSideBar = ({ collapsed, onToggleCollapse }) => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(null);

    /**
     * Define ALL menu items with their role requirements
     * Each item specifies which roles can see it
     */
    const ALL_MENU_ITEMS = [
        // ==================== COMMON ITEMS (All Users) ====================

        {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: t('sidebar.profile') || 'Profile',
            roles: ['student', 'mosque_admin', 'ministry_admin', 'parent', 'teacher'],
            link: '/profile'
        },
        {
            key: 'calendar',
            icon: <CalendarOutlined />,
            label: t('sidebar.calendar') || 'Calendar',
            roles: ['mosque_admin', 'teacher', 'student', 'parent'],
            link: '/calendar'
        },


        // ==================== MINISTRY ADMIN ONLY ====================

        {
            key: 'statistics',
            icon: <BarChartOutlined />,
            label: t('sidebar.statistics') || 'Statistics',
            roles: ['mosque_admin', 'ministry_admin'],
            link: '/statistics'
        },
        {
            key: 'mosques',
            icon: <BankOutlined />,
            label: 'Mosque Management',
            roles: ['ministry_admin'],
            children: [
                {
                    key: 'add-mosque',
                    label: 'Add Mosque',
                    link: '/add-mosque',
                    icon: <PlusOutlined />,
                    roles: ['ministry_admin']
                },
                {
                    key: 'mosque-list',
                    label: 'Mosque List',
                    link: '/mosque-list',
                    icon: <UnorderedListOutlined />,
                    roles: ['ministry_admin']
                }
            ]
        },
        {
            key: 'donations',
            icon: <DollarOutlined />,
            label: t('sidebar.Donationds') || 'Donations',
            roles: ['ministry_admin'],
            link: '/donations'
        },

        // ==================== MOSQUE ADMIN ONLY ====================
        {
            key: 'my-mosque',
            icon: <BankOutlined />,
            label: 'My Mosque',
            roles: ['mosque_admin'],
            link: '/my-mosque'
        },
        {
            key: 'teachers-management',
            icon: <TeamOutlined />,
            label: t('sidebar.teachersManagement') || 'Teachers Management',
            roles: ['mosque_admin'],
            link: 'mosque-admin/teacher-list'
        }, {
            key: 'events-management',
            icon: <ScheduleOutlined />,
            label: t('sidebar.eventsManagement') || 'Events Management',
            roles: ['mosque_admin'],
            link: '/events-management'
        }, {
            key: 'courses',
            icon: <BookOutlined />,
            label: 'Courses',
            roles: ['mosque_admin'],
            children: [
                {
                    key: 'course-list',
                    label: 'All Courses',
                    link: '/mosque-admin/courses',
                    roles: ['mosque_admin', 'teacher']
                },
                {
                    key: 'add-course',
                    label: 'Add Course',
                    link: '/mosque-admin/courses/create',
                    roles: ['mosque_admin']
                }

            ]
        },

        // ==================== TEACHER ONLY ====================
        {
            key: 'my-courses',
            icon: <BookOutlined />,
            label: 'My Courses',
            roles: ['teacher'],
            link: '/my-courses'
        },
        {
            key: 'students',
            icon: <TeamOutlined />,
            label: 'My Students',
            roles: ['teacher'],
            link: '/students'
        },

        // ==================== STUDENT ONLY ====================
        {
            key: 'my-enrollments',
            icon: <BookOutlined />,
            label: user?.roles?.includes('student') ? 'My Enrollments' : 'Children Enrollments',
            roles: ['student', 'parent'],
            link: '/my-enrollments'
        },

        // ==================== PARENT ONLY ====================
        {
            key: 'children',
            icon: <TeamOutlined />,
            label: 'My Children',
            roles: ['parent'],
            link: '/children'
        },
        {
            key: 'progress',
            icon: <BarChartOutlined />,
            label: 'Progress Reports',
            roles: ['parent'],
            link: '/progress'
        },

    ];

    /**
     * Filter menu items based on user role
     * Returns only items that the current user has access to
     */

    const getFilteredMenuItems = useMemo(() => {
        // Normalize user roles:
        // 1. If user.roles exists, use it.
        // 2. If user.role exists (singular), wrap in array.
        // 3. Otherwise empty array.
        let userRoles = [];
        if (user?.roles && Array.isArray(user.roles)) {
            userRoles = user.roles;
        } else if (user?.role) {
            userRoles = [user.role];
        }

        if (!user || userRoles.length === 0) return [];

        // Helper function to check if user has access to an item
        const hasAccess = (item) => {
            // If item has no role restrictions, allow access
            if (!item.roles || item.roles.length === 0) return true;

            // Check if user has ANY of the required roles for this item
            return item.roles.some(requiredRole => userRoles.includes(requiredRole));
        };

        // Filter top-level items
        const filteredItems = ALL_MENU_ITEMS.filter(item => hasAccess(item));

        // Filter children for items that have them
        return filteredItems.map(item => {
            if (item.children) {
                return {
                    ...item,
                    children: item.children.filter(child => hasAccess(child))
                };
            }
            return item;
        }).filter(item => {
            // Remove parent items that have no accessible children
            if (item.children) {
                return item.children.length > 0;
            }
            return true;
        });
    }, [user]);

    /**
     * Toggle dropdown menu
     */
    const toggleDropdown = (key) => {
        setOpenDropdown(openDropdown === key ? null : key);
    };

    /**
     * Handle navigation when menu item is clicked
     */
    const handleItemClick = (link) => {
        if (link) {
            navigate(link);
        }
        // Close mobile menu after navigation
        if (window.innerWidth <= 768 && onToggleCollapse) {
            onToggleCollapse();
        }
    };

    /**
     * Check if current route matches menu item
     */
    const isActive = (link) => {
        return location.pathname === link;
    };

    /**
     * Check if any child is active (for dropdown highlighting)
     */
    const hasActiveChild = (children) => {
        return children?.some(child => location.pathname === child.link);
    };

    /**
     * Handle logout
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Sider
            width={270}
            breakpoint="lg"
            collapsedWidth={85}
            collapsible
            collapsed={collapsed}
            onCollapse={onToggleCollapse}
            trigger={null}
            className={`sidebar ${collapsed ? 'collapsed' : ''}`}
            style={{
                background: '#151A2D',
                // Inline positioning styles removed to allow CSS control
            }}
        >

            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                {/* Mobile Menu Toggle */}
                <button
                    className="sidebar-menu-button"
                    onClick={onToggleCollapse}
                    style={{
                        display: window.innerWidth <= 768 ? 'flex' : 'none',
                        marginTop: '4rem'
                    }}
                >
                    <MenuOutlined />
                </button>

                {/* Sidebar Header with Toggle */}
                {/* <header className="sidebar-header">
                    <button
                        className="sidebar-toggler"
                        onClick={onToggleCollapse}
                    >
                        <LeftOutlined style={{
                            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }} />
                    </button>
                </header> */}

                {/* User Info Section */}
                <div className="user-info-section">

                    <button
                        className="sidebar-toggler"
                        onClick={onToggleCollapse}
                    >
                        <LeftOutlined style={{
                            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }} />
                    </button>

                    <div className={`user-avatar ${collapsed ? 'collapsed' : ''}`}>
                        <UserOutlined />
                    </div>

                    {!collapsed && (
                        <div className="user-details">
                            <h4 className="user-name">{user?.full_name || user?.name || 'User'}</h4>
                            <p className="user-role">
                                {user?.roles && user.roles.length > 0
                                    ? user.roles[0].replace('_', ' ').toUpperCase()
                                    : user?.role?.replace('_', ' ').toUpperCase() || 'N/A'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation Menu - FILTERED BY ROLE */}
                <nav className="sidebar-nav">
                    <ul className="nav-list primary-nav">
                        {getFilteredMenuItems.map(item => (
                            <li
                                key={item.key}
                                className={`nav-item ${item.children ? 'dropdown-container' : ''} ${openDropdown === item.key || hasActiveChild(item.children) ? 'open' : ''
                                    }`}
                            >
                                {item.children ? (
                                    <>
                                        {/* Dropdown Toggle */}
                                        <a
                                            href="#"
                                            className={`nav-link dropdown-toggle ${hasActiveChild(item.children) ? 'active' : ''
                                                }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleDropdown(item.key);
                                            }}
                                        >
                                            <span className="nav-icon">{item.icon}</span>
                                            {!collapsed && <span className="nav-label">{item.label}</span>}
                                            {!collapsed && (
                                                <span className="dropdown-icon">
                                                    <DownOutlined style={{
                                                        transform: openDropdown === item.key ? 'rotate(180deg)' : 'rotate(0deg)',
                                                        transition: 'transform 0.3s ease'
                                                    }} />
                                                </span>
                                            )}
                                        </a>

                                        {/* Dropdown Menu */}
                                        <ul className="dropdown-menu">
                                            {!collapsed && (
                                                <li className="nav-item">
                                                    <a className="nav-link dropdown-title">{item.label}</a>
                                                </li>
                                            )}
                                            {item.children.map(child => (
                                                <li key={child.key} className="nav-item">
                                                    <a
                                                        href={child.link || '#'}
                                                        className={`nav-link dropdown-link ${isActive(child.link) ? 'active' : ''
                                                            }`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleItemClick(child.link);
                                                        }}
                                                    >
                                                        {child.icon && <span className="nav-icon">{child.icon}</span>}
                                                        {child.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    // Regular Menu Item
                                    <a
                                        href={item.link || '#'}
                                        className={`nav-link ${isActive(item.link) ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleItemClick(item.link);
                                        }}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        {!collapsed && <span className="nav-label">{item.label}</span>}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Secondary Navigation - Always visible */}
                    <ul className="nav-list secondary-nav">
                        <li className="nav-item">
                            <a
                                href="/chat"
                                className="nav-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleItemClick('/chat');
                                }}
                            >
                                <span className="nav-icon"><WechatOutlined /></span>
                                {!collapsed && <span className="nav-label">{t('sidebar.chat') || 'Chat'}</span>}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                href="/storyteller"
                                className="nav-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleItemClick('/storyteller');
                                }}
                            >
                                <span className="nav-icon"><YuqueOutlined /></span>
                                {!collapsed && <span className="nav-label">{t('sidebar.storyteller') || 'Storyteller'}</span>}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                href="/login"
                                className="nav-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                }}
                            >
                                <span className="nav-icon"><LogoutOutlined /></span>
                                {!collapsed && <span className="nav-label">{t('sidebar.signout') || 'Sign Out'}</span>}
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
        </Sider>
    );
};

export default MainSideBar;