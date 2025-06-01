import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getUserRecipes } from '../services/apiService';

const MyPage = () => {
    const { currentUser, logout } = useAuth();
    const [myRecipes, setMyRecipes] = useState([]);
    const [stats, setStats] = useState({
        totalRecipes: 0,
        totalLikes: 0,
        totalViews: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Mock 데이터 제거하고 실제 API 연동
    useEffect(() => {
        if (currentUser) {
            loadMyData();
        }
    }, [currentUser]);

    const loadMyData = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('🔍 사용자 레시피 로드 시작:', currentUser.uid);

            // 백엔드 API를 통해 실제 사용자 레시피 가져오기
            const userRecipes = await getUserRecipes(currentUser.uid);

            console.log('✅ 사용자 레시피 로드 성공:', userRecipes);

            // API 응답 데이터를 UI에 맞게 변환
            const formattedRecipes = userRecipes.map(recipe => ({
                id: recipe.id,
                title: recipe.title,
                description: recipe.content || '맛있는 레시피입니다', // content 필드를 description으로 사용
                image: recipe.imageUrl
                    ? (recipe.imageUrl.startsWith('/uploads/')
                        ? `http://localhost:8081${recipe.imageUrl}`  // 백엔드 서버 주소 추가
                        : recipe.imageUrl)
                    : '/images/default-recipe.jpg', // 기본 이미지 설정
                category: recipe.category || '한식',
                likes: 0, // 백엔드에서 좋아요 수 제공 시 사용
                views: 0, // 백엔드에서 조회수 제공 시 사용
                cookTime: recipe.cookingTime || '30분', // 실제 백엔드 데이터 사용
                difficulty: recipe.difficulty || '쉬움', // 실제 백엔드 데이터 사용
                createdAt: new Date().toISOString().split('T')[0] // 현재 날짜 사용 (백엔드에서 createdAt 제공 시 사용)
            }));

            setMyRecipes(formattedRecipes);
            setStats({
                totalRecipes: formattedRecipes.length,
                totalLikes: formattedRecipes.reduce((sum, recipe) => sum + recipe.likes, 0),
                totalViews: formattedRecipes.reduce((sum, recipe) => sum + recipe.views, 0)
            });
        } catch (err) {
            console.error('❌ 내 레시피 로드 오류:', err);
            setError(`데이터를 불러오는데 실패했습니다: ${err.message}`);

            // 에러 발생 시 빈 배열로 설정
            setMyRecipes([]);
            setStats({
                totalRecipes: 0,
                totalLikes: 0,
                totalViews: 0
            });
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

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('로그아웃 오류:', error);
        }
    };

    if (!currentUser) {
        return (
            <div style={{ paddingBottom: '120px' }}>
                <Header showScrollBanner={false} />
                <div className="mypage-container">
                    <div className="login-required">
                        <div className="login-icon">🔒</div>
                        <h2>로그인이 필요합니다</h2>
                        <p>마이페이지를 보려면 로그인해주세요.</p>
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

            <div className="mypage-container">
                {/* 프로필 헤더 */}
                <div className="profile-header">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            {currentUser.photoURL ? (
                                <img src={currentUser.photoURL} alt="프로필" />
                            ) : (
                                <div className="avatar-placeholder">
                                    {currentUser.displayName ? currentUser.displayName.charAt(0) : '👤'}
                                </div>
                            )}
                        </div>
                        <div className="profile-details">
                            <h1 className="profile-name">
                                {currentUser.displayName || '요리 초보'}
                            </h1>
                            <p className="profile-email">{currentUser.email}</p>
                            <p className="profile-join">
                                가입일: {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        로그아웃
                    </button>
                </div>

                {/* 통계 섹션 */}
                <div className="stats-section">
                    <h2 className="section-title">📊 내 활동</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalRecipes}</div>
                            <div className="stat-label">작성한 레시피</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalLikes}</div>
                            <div className="stat-label">받은 좋아요</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalViews}</div>
                            <div className="stat-label">총 조회수</div>
                        </div>
                    </div>
                </div>

                {/* 내 레시피 섹션 */}
                <div className="recipes-section">
                    <div className="section-header">
                        <h2 className="section-title">👨‍🍳 내 레시피</h2>
                        <Link to="/recipe/new" className="add-recipe-btn">
                            + 레시피 추가
                        </Link>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p className="loading-text">레시피를 불러오는 중...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <div className="error-icon">⚠️</div>
                            <p className="error-text">{error}</p>
                            <button onClick={loadMyData} className="retry-btn">
                                다시 시도
                            </button>
                        </div>
                    ) : myRecipes.length > 0 ? (
                        <div className="recipes-grid">
                            {myRecipes.map((recipe) => (
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
                                            onError={(e) => {
                                                console.warn('이미지 로딩 실패:', recipe.image);
                                                e.target.style.display = 'none';
                                                if (e.target.nextElementSibling && e.target.nextElementSibling.className !== 'card-category-badge') {
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                        {/* 이미지 로딩 실패 시 fallback */}
                                        <div className="image-fallback" style={{
                                            display: 'none',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#f5f5f5',
                                            fontSize: '48px',
                                            color: '#666'
                                        }}>
                                            🍽️
                                        </div>
                                        <div className="card-category-badge" style={{
                                            backgroundColor: getCategoryColor(recipe.category)
                                        }}>
                                            {recipe.category}
                                        </div>
                                    </div>

                                    <div className="card-content">
                                        <h3 className="card-title">{recipe.title}</h3>
                                        <p className="card-description">{recipe.description}</p>

                                        <div className="card-meta">
                                            <div className="meta-row">
                                                <span className="meta-item">
                                                    <span className="meta-icon">❤️</span>
                                                    {recipe.likes}
                                                </span>
                                                <span className="meta-item">
                                                    <span className="meta-icon">👁️</span>
                                                    {recipe.views}
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

                                        <div className="card-date">
                                            작성일: {new Date(recipe.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-recipes">
                            <div className="empty-icon">🍳</div>
                            <h3 className="empty-title">작성한 레시피가 없습니다</h3>
                            <p className="empty-text">
                                첫 번째 레시피를 작성해보세요!
                            </p>
                            <Link to="/recipe/new" className="create-recipe-btn">
                                레시피 작성하기
                            </Link>
                        </div>
                    )}
                </div>

                {/* 빠른 메뉴 */}
                <div className="quick-menu">
                    <h2 className="section-title">⚡ 빠른 메뉴</h2>
                    <div className="menu-grid">
                        <Link to="/favorites" className="menu-item">
                            <div className="menu-icon">❤️</div>
                            <span>찜한 레시피</span>
                        </Link>
                        <Link to="/search" className="menu-item">
                            <div className="menu-icon">🔍</div>
                            <span>레시피 검색</span>
                        </Link>
                        <Link to="/recipe/new" className="menu-item">
                            <div className="menu-icon">✏️</div>
                            <span>레시피 작성</span>
                        </Link>
                        <button onClick={handleLogout} className="menu-item">
                            <div className="menu-icon">🚪</div>
                            <span>로그아웃</span>
                        </button>
                    </div>
                </div>
            </div>

            <BottomNav />

            {/* 스타일 */}
            <style jsx>{`
                .mypage-container {
                    max-width: 430px;
                    margin: 0 auto;
                    padding: 24px;
                    min-height: calc(100vh - 200px);
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

                /* 프로필 헤더 */
                .profile-header {
                    background: linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.9) 0%, 
                        rgba(255, 249, 245, 0.8) 100%);
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 24px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(255, 97, 66, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .profile-info {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: linear-gradient(135deg, #ff6142, #ff8a65);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 20px rgba(255, 97, 66, 0.3);
                }

                .profile-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .avatar-placeholder {
                    font-size: 32px;
                    color: white;
                    font-weight: 700;
                }

                .profile-details {
                    flex: 1;
                }

                .profile-name {
                    font-size: 24px;
                    font-weight: 800;
                    color: #333;
                    margin-bottom: 4px;
                }

                .profile-email {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 2px;
                }

                .profile-join {
                    font-size: 12px;
                    color: #999;
                }

                .logout-btn {
                    padding: 8px 16px;
                    background: rgba(255, 97, 66, 0.1);
                    color: #ff6142;
                    border: 1px solid rgba(255, 97, 66, 0.3);
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .logout-btn:hover {
                    background: rgba(255, 97, 66, 0.2);
                    transform: translateY(-2px);
                }

                /* 섹션 공통 */
                .section-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* 통계 섹션 */
                .stats-section {
                    margin-bottom: 32px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }

                .stat-card {
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 16px;
                    padding: 20px 12px;
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                    border: 1px solid rgba(255, 97, 66, 0.1);
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }

                .stat-number {
                    font-size: 24px;
                    font-weight: 800;
                    color: #ff6142;
                    margin-bottom: 4px;
                }

                .stat-label {
                    font-size: 12px;
                    color: #666;
                    font-weight: 600;
                }

                /* 레시피 섹션 */
                .recipes-section {
                    margin-bottom: 32px;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .add-recipe-btn {
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #ff6142, #ff8a65);
                    color: white;
                    text-decoration: none;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .add-recipe-btn:hover {
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
                    gap: 16px;
                }

                .recipe-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 16px;
                    overflow: hidden;
                    text-decoration: none;
                    color: inherit;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
                }

                .recipe-card:hover {
                    transform: translateY(-6px) scale(1.02);
                    box-shadow: 
                        0 16px 32px rgba(0, 0, 0, 0.1),
                        0 6px 16px rgba(255, 97, 66, 0.2);
                    border-color: rgba(255, 97, 66, 0.3);
                }

                .card-image-container {
                    position: relative;
                    height: 140px;
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
                    top: 8px;
                    right: 8px;
                    padding: 4px 8px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 600;
                    color: white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(10px);
                }

                .card-content {
                    padding: 16px;
                }

                .card-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 6px;
                    line-height: 1.3;
                }

                .card-description {
                    font-size: 13px;
                    color: #666;
                    margin-bottom: 12px;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .card-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 8px;
                }

                .meta-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    color: #666;
                    font-weight: 500;
                }

                .meta-icon {
                    font-size: 13px;
                }

                .meta-item.difficulty {
                    font-weight: 600;
                }

                .card-date {
                    font-size: 11px;
                    color: #999;
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                    padding-top: 8px;
                }

                /* 빈 레시피 상태 */
                .empty-recipes {
                    text-align: center;
                    padding: 60px 20px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 20px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }

                .empty-icon {
                    font-size: 64px;
                    margin-bottom: 16px;
                    opacity: 0.6;
                }

                .empty-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 8px;
                }

                .empty-text {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 20px;
                }

                .create-recipe-btn {
                    display: inline-block;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #ff6142, #ff8a65);
                    color: white;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .create-recipe-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 97, 66, 0.3);
                }

                /* 빠른 메뉴 */
                .quick-menu {
                    margin-bottom: 20px;
                }

                .menu-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                .menu-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    padding: 20px 12px;
                    background: rgba(255, 255, 255, 0.8);
                    border: 1px solid rgba(255, 97, 66, 0.1);
                    border-radius: 16px;
                    text-decoration: none;
                    color: #333;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                }

                .menu-item:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                    background: rgba(255, 255, 255, 0.95);
                }

                .menu-icon {
                    font-size: 24px;
                }

                /* 애니메이션 */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* 반응형 */
                @media (max-width: 480px) {
                    .mypage-container {
                        padding: 20px 16px;
                    }

                    .profile-header {
                        flex-direction: column;
                        gap: 16px;
                        text-align: center;
                    }

                    .profile-info {
                        flex-direction: column;
                        text-align: center;
                        gap: 12px;
                    }

                    .profile-avatar {
                        width: 60px;
                        height: 60px;
                    }

                    .profile-name {
                        font-size: 20px;
                    }

                    .stats-grid {
                        gap: 8px;
                    }

                    .stat-card {
                        padding: 16px 8px;
                    }

                    .stat-number {
                        font-size: 20px;
                    }

                    .stat-label {
                        font-size: 11px;
                    }

                    .recipes-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }

                    .section-header {
                        flex-direction: column;
                        gap: 12px;
                        align-items: stretch;
                    }

                    .add-recipe-btn {
                        text-align: center;
                    }

                    .menu-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 8px;
                    }

                    .menu-item {
                        padding: 16px 8px;
                        font-size: 13px;
                    }

                    .menu-icon {
                        font-size: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default MyPage; 