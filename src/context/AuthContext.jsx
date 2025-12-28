import React, { createContext, useState, useEffect } from "react";
import { getProfile, loginUser } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        console.log("AuthContext: Initializing auth...");
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await getProfile(token);
                console.log("AuthContext: Profile loaded", res.data.user);
                setUser(res.data.user);
            } catch (error) {
                console.error("AuthContext: Profile load failed", error);
                localStorage.removeItem("token");
            }
        } else {
            console.log("AuthContext: No token found");
        }
        setLoading(false);
        console.log("AuthContext: Loading set to false");
    };

    const login = async (email, password) => {
        try {
            const response = await loginUser(email, password);
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            setUser(user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    const hasRole = (role) => {
        return user?.roles?.includes(role);
    };

    const hasAnyRole = (roles) => {
        return roles.some(role => user?.roles?.includes(role));
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            logout,
            loading,
            hasRole,
            hasAnyRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};