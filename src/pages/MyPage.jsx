import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const MyPage = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('내 레시피');

    const myRecipes = [
        {
            id: 1,
            title: '제육볶음',
            image: '/images/home/kimchi-stew.jpg'
        },
        {
            id: 2,
            title: '밀푀유나베',
            image: '/images/home/millefeuille.jpg'
        },
        {
            id: 3,
            title: '돼지고기 김치찌개',
            image: '/images/home/kimchi-stew.jpg'
        }
    ];

    const favoriteRecipes = [
        {
            id: 4,
            title: '토마토 미트볼 파스타',
            image: '/images/home/pasta.jpg'
        },
        {
            id: 5,
            title: '야채 파스타',
            image: '/images/home/pasta.jpg'
        },
        {
            id: 6,
            title: '치킨 스테이크',
            image: '/images/home/kimchi-stew.jpg'
        }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    if (!currentUser) {
        return (
            <div style={{ paddingBottom: '100px' }}>
                <Header showScrollBanner={false} />

                <div className="main-container">
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        color: '#666'
                    }}>
                        <div style={{
                            fontSize: '60px',
                            marginBottom: '20px',
                            opacity: 0.5
                        }}>
                            🔒
                        </div>
                        <h2 style={{ marginBottom: '10px' }}>로그인이 필요합니다</h2>
                        <p style={{ marginBottom: '30px' }}>
                            마이페이지를 보려면 로그인해주세요.
                        </p>
                        <Link
                            to="/login"
                            style={{
                                backgroundColor: '#e53935',
                                color: '#ffffff',
                                padding: '12px 24px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}
                        >
                            로그인하기
                        </Link>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '100px' }}>
            <Header showScrollBanner={false} />

            <div className="main-container">
                {/* 배경 장식 원들 */}
                <div style={{
                    position: 'absolute',
                    top: '60px',
                    left: '-50px',
                    width: '102px',
                    height: '102px',
                    backgroundColor: '#f7d1a9',
                    borderRadius: '50%',
                    zIndex: 1
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '81px',
                    right: '-30px',
                    width: '119px',
                    height: '119px',
                    backgroundColor: '#f6e4f2',
                    borderRadius: '50%',
                    zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    {/* MY 타이틀 */}
                    <h1 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        textAlign: 'center',
                        marginBottom: '40px',
                        color: '#000000'
                    }}>
                        MY
                    </h1>

                    {/* 프로필 섹션 */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '40px'
                    }}>
                        {/* 프로필 이미지 */}
                        <div style={{
                            position: 'relative',
                            marginBottom: '15px'
                        }}>
                            <div style={{
                                width: '157px',
                                height: '157px',
                                borderRadius: '30px',
                                backgroundColor: '#fdf0e3',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src="/images/mypage/profile.jpg"
                                    alt="프로필 이미지"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#feeb9a',
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '60px',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}>
                                    👨‍🍳
                                </div>
                            </div>
                        </div>

                        {/* 사용자 정보 */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '20px'
                        }}>
                            <h2 style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                margin: '0 0 5px 0',
                                color: '#000000'
                            }}>
                                {currentUser.displayName || currentUser.email?.split('@')[0] || '셰프'}님
                            </h2>
                            <p style={{
                                fontSize: '12px',
                                color: '#666',
                                margin: '0'
                            }}>
                                {currentUser.email}
                            </p>
                        </div>

                        {/* 로그아웃 버튼 */}
                        <button
                            onClick={handleLogout}
                            style={{
                                backgroundColor: '#e53935',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '8px 20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                            로그아웃
                        </button>
                    </div>

                    {/* 탭 메뉴 */}
                    <div style={{
                        display: 'flex',
                        backgroundColor: '#f8f8f8',
                        borderRadius: '25px',
                        padding: '4px',
                        marginBottom: '30px'
                    }}>
                        {['내 레시피', '찜한 레시피'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    flex: 1,
                                    padding: '12px 20px',
                                    backgroundColor: activeTab === tab ? '#e53935' : 'transparent',
                                    color: activeTab === tab ? '#ffffff' : '#666',
                                    border: 'none',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* 레시피 그리드 */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px',
                        marginBottom: '20px'
                    }}>
                        {(activeTab === '내 레시피' ? myRecipes : favoriteRecipes).map(recipe => (
                            <Link
                                key={recipe.id}
                                to={`/recipe/${recipe.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '15px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                                    }}
                                >
                                    {/* 레시피 이미지 */}
                                    <div style={{
                                        width: '100%',
                                        height: '120px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#f0f0f0',
                                            display: 'none',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '30px',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0
                                        }}>
                                            🍽️
                                        </div>
                                    </div>

                                    {/* 레시피 정보 */}
                                    <div style={{
                                        padding: '15px'
                                    }}>
                                        <h3 style={{
                                            fontSize: '14px',
                                            fontWeight: '700',
                                            margin: '0',
                                            color: '#000000',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {recipe.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* 빈 상태 메시지 */}
                    {(activeTab === '내 레시피' ? myRecipes : favoriteRecipes).length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#666'
                        }}>
                            <div style={{
                                fontSize: '50px',
                                marginBottom: '15px',
                                opacity: 0.5
                            }}>
                                {activeTab === '내 레시피' ? '📝' : '❤️'}
                            </div>
                            <p style={{
                                fontSize: '14px',
                                marginBottom: '20px'
                            }}>
                                {activeTab === '내 레시피'
                                    ? '아직 작성한 레시피가 없어요'
                                    : '아직 찜한 레시피가 없어요'
                                }
                            </p>
                            <Link
                                to={activeTab === '내 레시피' ? '/recipe-form' : '/search'}
                                style={{
                                    backgroundColor: '#e53935',
                                    color: '#ffffff',
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                {activeTab === '내 레시피' ? '레시피 작성하기' : '레시피 찾아보기'}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default MyPage; 