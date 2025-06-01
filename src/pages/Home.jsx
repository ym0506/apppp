import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import '../styles/Home.css';
import { recipeService } from '../utils/firebaseUtils';
import { getUserRecipes } from '../services/apiService';

const Home = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [randomRecipes, setRandomRecipes] = useState([]);
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 확장된 레시피 데이터 - 각 메뉴별로 고유한 정보 제공 (fallback 용도)
    const recipeData = {
        'kimchi-stew': {
            name: '돼지고기 김치찌개',
            imageUrl: '/images/home/kimchi-stew.jpg',
            description: '깊은 맛의 돼지고기와 잘 익은 김치가 만나 시원하고 칼칼한 국물이 일품인 한국의 대표 찌개'
        },
        'pasta': {
            name: '토마토 미트볼 파스타',
            imageUrl: '/images/home/pasta.jpg',
            description: '부드러운 미트볼과 진한 토마토 소스가 어우러진 이탈리안 스타일의 정통 파스타'
        },
        'millefeuille': {
            name: '밀푀유나베',
            imageUrl: '/images/home/millefeuille.jpg',
            description: '배추와 고기를 켜켜이 쌓아 만든 일본식 전골 요리, 깔끔하고 담백한 국물이 특징'
        },
        'fried-rice': {
            name: '새우볶음밥',
            imageUrl: '/images/home/kimchi-stew.jpg',
            description: '프리프리한 새우와 고슬고슬한 밥이 만나 담백하고 고소한 맛의 중화요리'
        },
        'chicken-steak': {
            name: '치킨 스테이크',
            imageUrl: '/images/home/pasta.jpg',
            description: '부드럽고 육즙이 풍부한 닭가슴살을 완벽하게 구워낸 서양식 메인 요리'
        },
        'soup': {
            name: '미역국',
            imageUrl: '/images/home/millefeuille.jpg',
            description: '영양이 풍부한 미역으로 끓인 한국의 전통 국물 요리, 깔끔하고 시원한 맛'
        }
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                console.log('🔍 홈 페이지에서 레시피 데이터 로드 시작');

                let backendRecipes = [];

                // 1순위: 로그인된 사용자의 레시피를 백엔드에서 조회
                if (currentUser?.uid) {
                    try {
                        console.log('🔍 백엔드에서 사용자 레시피 조회:', currentUser.uid);
                        backendRecipes = await getUserRecipes(currentUser.uid);
                        console.log('✅ 백엔드 레시피 조회 결과:', backendRecipes);
                    } catch (error) {
                        console.warn('⚠️ 백엔드 레시피 조회 실패:', error.message);
                    }
                }

                // 백엔드 레시피를 프론트엔드 형식으로 변환
                const formattedBackendRecipes = backendRecipes.map(recipe => ({
                    id: recipe.id,
                    title: recipe.title,
                    imageUrl: recipe.imageUrl || null,
                    category: recipe.category || '기타',
                    cookTime: recipe.cookingTime || '30분',
                    description: recipe.content || recipe.description || ''
                }));

                // 백엔드에서 가져온 레시피가 있으면 사용, 없으면 Firebase나 fallback 데이터 사용
                if (formattedBackendRecipes.length > 0) {
                    console.log('✅ 백엔드 레시피 사용:', formattedBackendRecipes.length, '개');
                    setRandomRecipes(formattedBackendRecipes.slice(0, 6));
                    setPopularRecipes(formattedBackendRecipes.slice(0, 6));
                } else {
                    console.log('🔄 Firebase에서 레시피 조회 시도');

                    // 2순위: Firebase에서 레시피 가져오기
                    try {
                        const { recipes: latestRecipes } = await recipeService.getAllRecipes(6);
                        setRandomRecipes(latestRecipes);

                        const popularRecipeData = await recipeService.getPopularRecipes(6);
                        setPopularRecipes(popularRecipeData);

                        console.log('✅ Firebase 레시피 조회 성공');
                    } catch (firebaseError) {
                        console.warn('⚠️ Firebase 레시피 조회도 실패:', firebaseError.message);

                        // 3순위: 하드코딩된 fallback 데이터 사용
                        console.log('🔄 Fallback 데이터 사용');
                        const mockRecipes = Object.entries(recipeData).map(([id, data]) => ({
                            id,
                            title: data.name,
                            imageUrl: data.imageUrl,
                            category: '한식',
                            cookTime: '30분',
                            description: data.description
                        }));
                        setRandomRecipes(mockRecipes.slice(0, 6));
                        setPopularRecipes(mockRecipes.slice(0, 6));
                    }
                }

            } catch (err) {
                console.error('레시피 데이터 로드 오류:', err);
                setError('레시피를 불러오는 중 오류가 발생했습니다.');

                // 오류 발생 시 임시 데이터 사용
                const mockRecipes = Object.entries(recipeData).map(([id, data]) => ({
                    id,
                    title: data.name,
                    imageUrl: data.imageUrl,
                    category: '한식',
                    cookTime: '30분',
                    description: data.description
                }));
                setRandomRecipes(mockRecipes.slice(0, 6));
                setPopularRecipes(mockRecipes.slice(0, 6));
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [currentUser]);

    // 확장된 카테고리 데이터
    const categories = [
        { type: 'korean', name: '한식', icon: 'korean.png' },
        { type: 'japanese', name: '일식', icon: 'japanese.png' },
        { type: 'chinese', name: '중식', icon: 'chinese.png' },
        { type: 'western', name: '양식', icon: 'western.png' },
        { type: 'bakery', name: '베이커리', icon: 'korean.png' },
        { type: 'brunch', name: '브런치', icon: 'japanese.png' },
        { type: 'dessert', name: '디저트', icon: 'chinese.png' },
        { type: 'salad', name: '샐러드', icon: 'western.png' },
    ];

    // 추천 레시피 데이터
    const featuredRecipes = [
        { id: 'kimchi-stew', name: '김치찌개', image: '/images/home/kimchi-stew.jpg', category: '한식' },
        { id: 'pasta', name: '파스타', image: '/images/home/pasta.jpg', category: '양식' },
        { id: 'millefeuille', name: '밀푀유나베', image: '/images/home/millefeuille.jpg', category: '일식' },
        { id: 'fried-rice', name: '새우볶음밥', image: '/images/home/kimchi-stew.jpg', category: '중식' },
        { id: 'chicken-steak', name: '치킨 스테이크', image: '/images/home/pasta.jpg', category: '양식' },
    ];

    return (
        <div className="App" style={{ paddingBottom: '120px' }}>
            {/* 통일된 헤더 컴포넌트 사용 */}
            <Header showScrollBanner={true} />

            {/* 배너 이미지 */}
            <div className="main-banner">
                <div className="banner-image-wrap">
                    <img src="/images/home/main-visual.png" alt="main-visual" className="main-visual" />
                    <img src="/images/home/banner-overlay.png" alt="overlay" className="banner-overlay" />
                </div>

                {/* 검색창 */}
                <div className="search-bar">
                    <img src="/images/home/search-icon.png" alt="검색" className="search-icon-inline" />
                    <input
                        type="text"
                        placeholder="오늘은 어떤 요리를 할까요?"
                        onClick={() => navigate('/search')}
                        readOnly
                    />
                </div>
            </div>

            {/* 카테고리 */}
            <div className="section">
                <h3>Categories</h3>
                <div className="category-list">
                    {categories.map((category) => (
                        <div
                            className="category"
                            key={category.type}
                            onClick={() => navigate(`/search?category=${category.type}`)}
                        >
                            <div className="category-img-wrap">
                                <img
                                    src={`/images/categories/${category.icon}`}
                                    alt={category.type}
                                    className="category-img"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.textContent = '🍽️';
                                    }}
                                />
                                <img src="/images/home/plate.png" alt="plate" className="plate-img" />
                            </div>
                            <span>{category.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 베스트 메뉴 */}
            <div className="section">
                <h3>Best Menu</h3>
                {loading ? (
                    <div className="loading-message">레시피를 불러오는 중...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="best-menu">
                        {randomRecipes.length > 0 ? randomRecipes.map((recipe) => (
                            <div className="menu-card" key={recipe.id} onClick={() => navigate(`/recipe/${recipe.id}`)}>
                                <div className="menu-image">
                                    {recipe.imageUrl ? (
                                        <img
                                            src={recipe.imageUrl.startsWith('/uploads/')
                                                ? `http://localhost:8081${recipe.imageUrl}`
                                                : recipe.imageUrl
                                            }
                                            alt={recipe.title}
                                            onError={(e) => {
                                                console.warn('홈 페이지 이미지 로딩 실패:', recipe.imageUrl);
                                                e.target.style.display = 'none';
                                                e.target.parentNode.innerHTML = '<div class="recipe-emoji">🍽️</div>';
                                            }}
                                        />
                                    ) : (
                                        <div className="recipe-emoji">🍽️</div>
                                    )}
                                </div>
                                <span>{recipe.title}</span>
                                <div className="recipe-info">
                                    <small>{recipe.category} • {recipe.cookTime}</small>
                                </div>
                            </div>
                        )) : (
                            <div className="no-recipes">
                                <p>🍳 아직 등록된 레시피가 없습니다</p>
                                <button
                                    onClick={() => navigate('/recipe-form')}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#ff6b35',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginTop: '10px'
                                    }}
                                >
                                    첫 번째 레시피 작성하기
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 추천 레시피 섹션 */}
            <div className="section">
                <h3>🌟 Today's Pick</h3>
                {loading ? (
                    <div className="loading-message">인기 레시피를 불러오는 중...</div>
                ) : (
                    <div className="featured-recipes">
                        {popularRecipes.length > 0 ? popularRecipes.map(recipe => (
                            <div
                                className="featured-recipe-card"
                                key={recipe.id}
                                onClick={() => navigate(`/recipe/${recipe.id}`)}
                            >
                                <div className="recipe-image">
                                    {recipe.imageUrl ? (
                                        <img
                                            src={recipe.imageUrl.startsWith('/uploads/')
                                                ? `http://localhost:8081${recipe.imageUrl}`
                                                : recipe.imageUrl
                                            }
                                            alt={recipe.title}
                                            onError={(e) => {
                                                console.warn('홈 페이지 이미지 로딩 실패:', recipe.imageUrl);
                                                e.target.style.display = 'none';
                                                e.target.parentNode.innerHTML = '<div class="recipe-emoji">🍽️</div>';
                                            }}
                                        />
                                    ) : (
                                        <div className="recipe-emoji">🍽️</div>
                                    )}
                                </div>
                                <div className="recipe-title">{recipe.title}</div>
                                <div className="recipe-category">
                                    <span className="category-badge">{recipe.category}</span>
                                    <span className="likes-count">❤️ {recipe.likesCount || 0}</span>
                                </div>
                            </div>
                        )) : (
                            // 인기 레시피가 없을 때 기존 하드코딩 데이터 사용
                            featuredRecipes.map(recipe => (
                                <div
                                    className="featured-recipe-card"
                                    key={recipe.id}
                                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                                >
                                    <img
                                        src={recipe.image}
                                        alt={recipe.name}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentNode.innerHTML = '<div class="recipe-emoji">🍽️</div>';
                                        }}
                                    />
                                    <div className="recipe-title">{recipe.name}</div>
                                    <div className="recipe-category">
                                        <span className="category-badge">{recipe.category}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav />
        </div>
    );
};

export default Home;



