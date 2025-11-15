import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    // Check if user is authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required roles
    const hasRequiredRole = allowedRoles.some(role =>
        user.roles.includes(role)
    );

    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleProtectedRoute;