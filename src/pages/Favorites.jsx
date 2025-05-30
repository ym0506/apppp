import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const Favorites = () => {
    const { currentUser } = useAuth();
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        // Firestore에서 찜한 레시피 실시간 감지
        const unsubscribe = onSnapshot(
            doc(db, 'favorites', currentUser.uid),
            async (doc) => {
                try {
                    if (doc.exists()) {
                        const favoriteIds = doc.data().recipeIds || [];

                        // 각 레시피 정보 가져오기
                        const recipes = [];
                        for (const recipeId of favoriteIds) {
                            try {
                                const recipeDoc = await getDoc(doc(db, 'recipes', recipeId));
                                if (recipeDoc.exists()) {
                                    recipes.push({
                                        id: recipeId,
                                        ...recipeDoc.data()
                                    });
                                }
                            } catch (err) {
                                console.error(`레시피 ${recipeId} 로드 오류:`, err);
                            }
                        }

                        setFavoriteRecipes(recipes);
                    } else {
                        setFavoriteRecipes([]);
                    }
                } catch (err) {
                    console.error('찜 목록 로드 오류:', err);
                    setError('찜 목록을 불러오는데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error('찜 목록 실시간 감지 오류:', error);
                setError('찜 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

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
                            찜한 레시피를 보려면 로그인해주세요.
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

    if (loading) {
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
                            ⏳
                        </div>
                        <p>찜한 레시피를 불러오는 중...</p>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ paddingBottom: '100px' }}>
                <Header showScrollBanner={false} />

                <div className="main-container">
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        color: '#e53935'
                    }}>
                        <div style={{
                            fontSize: '60px',
                            marginBottom: '20px',
                            opacity: 0.5
                        }}>
                            ⚠️
                        </div>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '20px',
                                backgroundColor: '#e53935',
                                color: '#ffffff',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            다시 시도
                        </button>
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
                    {/* 찜 타이틀 */}
                    <h1 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        textAlign: 'center',
                        marginBottom: '30px',
                        color: '#000000'
                    }}>
                        🍽️ 내가 찜한 레시피
                    </h1>

                    {favoriteRecipes.length === 0 ? (
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
                                ❤️
                            </div>
                            <h3 style={{ marginBottom: '10px' }}>아직 찜한 레시피가 없어요</h3>
                            <p style={{ marginBottom: '30px' }}>
                                마음에 드는 레시피를 찜해보세요!
                            </p>
                            <Link
                                to="/search"
                                style={{
                                    backgroundColor: '#e53935',
                                    color: '#ffffff',
                                    padding: '12px 24px',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}
                            >
                                레시피 찾아보기
                            </Link>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '15px',
                            marginBottom: '20px'
                        }}>
                            {favoriteRecipes.map(recipe => (
                                <Link
                                    key={recipe.id}
                                    to={`/recipe/${recipe.id}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div style={{
                                        backgroundColor: '#fff4e6',
                                        borderRadius: '15px',
                                        padding: '15px',
                                        height: '160px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {/* 찜 표시 */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            fontSize: '16px',
                                            zIndex: 1
                                        }}>
                                            ❤️
                                        </div>

                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '8px'
                                            }}>
                                                <h3 style={{
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                    color: '#000',
                                                    margin: '0',
                                                    lineHeight: '1.3',
                                                    flex: 1,
                                                    paddingRight: '30px' // 찜 아이콘 공간 확보
                                                }}>
                                                    {recipe.title}
                                                </h3>
                                            </div>

                                            <p style={{
                                                fontSize: '11px',
                                                color: '#666',
                                                margin: '0 0 8px 0',
                                                lineHeight: '1.4'
                                            }}>
                                                {recipe.description}
                                            </p>

                                            <p style={{
                                                fontSize: '10px',
                                                color: '#999',
                                                margin: '0',
                                                lineHeight: '1.2'
                                            }}>
                                                by {recipe.author || '익명'}
                                            </p>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginTop: 'auto'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: '#e53935',
                                                    fontWeight: '600'
                                                }}>
                                                    👍 {recipe.likes || 0}
                                                </span>
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: '#666'
                                                }}>
                                                    ⏱️ {recipe.cookTime || '30분'}
                                                </span>
                                            </div>

                                            <span style={{
                                                fontSize: '9px',
                                                color: '#999',
                                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                padding: '2px 6px',
                                                borderRadius: '8px'
                                            }}>
                                                {recipe.category || '기타'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default Favorites; 