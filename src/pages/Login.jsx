import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    // 폼 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 6;
    const isFormValid = isEmailValid && isPasswordValid;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        if (!isFormValid) {
            setError('이메일 형식이 올바르지 않거나 비밀번호가 너무 짧습니다.');
            return;
        }

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (error) {
            console.error('로그인 오류:', error);
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('존재하지 않는 계정입니다.');
                    break;
                case 'auth/wrong-password':
                    setError('비밀번호가 틀렸습니다.');
                    break;
                case 'auth/invalid-email':
                    setError('유효하지 않은 이메일 형식입니다.');
                    break;
                case 'auth/too-many-requests':
                    setError('너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
                    break;
                default:
                    setError('로그인에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await googleLogin();
            navigate('/');
        } catch (error) {
            console.error('구글 로그인 오류:', error);
            setError('구글 로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login-page">
                {/* 배경 장식 - 플로팅 원들 */}
                <div className="floating-decorations">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                    <div className="decoration-circle circle-4"></div>
                    <div className="decoration-circle circle-5"></div>
                </div>

                <div className="login-container">
                    {/* 헤더 섹션 */}
                    <div className="login-header">
                        {/* 로고/브랜드 */}
                        <div className="brand-section">
                            <div className="brand-logo">🍽️</div>
                            <h1 className="brand-title">레시피 공유</h1>
                            <p className="brand-subtitle">나만의 요리를 세상과 공유하세요</p>
                        </div>

                        {/* 캐릭터와 인사말 섹션 */}
                        <div className="character-section">
                            <div className="character-container">
                                <div className="character-card">
                                    <img
                                        src="/images/login/character.png"
                                        alt="로그인 캐릭터"
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
                                    안녕하세요 셰프님! 👋
                                    <div className="bubble-tail"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 로그인 폼 */}
                    <div className="login-form-section">
                        <div className="form-container">
                            <div className="form-header">
                                <h2 className="form-title">로그인</h2>
                                <p className="form-subtitle">계정에 로그인하여 레시피를 관리하세요</p>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <span className="error-icon">⚠️</span>
                                    <span className="error-text">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="login-form">
                                {/* 이메일 입력 */}
                                <div className="input-group">
                                    <label className="input-label">이메일</label>
                                    <div className={`input-wrapper ${emailTouched && !isEmailValid ? 'error' : emailTouched && isEmailValid ? 'success' : ''}`}>
                                        <span className="input-icon">📧</span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onBlur={() => setEmailTouched(true)}
                                            placeholder="이메일을 입력하세요"
                                            className="form-input"
                                            disabled={loading}
                                            required
                                        />
                                        {emailTouched && isEmailValid && (
                                            <span className="validation-icon success">✓</span>
                                        )}
                                        {emailTouched && !isEmailValid && email && (
                                            <span className="validation-icon error">✗</span>
                                        )}
                                    </div>
                                    {emailTouched && !isEmailValid && email && (
                                        <span className="input-error">올바른 이메일 형식을 입력해주세요</span>
                                    )}
                                </div>

                                {/* 비밀번호 입력 */}
                                <div className="input-group">
                                    <label className="input-label">비밀번호</label>
                                    <div className={`input-wrapper ${passwordTouched && !isPasswordValid ? 'error' : passwordTouched && isPasswordValid ? 'success' : ''}`}>
                                        <span className="input-icon">🔒</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onBlur={() => setPasswordTouched(true)}
                                            placeholder="비밀번호를 입력하세요"
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
                                    {passwordTouched && !isPasswordValid && password && (
                                        <span className="input-error">비밀번호는 최소 6자 이상이어야 합니다</span>
                                    )}
                                </div>

                                {/* 로그인 버튼 */}
                                <button
                                    type="submit"
                                    disabled={loading || !isFormValid}
                                    className={`login-button ${loading ? 'loading' : ''} ${!isFormValid ? 'disabled' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            로그인 중...
                                        </>
                                    ) : (
                                        <>
                                            <span className="button-icon">🚀</span>
                                            로그인
                                        </>
                                    )}
                                </button>

                                {/* 구분선 */}
                                <div className="divider">
                                    <span className="divider-text">또는</span>
                                </div>

                                {/* 구글 로그인 */}
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="google-login-button"
                                >
                                    <img
                                        src="/images/login/google-icon.png"
                                        alt="Google"
                                        className="google-icon"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'inline';
                                        }}
                                    />
                                    <span className="google-fallback">🌐</span>
                                    구글로 로그인
                                </button>

                                {/* 추가 링크들 */}
                                <div className="form-links">
                                    <Link to="/forgot-password" className="forgot-link">
                                        비밀번호를 잊으셨나요?
                                    </Link>
                                    <div className="signup-prompt">
                                        계정이 없으신가요?{' '}
                                        <Link to="/register" className="signup-link">
                                            회원가입
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* 푸터 섹션 */}
                    <div className="login-footer">
                        <p className="footer-text">
                            레시피 공유 플랫폼과 함께<br />
                            맛있는 요리의 세계로 떠나보세요! 🌟
                        </p>
                        <div className="footer-stats">
                            <div className="stat-item">
                                <span className="stat-number">1,247</span>
                                <span className="stat-label">레시피</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">3,924</span>
                                <span className="stat-label">셰프</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">15,638</span>
                                <span className="stat-label">요리</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 스타일링 */}
            <style jsx>{`
                .login-page {
                    min-height: 100vh;
                    background: linear-gradient(145deg, #fff8f0 0%, #fef3e8 30%, #fff8f0 70%, #fef7f0 100%);
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
                    top: 10%;
                    left: -60px;
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, rgba(255, 138, 101, 0.3), rgba(255, 107, 71, 0.2));
                    animation: float 6s ease-in-out infinite;
                }

                .circle-2 {
                    top: 15%;
                    right: -40px;
                    width: 140px;
                    height: 140px;
                    background: linear-gradient(135deg, rgba(255, 167, 38, 0.3), rgba(255, 204, 128, 0.2));
                    animation: float 8s ease-in-out infinite 2s;
                }

                .circle-3 {
                    bottom: 40%;
                    left: 10%;
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, rgba(255, 107, 71, 0.25), rgba(255, 87, 34, 0.15));
                    animation: float 7s ease-in-out infinite 1s;
                }

                .circle-4 {
                    bottom: 20%;
                    right: 15%;
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, rgba(255, 193, 7, 0.25), rgba(255, 235, 59, 0.15));
                    animation: float 9s ease-in-out infinite 3s;
                }

                .circle-5 {
                    top: 50%;
                    left: 5%;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, rgba(233, 30, 99, 0.2), rgba(244, 67, 54, 0.1));
                    animation: float 5s ease-in-out infinite 4s;
                }

                .login-container {
                    position: relative;
                    z-index: 2;
                    max-width: 420px;
                    margin: 0 auto;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                .login-header {
                    padding-top: 40px;
                    margin-bottom: 30px;
                }

                .brand-section {
                    text-align: center;
                    margin-bottom: 40px;
                    animation: fadeInUp 0.8s ease-out;
                }

                .brand-logo {
                    font-size: 48px;
                    margin-bottom: 16px;
                    animation: bounce 2s ease-in-out infinite;
                }

                .brand-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: #ff6b47;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.02em;
                }

                .brand-subtitle {
                    font-size: 14px;
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
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 249, 245, 0.7));
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 12px 32px rgba(255, 107, 71, 0.15);
                    animation: float 4s ease-in-out infinite;
                    position: relative;
                }

                .character-image {
                    width: 80px;
                    height: 80px;
                    object-fit: contain;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
                }

                .character-fallback {
                    width: 80px;
                    height: 80px;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                    background: linear-gradient(135deg, #ffab8e, #ff8a65);
                    border-radius: 16px;
                }

                .speech-bubble {
                    position: absolute;
                    top: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 249, 245, 0.9));
                    backdrop-filter: blur(15px);
                    border-radius: 16px;
                    padding: 12px 20px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #ff6b47;
                    box-shadow: 0 8px 24px rgba(255, 107, 71, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    white-space: nowrap;
                    animation: fadeInUp 0.8s ease-out 0.5s both;
                }

                .bubble-tail {
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 12px;
                    height: 12px;
                    background: inherit;
                    border-radius: 0 0 12px 0;
                    border-right: 1px solid rgba(255, 255, 255, 0.5);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
                }

                .login-form-section {
                    flex: 1;
                    margin-bottom: 30px;
                }

                .form-container {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 249, 245, 0.8));
                    backdrop-filter: blur(25px);
                    border-radius: 24px;
                    padding: 32px 28px;
                    box-shadow: 0 16px 48px rgba(255, 107, 71, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    animation: fadeInUp 0.8s ease-out 0.4s both;
                }

                .form-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .form-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.01em;
                }

                .form-subtitle {
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                    font-weight: 500;
                }

                .error-message {
                    background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(255, 82, 82, 0.05));
                    border: 1px solid rgba(244, 67, 54, 0.2);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: shake 0.5s ease-out;
                }

                .error-icon {
                    font-size: 18px;
                }

                .error-text {
                    font-size: 14px;
                    color: #d32f2f;
                    font-weight: 500;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .input-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #444;
                    margin-bottom: 4px;
                }

                .input-wrapper {
                    position: relative;
                    background: rgba(255, 255, 255, 0.8);
                    border: 2px solid rgba(255, 107, 71, 0.1);
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .input-wrapper:focus-within {
                    border-color: #ff6b47;
                    box-shadow: 0 0 0 4px rgba(255, 107, 71, 0.1);
                    transform: translateY(-2px);
                }

                .input-wrapper.success {
                    border-color: #4caf50;
                }

                .input-wrapper.error {
                    border-color: #f44336;
                }

                .input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 16px;
                    z-index: 2;
                }

                .form-input {
                    width: 100%;
                    padding: 16px 20px 16px 48px;
                    font-size: 16px;
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
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }

                .password-toggle:hover {
                    background: rgba(255, 107, 71, 0.1);
                }

                .validation-icon {
                    position: absolute;
                    right: 50px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 16px;
                    font-weight: 600;
                }

                .validation-icon.success {
                    color: #4caf50;
                }

                .validation-icon.error {
                    color: #f44336;
                }

                .input-error {
                    font-size: 12px;
                    color: #f44336;
                    font-weight: 500;
                }

                .login-button {
                    background: linear-gradient(135deg, #ff6b47, #ff8a65);
                    color: white;
                    border: none;
                    border-radius: 16px;
                    padding: 18px 24px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    position: relative;
                    overflow: hidden;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    box-shadow: 0 8px 24px rgba(255, 107, 71, 0.3);
                }

                .login-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(255, 107, 71, 0.4);
                }

                .login-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .login-button.disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .login-button.loading {
                    cursor: not-allowed;
                }

                .button-icon {
                    font-size: 18px;
                }

                .loading-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .divider {
                    position: relative;
                    text-align: center;
                    margin: 8px 0;
                }

                .divider::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255, 107, 71, 0.2), transparent);
                }

                .divider-text {
                    background: white;
                    padding: 0 16px;
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                    position: relative;
                }

                .google-login-button {
                    background: rgba(255, 255, 255, 0.9);
                    color: #333;
                    border: 2px solid rgba(255, 107, 71, 0.1);
                    border-radius: 16px;
                    padding: 16px 24px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    backdrop-filter: blur(10px);
                }

                .google-login-button:hover:not(:disabled) {
                    border-color: #ff6b47;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(255, 107, 71, 0.15);
                }

                .google-icon {
                    width: 20px;
                    height: 20px;
                }

                .google-fallback {
                    font-size: 20px;
                    display: none;
                }

                .form-links {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    align-items: center;
                }

                .forgot-link {
                    color: #ff6b47;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .forgot-link:hover {
                    color: #ff5722;
                    text-decoration: underline;
                }

                .signup-prompt {
                    font-size: 14px;
                    color: #666;
                    text-align: center;
                }

                .signup-link {
                    color: #ff6b47;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }

                .signup-link:hover {
                    color: #ff5722;
                    text-decoration: underline;
                }

                .login-footer {
                    text-align: center;
                    animation: fadeInUp 0.8s ease-out 0.6s both;
                }

                .footer-text {
                    font-size: 14px;
                    color: #666;
                    margin: 0 0 24px 0;
                    line-height: 1.5;
                    font-weight: 500;
                }

                .footer-stats {
                    display: flex;
                    justify-content: center;
                    gap: 32px;
                    margin-bottom: 20px;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }

                .stat-number {
                    font-size: 20px;
                    font-weight: 800;
                    color: #ff6b47;
                }

                .stat-label {
                    font-size: 12px;
                    color: #666;
                    font-weight: 500;
                }

                /* 애니메이션 */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                    40%, 43% { transform: translateY(-8px); }
                    70% { transform: translateY(-4px); }
                    90% { transform: translateY(-2px); }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                /* 반응형 */
                @media (max-width: 480px) {
                    .login-container {
                        padding: 16px;
                    }

                    .form-container {
                        padding: 24px 20px;
                    }

                    .brand-title {
                        font-size: 24px;
                    }

                    .character-card {
                        width: 100px;
                        height: 100px;
                    }

                    .character-image,
                    .character-fallback {
                        width: 64px;
                        height: 64px;
                        font-size: 32px;
                    }

                    .footer-stats {
                        gap: 24px;
                    }

                    .stat-number {
                        font-size: 18px;
                    }
                }
            `}</style>
        </>
    );
};

export default Login; 