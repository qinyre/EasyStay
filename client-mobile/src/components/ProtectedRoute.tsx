import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from 'antd-mobile';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            Toast.show({
                content: '请先登录',
                position: 'bottom',
            });
        }
    }, [isLoading, isAuthenticated]);

    if (isLoading) {
        return <div className="p-10 text-center text-slate-500">Loading...</div>; // 简单的加载状态
    }

    if (!isAuthenticated) {
        // 重定向到登录页，并带上当前想要访问的路径
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <>{children}</>;
};
