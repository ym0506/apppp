import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 유효성 검사
        if (formData.password !== formData.confirmPassword) {
            return setError('비밀번호가 일치하지 않습니다.');
        }

        try {
            setError('');
            setLoading(true);
            
            // Firebase에 회원가입
            const { user } = await signup(formData.email, formData.password);
            
            // 사용자 프로필 업데이트
            await updateUserProfile(user, {
                displayName: formData.username
            });
            
            // 성공 시 홈페이지로 이동
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <Header />

            <div style={{ padding: '20px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="signup-title">회원가입</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '292px' }}>
                    {/* 사용자 이름 입력 */}
                    <div className="login-input">
                        <span className="login-input-label">사용자 이름</span>
                        <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>

                    {/* 이메일 입력 */}
                    <div className="login-input">
                        <span className="login-input-label">이메일</span>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div className="login-input">
                        <span className="login-input-label">비밀번호</span>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>

                    {/* 비밀번호 확인 입력 */}
                    <div className="login-input">
                        <span className="login-input-label">비밀번호 확인</span>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>

                    {/* 회원가입 버튼 */}
                    <button 
                        type="submit" 
                        className="login-button" 
                        disabled={loading}
                    >
                        {loading ? '처리 중...' : '회원가입'}
                    </button>

                    <div className="login-links">
                        <span>이미 계정이 있으신가요?</span>
                        <Link to="/login" className="login-link">
                            로그인하기
                        </Link>
                    </div>
                </form>
            </div>

            {/* 여백 (푸터 공간 확보) */}
            <div style={{ height: '120px' }}></div>

            <Footer />
        </div>
    );
};

export default SignupPage; 