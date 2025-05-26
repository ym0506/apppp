import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('로그인:', formData);
        // 여기서 API 호출하여 로그인 처리
    };

    return (
        <div className="app-container">
            <Header />

            <div style={{ padding: '20px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="login-logo"></div>

                <h1 className="login-title">
                    가장 편한 방법으로<br />시작해 보세요!
                </h1>

                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '292px' }}>
                    {/* ID 입력 */}
                    <div className="login-input">
                        <span className="login-input-label">ID</span>
                    </div>

                    {/* PASSWORD 입력 */}
                    <div className="login-input">
                        <span className="login-input-label">PASSWORD</span>
                    </div>

                    {/* 로그인 버튼 */}
                    <button type="submit" className="login-button">로그인</button>

                    <div className="login-links">
                        <Link to="/forgot-password" className="login-link">
                            비밀번호를 잊어버렸어요!
                        </Link>
                        <Link to="/signup" className="login-link">
                            회원가입
                        </Link>
                    </div>
                </form>

                <div style={{ marginTop: '20px' }}>
                    <p className="social-login-title">1초만에 로그인</p>

                    <div className="social-login-buttons">
                        {/* 카카오 */}
                        <div className="social-login-button kakao">K</div>

                        {/* 구글 */}
                        <div className="social-login-button google">G</div>

                        {/* 애플 */}
                        <div className="social-login-button apple">A</div>

                        {/* 네이버 */}
                        <div className="social-login-button naver">N</div>
                    </div>
                </div>
            </div>

            {/* 여백 (푸터 공간 확보) */}
            <div style={{ height: '120px' }}></div>

            <Footer />
        </div>
    );
};

export default LoginPage;