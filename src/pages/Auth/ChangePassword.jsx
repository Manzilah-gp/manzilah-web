import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword, sendVerificationCode } from "../../api/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useTranslation } from 'react-i18next';
import { Layout, message } from 'antd';
import './Auth.css';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Send Code, 2: Change Password
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleSendCode = async () => {
        if (!email) {
            setError(t('auth.emailRequired') || "Email is required");
            return;
        }

        setLoading(true);
        setError("");
        setMessageText("");
        try {
            await sendVerificationCode(email);
            setMessageText(t('auth.codeSent') || "Verification code sent to your email.");
            setStep(2);
        } catch (err) {
            console.error("Send code error:", err);
            setError(err.response?.data?.message || "Failed to send verification code.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (newPassword !== confirmPassword) {
            setError(t('auth.passwordsDoNotMatch') || "Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            // New flow: send email + code + newPassword
            await changePassword({ email, code: verificationCode, newPassword });
            message.success(t('auth.passwordChangedSuccess') || "Password changed successfully");
            navigate("/login");
        } catch (err) {
            console.error("Change password error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout className="auth-layout">
            <Header />
            <div className="auth-container">
                <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto', display: 'block' }}>
                    <div className="auth-form-side" style={{ width: '100%', padding: '40px' }}>
                        <div className="auth-heading">{t('auth.changePassword') || "Change Password"}</div>

                        {step === 1 ? (
                            <div className="auth-step">
                                <p style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>
                                    {t('auth.enterEmail') || "Enter your email address to receive a verification code."}
                                </p>
                                <div className="input-group">
                                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{t('auth.email') || "Email"}</label>
                                    <input
                                        required
                                        className="auth-input"
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder={t('auth.enterEmail') || "Enter Email Address"}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="auth-button"
                                    onClick={handleSendCode}
                                    disabled={loading}
                                    type="button"
                                    style={{ marginTop: '15px' }}
                                >
                                    {loading ? (t('auth.sending') || "Sending...") : (t('auth.sendVerificationCode') || "Send Verification Code")}
                                </button>
                                {error && <div className="auth-error" style={{ marginTop: '15px' }}>{error}</div>}
                            </div>
                        ) : (
                            <form className="auth-form" onSubmit={handleSubmit}>
                                {messageText && <div className="auth-success-message" style={{ color: 'green', marginBottom: '15px', textAlign: 'center' }}>{messageText}</div>}

                                <div className="input-group">
                                    <label htmlFor="verificationCode" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{t('auth.verificationCode') || "Verification Code"}</label>
                                    <input
                                        required
                                        className="auth-input"
                                        type="text"
                                        name="verificationCode"
                                        id="verificationCode"
                                        placeholder={t('auth.enterCode') || "Enter 6-digit Code"}
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{t('auth.newPassword') || "New Password"}</label>
                                    <input
                                        required
                                        className="auth-input"
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        placeholder={t('auth.newPassword') || "New Password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{t('auth.confirmNewPassword') || "Confirm New Password"}</label>
                                    <input
                                        required
                                        className="auth-input"
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder={t('auth.confirmNewPassword') || "Confirm New Password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <button
                                    className="auth-button"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (t('auth.processing') || "Processing...") : (t('auth.changePassword') || "Change Password")}
                                </button>

                                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        style={{ background: 'none', border: 'none', color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        {t('auth.resendCode') || "Resend Code"}
                                    </button>
                                </div>

                                {error && <div className="auth-error">{error}</div>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </Layout>
    );
};

export default ChangePassword;
