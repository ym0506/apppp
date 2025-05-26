import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    
    if (!currentUser) {
        // 로그인하지 않은 경우 로그인 페이지로 리디렉션
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute; 