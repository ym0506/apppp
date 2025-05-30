import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('이름을 입력해주세요.');
            return false;
        }

        if (!formData.email.trim()) {
            setError('이메일을 입력해주세요.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('유효한 이메일 형식을 입력해주세요.');
            return false;
        }

        if (formData.password.length < 8) {
            setError('비밀번호는 8자 이상이어야 합니다.');
            return false;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('비밀번호는 영문, 숫자를 포함해야 합니다.');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setError('');
            setLoading(true);
            await register(formData.email, formData.password, formData.name);
            navigate('/login', {
                state: {
                    message: '회원가입이 완료되었습니다. 로그인해주세요.'
                }
            });
        } catch (error) {
            console.error('회원가입 오류:', error);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('이미 사용 중인 이메일입니다.');
                    break;
                case 'auth/weak-password':
                    setError('비밀번호가 너무 약합니다.');
                    break;
                case 'auth/invalid-email':
                    setError('유효하지 않은 이메일 형식입니다.');
                    break;
                default:
                    setError('회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* 상단 헤더 */}
            <header className="register-header">
                <div className="header-banner">
                    <span>Let's get cooking Let's get cooking Let's get cooking Let's get cooking</span>
                </div>
                <div className="header-top">
                    <div className="logo">
                        <img src="/images/cookmate-logo.png" alt="쿡메이트" />
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="register-main">
                {/* 배경 장식 원들 */}
                <div className="background-decorations">
                    <div className="circle circle-orange"></div>
                    <div className="circle circle-pink"></div>
                </div>

                {/* 회원가입 폼 */}
                <div className="register-form-container">
                    <h1 className="register-title">회원가입</h1>

                    {error && (
                        <div style={{
                            color: '#e53935',
                            fontSize: '14px',
                            textAlign: 'center',
                            marginBottom: '20px',
                            padding: '10px',
                            backgroundColor: 'rgba(229, 57, 53, 0.1)',
                            borderRadius: '10px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="register-form">
                        {/* 이름 입력 */}
                        <div className="input-group">
                            <label htmlFor="name" className="input-label">이름*</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="예) 홍길동"
                                    className="form-input"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* 이메일 입력 */}
                        <div className="input-group">
                            <label htmlFor="email" className="input-label required">이메일*</label>
                            <div className="input-container">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="예) user@example.com"
                                    className="form-input"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="input-group">
                            <label htmlFor="password" className="input-label">비밀번호*</label>
                            <div className="input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="영문, 숫자 포함 8~16자"
                                    className="form-input"
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    <i className={`eye-icon ${showPassword ? 'open' : 'closed'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* 비밀번호 확인 입력 */}
                        <div className="input-group">
                            <label htmlFor="confirmPassword" className="input-label">비밀번호 확인*</label>
                            <div className="input-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="비밀번호를 다시 입력해주세요"
                                    className="form-input"
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                >
                                    <i className={`eye-icon ${showConfirmPassword ? 'open' : 'closed'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* 회원가입 버튼 */}
                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                            style={{
                                backgroundColor: loading ? '#ccc' : '#e53935',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? '회원가입 중...' : '회원가입'}
                        </button>

                        {/* 로그인 링크 */}
                        <div style={{
                            textAlign: 'center',
                            marginTop: '20px',
                            fontSize: '14px'
                        }}>
                            이미 계정이 있으신가요?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: '#e53935',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}
                            >
                                로그인하기
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register; 