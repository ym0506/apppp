import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ searchBar = false }) => {
    const { currentUser } = useAuth();

    return (
        <header className="header">
            <div className="header-links">
                {currentUser && (
                    <Link to="/profile" className="header-link">마이페이지</Link>
                )}
            </div>

            <Link to="/" className="logo">LOGO</Link>

            <div className="header-links">
                {currentUser ? (
                    <>
                        <Link to="/create" className="header-link">레시피 등록</Link>
                        <Link to="/profile" className="header-link">
                            {currentUser.displayName || '프로필'}
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/signup" className="header-link">회원가입</Link>
                        <Link to="/login" className="header-link">로그인</Link>
                    </>
                )}
            </div>

            {searchBar && (
                <div className="search-bar" style={{ position: 'absolute', bottom: '-15px', left: '50%', transform: 'translateX(-50%)', maxWidth: '90%', width: '391px', zIndex: 10 }}>
                    <input type="text" className="search-input" placeholder="오늘은 어떤 요리를 할까요?" />
                    <div className="search-icon">
                        <div className="search-dot"></div>
                        <div className="search-dot"></div>
                        <div className="search-dot"></div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header; 