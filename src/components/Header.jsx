import React, { useState } from 'react';
import {
    Layout,
    Menu,
    Button,
    Select,
    Dropdown,
    Space,
    Avatar,
    Drawer
} from 'antd';
import {
    MenuOutlined,
    UserOutlined,
    LogoutOutlined,
    GlobalOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    BookOutlined,
    BankOutlined,
    FormOutlined
} from '@ant-design/icons';
import useAuth from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigate } from 'react-router-dom'; // Add this import

const { Header: AntHeader } = Layout;
const { Option } = Select;

const Header = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const { currentLanguage, changeLanguage, isRTL } = useLanguage();
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const navigate = useNavigate(); // Add this hook

    const navigationItems = [
        {
            key: 'home',
            label: t('header.home'),
            icon: <HomeOutlined />,
            onClick: () => navigate('/')
            // Add navigation
        },
        {
            key: 'about',
            label: t('header.about'),
            icon: <InfoCircleOutlined />,
            onClick: () => navigate('/about')
        },
        {
            key: 'courses',
            label: t('header.courses'),
            icon: <BookOutlined />,
            onClick: () => navigate('/courses')
        },
        {
            key: 'mosques',
            label: t('header.mosques'),
            icon: <BankOutlined />,
            onClick: () => navigate('/mosques')
        },
        {
            key: 'registration',
            label: t('header.registration'),
            icon: <FormOutlined />,
            onClick: () => navigate('/register') // This will navigate to /register
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: t('header.profile'),
            onClick: () => navigate('/profile')
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: t('header.logout'),
            onClick: logout,
            danger: true,
        },
    ];

    const menuItems = navigationItems.map(item => ({
        ...item,
        onClick: () => {
            item.onClick(); // Call the original navigation
            setMobileMenuVisible(false); // Close mobile menu
        },
    }));

    return (
        <>
            <AntHeader
                style={{
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    height: '64px',
                    width: '100%',
                }}
            >
                {/* Logo - Make it clickable */}
                <div
                    style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        minWidth: '120px',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/')}
                >
                    Manzilah
                </div>

                {/* Desktop Navigation */}
                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={navigationItems}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        flex: 1,
                        justifyContent: 'center',
                        minWidth: 0,
                    }}
                    disabledOverflow={false}
                />

                {/* Right Section */}
                <Space
                    size="middle"
                    style={{
                        marginLeft: 'auto',
                        minWidth: '120px',
                        justifyContent: 'flex-end'
                    }}
                >
                    {/* Language Selector */}
                    <Select
                        value={currentLanguage}
                        onChange={changeLanguage}
                        suffixIcon={<GlobalOutlined />}
                        style={{ width: 90 }}
                        size="small"
                        variant="filled"
                    >
                        <Option value="en">EN</Option>
                        <Option value="ar">AR</Option>
                    </Select>

                    {/* User Menu */}
                    {user ? (
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                            arrow
                        >
                            <Button
                                type="text"
                                icon={<UserOutlined />}
                                style={{ color: 'white' }}
                            >
                                {user.name}
                            </Button>
                        </Dropdown>
                    ) : (
                        <Button type="primary" onClick={() => navigate('/login')}>
                            {t('header.login')}
                        </Button>
                    )}

                    {/* Mobile Menu Button */}
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setMobileMenuVisible(true)}
                        className="mobile-menu-btn"
                    />
                </Space>
            </AntHeader>

            {/* Mobile Drawer */}
            <Drawer
                title="Menu"
                placement={isRTL ? 'left' : 'right'}
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                styles={{ body: { padding: 0 } }} // Fixed this line
            >
                <Menu
                    mode="vertical"
                    items={menuItems}
                    style={{ border: 'none' }}
                />
            </Drawer>
        </>
    );
};

export default Header;