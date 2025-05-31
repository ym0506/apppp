import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { favoriteService } from '../utils/firebaseUtils';

const Favorites = () => {
    const { currentUser } = useAuth();
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Mock 데이터 (실제 레시피 정보 - 찜 목록과 매핑용)
    const allRecipes = {
        'kimchi-stew': {
            id: 'kimchi-stew',
            title: '돼지고기 김치찌개',
            description: '집에서 쉽게 만드는 얼큰한 김치찌개',
            image: '/images/home/kimchi-stew.jpg',
            author: '김치요정',
            likes: 124,
            cookTime: '25분',
            difficulty: '중급',
            category: '한식'
        },
        'pasta': {
            id: 'pasta',
            title: '토마토 미트볼 파스타',
            description: '부드러운 미트볼과 진한 토마토 소스',
            image: '/images/home/pasta.jpg',
            author: '파스타마스터',
            likes: 89,
            cookTime: '35분',
            difficulty: '중급',
            category: '양식'
        },
        'millefeuille': {
            id: 'millefeuille',
            title: '밀푀유나베',
            description: '배추와 고기를 켜켜이 쌓은 일본 전골',
            image: '/images/home/millefeuille.jpg',
            author: '나베킹',
            likes: 45,
            cookTime: '20분',
            difficulty: '초급',
            category: '일식'
        },
        'fried-rice': {
            id: 'fried-rice',
            title: '새우볶음밥',
            description: '프리프리한 새우가 들어간 볶음밥',
            image: '/images/home/kimchi-stew.jpg',
            author: '볶음밥왕',
            likes: 67,
            cookTime: '15분',
            difficulty: '초급',
            category: '중식'
        },
        'chicken-steak': {
            id: 'chicken-steak',
            title: '치킨 스테이크',
            description: '부드럽고 육즙이 풍부한 치킨 스테이크',
            image: '/images/home/pasta.jpg',
            author: '스테이크셰프',
            likes: 76,
            cookTime: '30분',
            difficulty: '중급',
            category: '양식'
        },
        'soup': {
            id: 'soup',
            title: '미역국',
            description: '영양이 풍부한 미역으로 끓인 전통 국물 요리',
            image: '/images/home/millefeuille.jpg',
            author: '국물장인',
            likes: 54,
            cookTime: '15분',
            difficulty: '초급',
            category: '한식'
        }
    };

    useEffect(() => {
        loadFavoriteRecipes();
    }, [currentUser]);

    const loadFavoriteRecipes = async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Firebase에서 사용자의 찜 목록 가져오기
            const favoriteIds = await favoriteService.getFavoriteRecipes(currentUser.uid);

            // 찜한 레시피 ID들을 실제 레시피 데이터와 매핑
            const favorites = favoriteIds
                .map(id => allRecipes[id])
                .filter(recipe => recipe); // 존재하는 레시피만 필터링

            setFavoriteRecipes(favorites);
        } catch (err) {
            console.error('찜 목록 로드 오류:', err);
            setError('찜 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case '초급': return '#4caf50';
            case '중급': return '#ff9800';
            case '고급': return '#f44336';
            default: return '#757575';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case '한식': return '#ff6142';
            case '양식': return '#4caf50';
            case '일식': return '#2196f3';
            case '중식': return '#ff9800';
            case '베이커리': return '#9c27b0';
            case '브런치': return '#795548';
            default: return '#757575';
        }
    };

    if (!currentUser) {
        return (
            <div style={{ paddingBottom: '120px' }}>
                <Header showScrollBanner={false} />
                <div className="favorites-container">
                    <div className="login-required">
                        <div className="login-icon">🔒</div>
                        <h2>로그인이 필요합니다</h2>
                        <p>찜한 레시피를 보려면 로그인해주세요.</p>
                        <Link to="/login" className="login-btn">
                            로그인하기
                        </Link>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '120px' }}>
            <Header showScrollBanner={false} />

            <div className="favorites-container">
                {/* 헤더 */}
                <div className="favorites-header">
                    <h1 className="page-title">
                        <span className="title-icon">❤️</span>
                        찜한 레시피
                    </h1>
                    <p className="page-subtitle">
                        나만의 특별한 레시피 컬렉션
                    </p>
                </div>

                {/* 로딩 상태 */}
                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">찜한 레시피를 불러오는 중...</p>
                    </div>
                )}

                {/* 에러 상태 */}
                {error && !loading && (
                    <div className="error-container">
                        <div className="error-icon">⚠️</div>
                        <p className="error-text">{error}</p>
                        <button onClick={loadFavoriteRecipes} className="retry-btn">
                            다시 시도
                        </button>
                    </div>
                )}

                {/* 레시피 목록 */}
                {!loading && !error && (
                    <div className="recipes-section">
                        {favoriteRecipes.length > 0 ? (
                            <div className="recipes-grid">
                                {favoriteRecipes.map((recipe) => (
                                    <Link
                                        to={`/recipe/${recipe.id}`}
                                        key={recipe.id}
                                        className="recipe-card"
                                    >
                                        <div className="card-image-container">
                                            <img
                                                src={recipe.image}
                                                alt={recipe.title}
                                                className="card-image"
                                            />
                                            <div className="card-category-badge" style={{
                                                backgroundColor: getCategoryColor(recipe.category)
                                            }}>
                                                {recipe.category}
                                            </div>
                                            <div className="card-heart">❤️</div>
                                        </div>

                                        <div className="card-content">
                                            <h3 className="card-title">{recipe.title}</h3>
                                            <p className="card-description">{recipe.description}</p>

                                            <div className="card-meta">
                                                <div className="meta-row">
                                                    <span className="meta-item">
                                                        <span className="meta-icon">👨‍🍳</span>
                                                        {recipe.author}
                                                    </span>
                                                    <span className="meta-item">
                                                        <span className="meta-icon">❤️</span>
                                                        {recipe.likes}
                                                    </span>
                                                </div>

                                                <div className="meta-row">
                                                    <span className="meta-item">
                                                        <span className="meta-icon">⏰</span>
                                                        {recipe.cookTime}
                                                    </span>
                                                    <span className="meta-item difficulty" style={{
                                                        color: getDifficultyColor(recipe.difficulty)
                                                    }}>
                                                        <span className="meta-icon">📊</span>
                                                        {recipe.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-favorites">
                                <div className="empty-icon">💔</div>
                                <h3 className="empty-title">찜한 레시피가 없습니다</h3>
                                <p className="empty-text">
                                    마음에 드는 레시피를 찾아서 하트를 눌러보세요!
                                </p>
                                <Link to="/search" className="browse-btn">
                                    레시피 둘러보기
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <BottomNav />

            {/* 스타일 */}
            <style jsx>{`
                .favorites-container {
                    max-width: 430px;
                    margin: 0 auto;
                    padding: 24px;
                    min-height: calc(100vh - 200px);
                }

                /* 헤더 */
                .favorites-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .page-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: #333;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .title-icon {
                    font-size: 32px;
                    animation: heartbeat 2s infinite;
                }

                .page-subtitle {
                    font-size: 16px;
                    color: #666;
                    font-weight: 500;
                }

                /* 로그인 필요 */
                .login-required {
                    text-align: center;
                    padding: 80px 20px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 20px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }

                .login-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                    opacity: 0.7;
                }

                .login-required h2 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 12px;
                }

                .login-required p {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 24px;
                }

                .login-btn {
                    display: inline-block;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #ff6142, #ff8a65);
                    color: white;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 97, 66, 0.3);
                }

                /* 로딩/에러 상태 */
                .loading-container, .error-container {
                    text-align: center;
                    padding: 60px 20px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 20px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 97, 66, 0.2);
                    border-top: 3px solid #ff6142;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                }

                .loading-text, .error-text {
                    font-size: 16px;
                    color: #666;
                    font-weight: 500;
                }

                .error-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                .retry-btn {
                    margin-top: 16px;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #ff6142, #ff8a65);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .retry-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 97, 66, 0.3);
                }

                /* 레시피 그리드 */
                .recipes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }

                .recipe-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 20px;
                    overflow: hidden;
                    text-decoration: none;
                    color: inherit;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }

                .recipe-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 
                        0 20px 40px rgba(0, 0, 0, 0.12),
                        0 8px 20px rgba(255, 97, 66, 0.2);
                    border-color: rgba(255, 97, 66, 0.3);
                }

                .card-image-container {
                    position: relative;
                    height: 160px;
                    overflow: hidden;
                }

                .card-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: all 0.3s ease;
                }

                .recipe-card:hover .card-image {
                    transform: scale(1.05);
                }

                .card-category-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    padding: 6px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(10px);
                }

                .card-heart {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    font-size: 20px;
                    animation: heartbeat 2s infinite;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                }

                .card-content {
                    padding: 20px;
                }

                .card-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 8px;
                    line-height: 1.3;
                }

                .card-description {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 16px;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .card-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .meta-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    color: #666;
                    font-weight: 500;
                }

                .meta-icon {
                    font-size: 14px;
                }

                .meta-item.difficulty {
                    font-weight: 600;
                }

                /* 빈 상태 */
                .empty-favorites {
                    text-align: center;
                    padding: 80px 20px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 20px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }

                .empty-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                    opacity: 0.6;
                }

                .empty-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 8px;
                }

                .empty-text {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 24px;
                    line-height: 1.5;
                }

                .browse-btn {
                    display: inline-block;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #ff6142, #ff8a65);
                    color: white;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .browse-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 97, 66, 0.3);
                }

                /* 애니메이션 */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes heartbeat {
                    0%, 50%, 100% { transform: scale(1); }
                    25%, 75% { transform: scale(1.1); }
                }

                /* 반응형 */
                @media (max-width: 480px) {
                    .favorites-container {
                        padding: 20px 16px;
                    }

                    .page-title {
                        font-size: 24px;
                    }

                    .title-icon {
                        font-size: 28px;
                    }

                    .recipes-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }

                    .card-content {
                        padding: 16px;
                    }

                    .card-title {
                        font-size: 16px;
                    }

                    .card-description {
                        font-size: 13px;
                    }

                    .meta-item {
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Favorites; 