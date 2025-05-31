import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const location = useLocation();

    const categories = ['ALL', '한식', '양식', '일식', '중식', '베이커리', '브런치'];

    // Mock 데이터 (실제 프로덕션에서는 Firebase에서 가져옴) - 별점 제거
    const mockRecipes = [
        {
            id: 1,
            title: '제육볶음',
            category: '한식',
            image: '/images/home/kimchi-stew.jpg',
            description: '매콤하고 달콤한 제육볶음',
            author: '계란말이요정',
            likes: 24,
            cookTime: '20분',
            difficulty: '쉬움'
        },
        {
            id: 2,
            title: '토마토 미트볼 파스타',
            category: '양식',
            image: '/images/home/pasta.jpg',
            description: '진한 토마토 소스의 파스타',
            author: '파스타킹',
            likes: 47,
            cookTime: '30분',
            difficulty: '보통'
        },
        {
            id: 3,
            title: '돼지고기 김치찌개',
            category: '한식',
            image: '/images/home/kimchi-stew.jpg',
            description: '시원하고 얼큰한 김치찌개',
            author: '김치러버',
            likes: 35,
            cookTime: '25분',
            difficulty: '쉬움'
        },
        {
            id: 4,
            title: '밀푀유나베',
            category: '일식',
            image: '/images/home/millefeuille.jpg',
            description: '부드러운 밀푀유나베',
            author: '일식마스터',
            likes: 18,
            cookTime: '40분',
            difficulty: '어려움'
        },
        {
            id: 5,
            title: '치킨 카레',
            category: '양식',
            image: '/images/home/pasta.jpg',
            description: '진한 치킨 카레',
            author: '카레요정',
            likes: 29,
            cookTime: '35분',
            difficulty: '보통'
        },
        {
            id: 6,
            title: '새우볶음밥',
            category: '한식',
            image: '/images/home/kimchi-stew.jpg',
            description: '고소한 새우볶음밥',
            author: '볶음밥왕',
            likes: 31,
            cookTime: '15분',
            difficulty: '쉬움'
        },
        {
            id: 7,
            title: '크로와상',
            category: '베이커리',
            image: '/images/home/millefeuille.jpg',
            description: '바삭한 프랑스 크로와상',
            author: '베이커리셰프',
            likes: 22,
            cookTime: '180분',
            difficulty: '어려움'
        },
        {
            id: 8,
            title: '아보카도 토스트',
            category: '브런치',
            image: '/images/home/pasta.jpg',
            description: '건강한 아보카도 토스트',
            author: '헬시쿡',
            likes: 16,
            cookTime: '10분',
            difficulty: '쉬움'
        }
    ];

    // URL 파라미터에서 카테고리 확인
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
            const categoryMap = {
                'korean': '한식',
                'japanese': '일식',
                'chinese': '중식',
                'western': '양식'
            };
            setSelectedCategory(categoryMap[category] || 'ALL');
        }
    }, [location.search]);

    // 레시피 데이터 로드
    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        setLoading(true);
        setError('');

        try {
            // 실제 프로덕션에서는 Firebase에서 데이터 가져오기
            await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
            setRecipes(mockRecipes);
        } catch (err) {
            console.error('레시피 로드 오류:', err);
            setError('레시피를 불러오는데 실패했습니다.');
            setRecipes(mockRecipes); // 오류 시 Mock 데이터 사용
        } finally {
            setLoading(false);
        }
    };

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || recipe.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case '쉬움': return 'var(--accent-emerald)';
            case '보통': return 'var(--accent-amber)';
            case '어려움': return 'var(--text-error)';
            default: return 'var(--text-tertiary)';
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

    return (
        <div className="search-page">
            <Header showScrollBanner={false} />

            {/* 🎨 메인 컨테이너 */}
            <div className="search-container">
                {/* 배경 장식 요소들 */}
                <div className="search-bg-decorations">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>

                {/* 🔍 검색 헤더 */}
                <div className="search-header">
                    <h1 className="search-title">
                        <span className="title-icon">🍳</span>
                        레시피 검색
                    </h1>
                    <p className="search-subtitle">원하는 레시피를 찾아보세요</p>
                </div>

                {/* 🔍 검색창 */}
                <div className="search-input-container">
                    <div className="search-input-wrapper">
                        <img
                            src="/images/home/search-icon.png"
                            alt="검색"
                            className="search-input-icon"
                        />
                        <input
                            type="text"
                            placeholder="레시피 이름, 재료, 작성자를 검색해보세요..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="search-clear-btn"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* 🏷️ 카테고리 필터 */}
                <div className="category-filter">
                    <h3 className="filter-title">카테고리</h3>
                    <div className="category-buttons">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 📊 결과 헤더 */}
                <div className="results-header">
                    <h3 className="results-title">
                        검색 결과
                        <span className="results-count">({filteredRecipes.length}개)</span>
                    </h3>
                </div>

                {/* 🔄 로딩 상태 */}
                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">레시피를 검색 중...</p>
                    </div>
                )}

                {/* ⚠️ 에러 상태 */}
                {error && !loading && (
                    <div className="error-container">
                        <div className="error-icon">⚠️</div>
                        <p className="error-text">{error}</p>
                        <button onClick={loadRecipes} className="retry-btn">
                            다시 시도
                        </button>
                    </div>
                )}

                {/* 📝 레시피 목록 */}
                {!loading && !error && (
                    <div className="recipes-grid">
                        {filteredRecipes.length > 0 ? (
                            filteredRecipes.map((recipe) => (
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
                                    </div>

                                    <div className="card-content">
                                        <h4 className="card-title">{recipe.title}</h4>
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
                                                <span className="stat-item difficulty" style={{
                                                    color: getDifficultyColor(recipe.difficulty)
                                                }}>
                                                    <span className="meta-icon">📊</span>
                                                    {recipe.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3 className="empty-title">검색 결과가 없습니다</h3>
                                <p className="empty-text">
                                    다른 키워드로 검색하거나 카테고리를 변경해보세요.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <BottomNav />

            {/* 🎨 스타일 정의 */}
            <style jsx>{`
                .search-page {
                    padding-bottom: 120px;
                    min-height: 100vh;
                    background: linear-gradient(145deg, 
                        rgba(255, 255, 255, 0.98) 0%, 
                        rgba(254, 253, 251, 0.95) 100%);
                }

                .search-container {
                    max-width: 430px;
                    margin: 0 auto;
                    padding: 24px;
                    position: relative;
                }

                /* 배경 장식 */
                .search-bg-decorations {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 0;
                }

                .decoration-circle {
                    position: absolute;
                    border-radius: 50%;
                    background: linear-gradient(135deg, 
                        rgba(255, 97, 66, 0.1), 
                        rgba(255, 138, 101, 0.08));
                    animation: float 6s ease-in-out infinite;
                }

                .circle-1 {
                    width: 120px;
                    height: 120px;
                    top: 10%;
                    right: -20px;
                    animation-delay: 0s;
                }

                .circle-2 {
                    width: 80px;
                    height: 80px;
                    top: 40%;
                    left: -10px;
                    animation-delay: 2s;
                }

                .circle-3 {
                    width: 60px;
                    height: 60px;
                    bottom: 30%;
                    right: 20px;
                    animation-delay: 4s;
                }

                /* 검색 헤더 */
                .search-header {
                    text-align: center;
                    margin-bottom: 32px;
                    position: relative;
                    z-index: 1;
                }

                .search-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .title-icon {
                    font-size: 32px;
                    animation: bounce 2s infinite;
                }

                .search-subtitle {
                    font-size: 16px;
                    color: #666;
                    font-weight: 500;
                }

                /* 검색 입력 */
                .search-input-container {
                    margin-bottom: 32px;
                    position: relative;
                    z-index: 1;
                }

                .search-input-wrapper {
                    position: relative;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(25px) saturate(180%);
                    border: 1.5px solid rgba(255, 255, 255, 0.4);
                    border-radius: 20px;
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.1),
                        0 4px 12px rgba(255, 97, 66, 0.15);
                    transition: all 0.3s ease;
                }

                .search-input-wrapper:focus-within {
                    transform: translateY(-2px);
                    border-color: rgba(255, 97, 66, 0.4);
                    box-shadow: 
                        0 12px 40px rgba(0, 0, 0, 0.15),
                        0 6px 16px rgba(255, 97, 66, 0.25);
                }

                .search-input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    opacity: 0.6;
                }

                .search-input {
                    width: 100%;
                    padding: 16px 50px 16px 50px;
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 16px;
                    font-weight: 500;
                    color: #333;
                }

                .search-input::placeholder {
                    color: #999;
                    font-weight: 400;
                }

                .search-clear-btn {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 97, 66, 0.1);
                    border: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    font-size: 12px;
                    color: #ff6142;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .search-clear-btn:hover {
                    background: rgba(255, 97, 66, 0.2);
                    transform: translateY(-50%) scale(1.1);
                }

                /* 카테고리 필터 */
                .category-filter {
                    margin-bottom: 32px;
                    position: relative;
                    z-index: 1;
                }

                .filter-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 16px;
                }

                .category-buttons {
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                    padding: 8px 0;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .category-buttons::-webkit-scrollbar {
                    display: none;
                }

                .category-btn {
                    padding: 10px 16px;
                    background: rgba(255, 255, 255, 0.8);
                    border: 1px solid rgba(255, 97, 66, 0.2);
                    border-radius: 16px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .category-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 97, 66, 0.2);
                }

                .category-btn.active {
                    background: linear-gradient(135deg, #ff6142, #ff8a65);
                    color: white;
                    border-color: #ff6142;
                    box-shadow: 0 4px 12px rgba(255, 97, 66, 0.3);
                }

                /* 결과 헤더 */
                .results-header {
                    margin-bottom: 24px;
                    position: relative;
                    z-index: 1;
                }

                .results-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #333;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .results-count {
                    font-size: 16px;
                    color: #ff6142;
                    font-weight: 600;
                }

                /* 로딩/에러 상태 */
                .loading-container, .error-container {
                    text-align: center;
                    padding: 60px 20px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 20px;
                    margin: 20px 0;
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
                    position: relative;
                    z-index: 1;
                }

                .recipe-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 20px;
                    padding: 0;
                    margin-bottom: 20px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    text-decoration: none;
                    color: inherit;
                    overflow: hidden;
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
                    top: 12px;
                    right: 12px;
                    padding: 6px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(10px);
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

                .stat-item.difficulty {
                    font-weight: 600;
                }

                /* 빈 상태 */
                .empty-state {
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
                    line-height: 1.5;
                }

                /* 애니메이션 */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                /* 반응형 */
                @media (max-width: 480px) {
                    .search-container {
                        padding: 20px 16px;
                    }

                    .search-title {
                        font-size: 24px;
                    }

                    .title-icon {
                        font-size: 28px;
                    }

                    .category-buttons {
                        padding: 4px 0;
                    }

                    .category-btn {
                        padding: 8px 12px;
                        font-size: 13px;
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

export default Search; 