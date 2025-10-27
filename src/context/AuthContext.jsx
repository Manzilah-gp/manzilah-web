import React, { createContext, useState, useEffect } from "react";
import { getProfile } from "../api/auth"; // your API call to /profile

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // On app load, fetch user profile if token exists
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getProfile(token)
                .then((res) => {
                    setUser(res.data.user);
                })
                .catch(() => localStorage.removeItem("token"));
        }
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
