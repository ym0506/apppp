import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfilePage = () => {
    const { currentUser, logout } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            setError('');
            await logout();
            navigate('/login');
        } catch (error) {
            setError('로그아웃에 실패했습니다.');
            console.error(error);
        }
    };

    // 로그인하지 않은 경우 로그인 페이지로 리디렉션
    if (!currentUser) {
        navigate('/login');
        return null;
    }

    return (
        <div className="app-container">
            <Header />

            <div style={{ padding: '20px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="profile-title">내 프로필</h1>

                {error && <div className="error-message">{error}</div>}

                <div className="profile-card" style={{ width: '100%', maxWidth: '500px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <div 
                            style={{ 
                                width: '60px', 
                                height: '60px', 
                                borderRadius: '50%', 
                                backgroundColor: '#f0f0f0', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                marginRight: '15px',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#555'
                            }}
                        >
                            {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
                        </div>
                        
                        <div>
                            <h2 style={{ margin: '0 0 5px 0' }}>{currentUser.displayName || '사용자'}</h2>
                            <p style={{ margin: '0', color: '#666' }}>{currentUser.email}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <h3>계정 정보</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>이메일</span>
                            <span>{currentUser.email}</span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>가입일</span>
                            <span>{currentUser.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : '-'}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                        <button 
                            onClick={handleLogout}
                            style={{
                                backgroundColor: '#ff5a5f',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>

            {/* 여백 (푸터 공간 확보) */}
            <div style={{ height: '120px' }}></div>

            <Footer />
        </div>
    );
};

export default ProfilePage; 