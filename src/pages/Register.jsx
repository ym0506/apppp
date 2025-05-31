import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
    const [touched, setTouched] = useState({});

    // 폼 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

    const isNameValid = formData.name.trim().length >= 2;
    const isEmailValid = emailRegex.test(formData.email);
    const isPasswordValid = passwordRegex.test(formData.password);
    const isConfirmPasswordValid = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
    const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // 에러 초기화
        if (error) setError('');
    };

    const handleBlur = (field) => {
        setTouched({
            ...touched,
            [field]: true
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

        if (!emailRegex.test(formData.email)) {
            setError('유효한 이메일 형식을 입력해주세요.');
            return false;
        }

        if (formData.password.length < 8) {
            setError('비밀번호는 8자 이상이어야 합니다.');
            return false;
        }

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

    const getPasswordStrength = () => {
        if (formData.password.length === 0) return { level: 0, text: '', color: '#e0e0e0' };
        if (formData.password.length < 4) return { level: 1, text: '매우 약함', color: '#f44336' };
        if (formData.password.length < 6) return { level: 2, text: '약함', color: '#ff9800' };
        if (formData.password.length < 8) return { level: 3, text: '보통', color: '#ffc107' };
        if (passwordRegex.test(formData.password)) return { level: 4, text: '강함', color: '#4caf50' };
        return { level: 3, text: '보통', color: '#ffc107' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <>
            <div className="register-page">
                {/* 배경 장식 - 플로팅 원들 */}
                <div className="floating-decorations">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                    <div className="decoration-circle circle-4"></div>
                    <div className="decoration-circle circle-5"></div>
                </div>

                <div className="register-container">
                    {/* 헤더 섹션 */}
                    <div className="register-header">
                        {/* 로고/브랜드 */}
                        <div className="brand-section">
                            <div className="brand-logo">🍽️</div>
                            <h1 className="brand-title">레시피 공유</h1>
                            <p className="brand-subtitle">요리의 즐거움을 함께 나누어보세요</p>
                        </div>

                        {/* 캐릭터와 인사말 섹션 */}
                        <div className="character-section">
                            <div className="character-container">
                                <div className="character-card">
                                    <img
                                        src="/images/register/character.png"
                                        alt="회원가입 캐릭터"
                                        className="character-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="character-fallback">
                                        👨‍🍳
                                    </div>
                                </div>

                                {/* 말풍선 */}
                                <div className="speech-bubble">
                                    새로운 셰프님 환영합니다! 🎉
                                    <div className="bubble-tail"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 회원가입 폼 */}
                    <div className="register-form-section">
                        <div className="form-container">
                            <div className="form-header">
                                <h2 className="form-title">회원가입</h2>
                                <p className="form-subtitle">계정을 생성하여 레시피 공유를 시작하세요</p>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <span className="error-icon">⚠️</span>
                                    <span className="error-text">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="register-form">
                                {/* 이름 입력 */}
                                <div className="input-group">
                                    <label className="input-label">이름</label>
                                    <div className={`input-wrapper ${touched.name && !isNameValid ? 'error' : touched.name && isNameValid ? 'success' : ''}`}>
                                        <span className="input-icon">👤</span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('name')}
                                            placeholder="이름을 입력하세요"
                                            className="form-input"
                                            disabled={loading}
                                            required
                                        />
                                        {touched.name && isNameValid && (
                                            <span className="validation-icon success">✓</span>
                                        )}
                                        {touched.name && !isNameValid && formData.name && (
                                            <span className="validation-icon error">✗</span>
                                        )}
                                    </div>
                                    {touched.name && !isNameValid && formData.name && (
                                        <span className="input-error">이름은 2자 이상이어야 합니다</span>
                                    )}
                                </div>

                                {/* 이메일 입력 */}
                                <div className="input-group">
                                    <label className="input-label">이메일</label>
                                    <div className={`input-wrapper ${touched.email && !isEmailValid ? 'error' : touched.email && isEmailValid ? 'success' : ''}`}>
                                        <span className="input-icon">📧</span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('email')}
                                            placeholder="이메일을 입력하세요"
                                            className="form-input"
                                            disabled={loading}
                                            required
                                        />
                                        {touched.email && isEmailValid && (
                                            <span className="validation-icon success">✓</span>
                                        )}
                                        {touched.email && !isEmailValid && formData.email && (
                                            <span className="validation-icon error">✗</span>
                                        )}
                                    </div>
                                    {touched.email && !isEmailValid && formData.email && (
                                        <span className="input-error">올바른 이메일 형식을 입력해주세요</span>
                                    )}
                                </div>

                                {/* 비밀번호 입력 */}
                                <div className="input-group">
                                    <label className="input-label">비밀번호</label>
                                    <div className={`input-wrapper ${touched.password && !isPasswordValid ? 'error' : touched.password && isPasswordValid ? 'success' : ''}`}>
                                        <span className="input-icon">🔒</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('password')}
                                            placeholder="영문, 숫자 포함 8자 이상"
                                            className="form-input"
                                            disabled={loading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="password-toggle"
                                            disabled={loading}
                                        >
                                            {showPassword ? '🙈' : '👁️'}
                                        </button>
                                    </div>

                                    {/* 비밀번호 강도 표시 */}
                                    {formData.password && (
                                        <div className="password-strength">
                                            <div className="strength-bar">
                                                {[1, 2, 3, 4].map(level => (
                                                    <div
                                                        key={level}
                                                        className={`strength-segment ${level <= passwordStrength.level ? 'active' : ''}`}
                                                        style={{
                                                            backgroundColor: level <= passwordStrength.level ? passwordStrength.color : '#e0e0e0'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span
                                                className="strength-text"
                                                style={{ color: passwordStrength.color }}
                                            >
                                                {passwordStrength.text}
                                            </span>
                                        </div>
                                    )}

                                    {touched.password && !isPasswordValid && formData.password && (
                                        <span className="input-error">영문, 숫자를 포함하여 8자 이상 입력해주세요</span>
                                    )}
                                </div>

                                {/* 비밀번호 확인 입력 */}
                                <div className="input-group">
                                    <label className="input-label">비밀번호 확인</label>
                                    <div className={`input-wrapper ${touched.confirmPassword && !isConfirmPasswordValid ? 'error' : touched.confirmPassword && isConfirmPasswordValid ? 'success' : ''}`}>
                                        <span className="input-icon">🔒</span>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('confirmPassword')}
                                            placeholder="비밀번호를 다시 입력하세요"
                                            className="form-input"
                                            disabled={loading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="password-toggle"
                                            disabled={loading}
                                        >
                                            {showConfirmPassword ? '🙈' : '👁️'}
                                        </button>
                                        {touched.confirmPassword && isConfirmPasswordValid && (
                                            <span className="validation-icon success">✓</span>
                                        )}
                                        {touched.confirmPassword && !isConfirmPasswordValid && formData.confirmPassword && (
                                            <span className="validation-icon error">✗</span>
                                        )}
                                    </div>
                                    {touched.confirmPassword && !isConfirmPasswordValid && formData.confirmPassword && (
                                        <span className="input-error">비밀번호가 일치하지 않습니다</span>
                                    )}
                                </div>

                                {/* 회원가입 버튼 */}
                                <button
                                    type="submit"
                                    disabled={loading || !isFormValid}
                                    className={`register-button ${loading ? 'loading' : ''} ${!isFormValid ? 'disabled' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            계정 생성 중...
                                        </>
                                    ) : (
                                        <>
                                            <span className="button-icon">🎉</span>
                                            회원가입
                                        </>
                                    )}
                                </button>

                                {/* 로그인 링크 */}
                                <div className="form-links">
                                    <div className="login-prompt">
                                        이미 계정이 있으신가요?{' '}
                                        <Link to="/login" className="login-link">
                                            로그인
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* 푸터 섹션 */}
                    <div className="register-footer">
                        <p className="footer-text">
                            레시피 공유 플랫폼에서<br />
                            새로운 요리 여행을 시작하세요! ✨
                        </p>
                        <div className="footer-benefits">
                            <div className="benefit-item">
                                <span className="benefit-icon">📝</span>
                                <span className="benefit-text">레시피 작성</span>
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">❤️</span>
                                <span className="benefit-text">레시피 찜</span>
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">👥</span>
                                <span className="benefit-text">커뮤니티 참여</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 스타일링 */}
            <style jsx>{`
                .register-page {
                    min-height: 100vh;
                    background: linear-gradient(145deg, #f8f9fa 0%, #e3f2fd 30%, #f3e5f5 70%, #fff3e0 100%);
                    position: relative;
                    overflow: hidden;
                }

                .floating-decorations {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 1;
                }

                .decoration-circle {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(20px);
                    opacity: 0.6;
                }

                .circle-1 {
                    top: 8%;
                    left: -50px;
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, rgba(156, 39, 176, 0.3), rgba(233, 30, 99, 0.2));
                    animation: float 7s ease-in-out infinite;
                }

                .circle-2 {
                    top: 12%;
                    right: -30px;
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, rgba(33, 150, 243, 0.3), rgba(3, 169, 244, 0.2));
                    animation: float 9s ease-in-out infinite 2s;
                }

                .circle-3 {
                    bottom: 35%;
                    left: 5%;
                    width: 70px;
                    height: 70px;
                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.25), rgba(139, 195, 74, 0.15));
                    animation: float 6s ease-in-out infinite 1s;
                }

                .circle-4 {
                    bottom: 15%;
                    right: 10%;
                    width: 90px;
                    height: 90px;
                    background: linear-gradient(135deg, rgba(255, 152, 0, 0.25), rgba(255, 193, 7, 0.15));
                    animation: float 8s ease-in-out infinite 3s;
                }

                .circle-5 {
                    top: 45%;
                    left: 8%;
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, rgba(255, 87, 34, 0.2), rgba(255, 138, 101, 0.1));
                    animation: float 5s ease-in-out infinite 4s;
                }

                .register-container {
                    position: relative;
                    z-index: 2;
                    max-width: 420px;
                    margin: 0 auto;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                .register-header {
                    padding-top: 30px;
                    margin-bottom: 30px;
                }

                .brand-section {
                    text-align: center;
                    margin-bottom: 30px;
                    animation: fadeInUp 0.8s ease-out;
                }

                .brand-logo {
                    font-size: 40px;
                    margin-bottom: 12px;
                    animation: bounce 2s ease-in-out infinite;
                }

                .brand-title {
                    font-size: 24px;
                    font-weight: 800;
                    color: #6a1b9a;
                    margin: 0 0 6px 0;
                    letter-spacing: -0.02em;
                }

                .brand-subtitle {
                    font-size: 13px;
                    color: #666;
                    margin: 0;
                    font-weight: 500;
                }

                .character-section {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                    animation: fadeInUp 0.8s ease-out 0.2s both;
                }

                .character-container {
                    position: relative;
                }

                .character-card {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(243, 229, 245, 0.7));
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 25px rgba(106, 27, 154, 0.15);
                    animation: float 4s ease-in-out infinite;
                    position: relative;
                }

                .character-image {
                    width: 64px;
                    height: 64px;
                    object-fit: contain;
                    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.1));
                }

                .character-fallback {
                    width: 64px;
                    height: 64px;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    background: linear-gradient(135deg, #ba68c8, #ab47bc);
                    border-radius: 12px;
                }

                .speech-bubble {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(243, 229, 245, 0.9));
                    backdrop-filter: blur(15px);
                    border-radius: 12px;
                    padding: 10px 16px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #6a1b9a;
                    box-shadow: 0 6px 20px rgba(106, 27, 154, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    white-space: nowrap;
                    animation: fadeInUp 0.8s ease-out 0.5s both;
                }

                .bubble-tail {
                    position: absolute;
                    bottom: -5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 10px;
                    height: 10px;
                    background: inherit;
                    border-radius: 0 0 10px 0;
                    border-right: 1px solid rgba(255, 255, 255, 0.5);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
                }

                .register-form-section {
                    flex: 1;
                    margin-bottom: 30px;
                }

                .form-container {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(243, 229, 245, 0.8));
                    backdrop-filter: blur(25px);
                    border-radius: 20px;
                    padding: 28px 24px;
                    box-shadow: 0 12px 40px rgba(106, 27, 154, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    animation: fadeInUp 0.8s ease-out 0.4s both;
                }

                .form-header {
                    text-align: center;
                    margin-bottom: 28px;
                }

                .form-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #333;
                    margin: 0 0 6px 0;
                    letter-spacing: -0.01em;
                }

                .form-subtitle {
                    font-size: 13px;
                    color: #666;
                    margin: 0;
                    font-weight: 500;
                }

                .error-message {
                    background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(255, 82, 82, 0.05));
                    border: 1px solid rgba(244, 67, 54, 0.2);
                    border-radius: 10px;
                    padding: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    animation: shake 0.5s ease-out;
                }

                .error-icon {
                    font-size: 16px;
                }

                .error-text {
                    font-size: 13px;
                    color: #d32f2f;
                    font-weight: 500;
                }

                .register-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .input-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #444;
                    margin-bottom: 2px;
                }

                .input-wrapper {
                    position: relative;
                    background: rgba(255, 255, 255, 0.8);
                    border: 2px solid rgba(106, 27, 154, 0.1);
                    border-radius: 14px;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .input-wrapper:focus-within {
                    border-color: #6a1b9a;
                    box-shadow: 0 0 0 3px rgba(106, 27, 154, 0.1);
                    transform: translateY(-1px);
                }

                .input-wrapper.success {
                    border-color: #4caf50;
                }

                .input-wrapper.error {
                    border-color: #f44336;
                }

                .input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 14px;
                    z-index: 2;
                }

                .form-input {
                    width: 100%;
                    padding: 14px 18px 14px 40px;
                    font-size: 15px;
                    font-weight: 500;
                    color: #333;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-family: inherit;
                }

                .form-input::placeholder {
                    color: #999;
                    font-weight: 400;
                }

                .form-input:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .password-toggle {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    font-size: 14px;
                    cursor: pointer;
                    padding: 3px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }

                .password-toggle:hover {
                    background: rgba(106, 27, 154, 0.1);
                }

                .validation-icon {
                    position: absolute;
                    right: 44px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 14px;
                    font-weight: 600;
                }

                .validation-icon.success {
                    color: #4caf50;
                }

                .validation-icon.error {
                    color: #f44336;
                }

                .input-error {
                    font-size: 11px;
                    color: #f44336;
                    font-weight: 500;
                }

                .password-strength {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 4px;
                }

                .strength-bar {
                    display: flex;
                    gap: 2px;
                    flex: 1;
                }

                .strength-segment {
                    height: 4px;
                    border-radius: 2px;
                    flex: 1;
                    transition: all 0.3s ease;
                }

                .strength-text {
                    font-size: 11px;
                    font-weight: 600;
                    min-width: 50px;
                    text-align: right;
                }

                .register-button {
                    background: linear-gradient(135deg, #6a1b9a, #8e24aa);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    padding: 16px 20px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    position: relative;
                    overflow: hidden;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    box-shadow: 0 6px 20px rgba(106, 27, 154, 0.3);
                    margin-top: 8px;
                }

                .register-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 28px rgba(106, 27, 154, 0.4);
                }

                .register-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .register-button.disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .register-button.loading {
                    cursor: not-allowed;
                }

                .button-icon {
                    font-size: 16px;
                }

                .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .form-links {
                    display: flex;
                    justify-content: center;
                    margin-top: 4px;
                }

                .login-prompt {
                    font-size: 13px;
                    color: #666;
                    text-align: center;
                }

                .login-link {
                    color: #6a1b9a;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }

                .login-link:hover {
                    color: #4a148c;
                    text-decoration: underline;
                }

                .register-footer {
                    text-align: center;
                    animation: fadeInUp 0.8s ease-out 0.6s both;
                }

                .footer-text {
                    font-size: 13px;
                    color: #666;
                    margin: 0 0 20px 0;
                    line-height: 1.4;
                    font-weight: 500;
                }

                .footer-benefits {
                    display: flex;
                    justify-content: center;
                    gap: 24px;
                    margin-bottom: 16px;
                }

                .benefit-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }

                .benefit-icon {
                    font-size: 20px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(243, 229, 245, 0.6));
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(106, 27, 154, 0.1);
                }

                .benefit-text {
                    font-size: 11px;
                    color: #666;
                    font-weight: 500;
                }

                /* 애니메이션 */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }

                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                    40%, 43% { transform: translateY(-6px); }
                    70% { transform: translateY(-3px); }
                    90% { transform: translateY(-1px); }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-3px); }
                    75% { transform: translateX(3px); }
                }

                /* 반응형 */
                @media (max-width: 480px) {
                    .register-container {
                        padding: 16px;
                    }

                    .form-container {
                        padding: 24px 20px;
                    }

                    .brand-title {
                        font-size: 20px;
                    }

                    .character-card {
                        width: 80px;
                        height: 80px;
                    }

                    .character-image,
                    .character-fallback {
                        width: 48px;
                        height: 48px;
                        font-size: 28px;
                    }

                    .footer-benefits {
                        gap: 16px;
                    }

                    .benefit-icon {
                        width: 32px;
                        height: 32px;
                        font-size: 16px;
                    }
                }
            `}</style>
        </>
    );
};

export default Register; 