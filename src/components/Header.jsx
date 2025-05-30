import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = ({ showScrollBanner = false }) => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('로그아웃 오류:', error);
        }
    };

    return (
        <>
            {/* 메인 헤더 */}
            <div className="main-header">
                {/* 왼쪽 영역 */}
                <div className="header-left">
                    {/* 필요시 왼쪽 버튼 추가 가능 */}
                </div>

                {/* 중앙 로고 */}
                <div className="header-center">
                    <img
                        src="/images/home/logo.png"
                        alt="CookMate Logo"
                        className="main-logo"
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                {/* 오른쪽 인증 영역 */}
                <div className="header-right">
                    {currentUser ? (
                        <div className="auth-logged-in">
                            <div className="user-greeting">
                                안녕하세요, {currentUser.displayName || currentUser.email?.split('@')[0]}님
                            </div>
                            <div className="logout-btn" onClick={handleLogout}>
                                로그아웃
                            </div>
                        </div>
                    ) : (
                        <div className="auth-logged-out">
                            <span onClick={() => navigate('/login')}>로그인</span>
                            <span onClick={() => navigate('/register')}>회원가입</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 선택적 스크롤 배너 */}
            {showScrollBanner && (
                <div className="scroll-banner">
                    <div className="scroll-text">
                        LET'S GET COOKING • LET'S GET COOKING • LET'S GET COOKING • LET'S GET COOKING •
                    </div>
                </div>
            )}
        </>
    );
};

export default Header; 