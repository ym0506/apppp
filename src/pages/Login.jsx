import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
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
        <div className="main-container">
            {/* 배경 장식 원들 */}
            <div style={{
                position: 'absolute',
                top: '246px',
                left: '-50px',
                width: '102px',
                height: '102px',
                backgroundColor: '#f7d1a9',
                borderRadius: '50%',
                zIndex: 1
            }}></div>
            <div style={{
                position: 'absolute',
                top: '256px',
                right: '-30px',
                width: '119px',
                height: '119px',
                backgroundColor: '#f6e4f2',
                borderRadius: '50%',
                zIndex: 1
            }}></div>

            <div style={{ position: 'relative', zIndex: 2 }}>
                {/* 캐릭터와 말풍선 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '80px',
                    marginBottom: '40px',
                    position: 'relative'
                }}>
                    {/* 캐릭터 이미지 */}
                    <img
                        src="/images/login/character.png"
                        alt="로그인 캐릭터"
                        style={{
                            width: '124px',
                            height: '124px',
                            borderRadius: '10px',
                            objectFit: 'contain'
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div style={{
                        width: '124px',
                        height: '124px',
                        backgroundColor: '#f7d1a9',
                        borderRadius: '10px',
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#666'
                    }}>
                        캐릭터<br />이미지
                    </div>

                    {/* 말풍선 */}
                    <div style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        padding: '8px 15px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#e53935',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        whiteSpace: 'nowrap'
                    }}>
                        안녕하세요 셰프님!
                    </div>
                </div>

                {/* 로그인 타이틀 */}
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    textAlign: 'center',
                    marginBottom: '40px',
                    color: '#000000'
                }}>
                    로그인
                </h1>

                {/* 로그인 폼 */}
                <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
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

                    {/* 아이디 입력 */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            backgroundColor: 'rgba(255, 243, 224, 0.7)',
                            borderRadius: '10px',
                            padding: '15px 20px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일"
                                required
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    outline: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            />
                        </div>
                    </div>

                    {/* 비밀번호 입력 */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            backgroundColor: 'rgba(255, 243, 224, 0.7)',
                            borderRadius: '10px',
                            padding: '15px 20px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호"
                                required
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    outline: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            />
                        </div>
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: loading ? '#ccc' : '#e53935',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '20px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>

                    {/* 링크들 */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        marginBottom: '30px',
                        fontSize: '10px',
                        fontWeight: '900'
                    }}>
                        <a href="#" style={{ color: '#e53935', textDecoration: 'none' }}>
                            비밀번호를 잊어버렸어요!
                        </a>
                        <Link to="/register" style={{ color: '#e53935', textDecoration: 'none' }}>
                            회원가입
                        </Link>
                    </div>
                </form>

                {/* 소셜 로그인 */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{
                        fontSize: '11px',
                        fontWeight: '900',
                        color: '#e53935',
                        marginBottom: '20px'
                    }}>
                        1초만에 로그인
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '15px'
                    }}>
                        {/* 카카오톡 로그인 */}
                        <button
                            disabled={loading}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: '#ffeb3b',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0',
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            <img
                                src="/images/social-icons/kakao.png"
                                alt="카카오 로그인"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                display: 'none'
                            }}>
                                카카오
                            </span>
                        </button>

                        {/* 구글 로그인 */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(196, 196, 196, 0.17)',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0',
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            <img
                                src="/images/social-icons/google.png"
                                alt="구글 로그인"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                display: 'none'
                            }}>
                                구글
                            </span>
                        </button>

                        {/* 애플 로그인 */}
                        <button
                            disabled={loading}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: '#000000',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0',
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            <img
                                src="/images/social-icons/apple.png"
                                alt="애플 로그인"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                color: '#ffffff',
                                display: 'none'
                            }}>
                                애플
                            </span>
                        </button>

                        {/* 네이버 로그인 */}
                        <button
                            disabled={loading}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: '#0cbf57',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                fontWeight: '800',
                                color: '#ffffff',
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            N
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 