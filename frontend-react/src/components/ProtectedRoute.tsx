import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAdmin = false
}) => {
    const { isAuthenticated, admin, isLoading } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !admin) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Check for admin role if required
    if (requireAdmin && admin.role !== 'admin' && admin.role !== 'super_admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;