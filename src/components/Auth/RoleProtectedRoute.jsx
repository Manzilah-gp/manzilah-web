import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Spin } from "antd";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    // Check if user is authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required roles
    console.log('RoleProtectedRoute User:', user);
    const userRoles = user?.roles || []; // Safe access
    console.log('RoleProtectedRoute User Roles:', user?.roles);

    const hasRequiredRole = allowedRoles.some(role =>
        userRoles.includes(role)
    );

    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleProtectedRoute;