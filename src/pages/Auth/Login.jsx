import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { loginUser } from "../../api/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useTranslation } from 'react-i18next';
import { Layout } from 'antd';
import './Auth.css'; // We'll create this CSS file
import loginImage from '../../Images/login.png';


const Login = () => {
    const { setUser } = useAuth();
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await loginUser(email, password);
            const { token, user } = res.data;

            localStorage.setItem("token", token);

            setUser({
                ...user,
                roles: user.roles,
                children: user.children || [],
            });

            navigate("/profile");
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout className="auth-layout">
            <Header />
            <div className="auth-container">
                <div className="auth-card with-image">
                    {/* Left Side - Image */}
                    <div className="auth-image-side">
                        <img src={loginImage} alt="Login Illustration" />
                    </div>

                    {/* Right Side - Form */}
                    <div className="auth-form-side">
                        <div className="auth-heading">{t('auth.signIn')}</div>
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <input
                                required
                                className="auth-input"
                                type="email"
                                name="email"
                                id="email"
                                placeholder={t('auth.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                required
                                className="auth-input"
                                type="password"
                                name="password"
                                id="password"
                                placeholder={t('auth.password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <span className="forgot-password">
                                <a href="#"
                                    onClick={(e) => { e.preventDefault(); navigate('/change-password') }}>
                                    {t('auth.forgotPassword')}
                                </a>
                            </span>

                            <button
                                className="auth-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Signing In..." : t('auth.signIn')}
                            </button>

                            {error && <div className="auth-error">{error}</div>}
                        </form>
                        <span className="agreement">
                            <a href="/register">{t('auth.registerNewAccount')}</a>
                        </span>
                    </div>
                </div>
            </div>
            <Footer />
        </Layout>
    );
};

export default Login;