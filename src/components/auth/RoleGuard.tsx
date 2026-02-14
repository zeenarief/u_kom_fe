import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { JSX } from 'react';

interface RoleGuardProps {
    allowedRoles: string[];
    children?: JSX.Element;
}

const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
    const { activeRole } = useAuthStore();
    const location = useLocation();

    // If no active role or active role is not in allowed roles
    if (!activeRole || !allowedRoles.includes(activeRole)) {
        // Redirect to dashboard home which handles role-based redirection
        // Passing 'replace' to avoid building up history of failed attempts
        return <Navigate to="/dashboard" replace state={{ from: location }} />;
    }

    // If children are provided, render them (for wrapping a single route)
    // Otherwise render Outlet (for wrapping a group of routes)
    return children ? children : <Outlet />;
};

export default RoleGuard;
