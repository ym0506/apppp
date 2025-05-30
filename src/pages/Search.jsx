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

    // Mock 데이터 (실제 프로덕션에서는 Firebase에서 가져옴)
    const mockRecipes = [
        {
            id: 1,
            title: '제육볶음',
            category: '한식',
            image: '/images/home/kimchi-stew.jpg',
            bgColor: '#f6eadd',
            description: '매콤하고 달콤한 제육볶음',
            author: '계란말이요정',
            likes: 24,
            cookTime: '20분'
        },
        {
            id: 2,
            title: '토마토 미트볼 파스타',
            category: '양식',
            image: '/images/home/pasta.jpg',
            bgColor: '#d9d9d9',
            description: '진한 토마토 소스의 파스타',
            author: '파스타킹',
            likes: 47,
            cookTime: '30분'
        },
        {
            id: 3,
            title: '돼지고기 김치찌개',
            category: '한식',
            image: '/images/home/kimchi-stew.jpg',
            bgColor: '#f6eadd',
            description: '시원하고 얼큰한 김치찌개',
            author: '김치러버',
            likes: 35,
            cookTime: '25분'
        },
        {
            id: 4,
            title: '밀푀유나베',
            category: '일식',
            image: '/images/home/millefeuille.jpg',
            bgColor: '#f6eadd',
            description: '부드러운 밀푀유나베',
            author: '일식마스터',
            likes: 18,
            cookTime: '40분'
        },
        {
            id: 5,
            title: '치킨 카레',
            category: '양식',
            image: '/images/home/pasta.jpg',
            bgColor: '#fff4e6',
            description: '진한 치킨 카레',
            author: '카레요정',
            likes: 29,
            cookTime: '35분'
        },
        {
            id: 6,
            title: '새우볶음밥',
            category: '한식',
            image: '/images/home/kimchi-stew.jpg',
            bgColor: '#f6eadd',
            description: '고소한 새우볶음밥',
            author: '볶음밥왕',
            likes: 31,
            cookTime: '15분'
        },
        {
            id: 7,
            title: '크로와상',
            category: '베이커리',
            image: '/images/home/millefeuille.jpg',
            bgColor: '#fff8dc',
            description: '바삭한 프랑스 크로와상',
            author: '베이커리셰프',
            likes: 22,
            cookTime: '180분'
        },
        {
            id: 8,
            title: '아보카도 토스트',
            category: '브런치',
            image: '/images/home/pasta.jpg',
            bgColor: '#f0fff0',
            description: '건강한 아보카도 토스트',
            author: '헬시쿡',
            likes: 16,
            cookTime: '10분'
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
            // const recipesRef = collection(db, 'recipes');
            // const q = query(recipesRef, orderBy('createdAt', 'desc'));
            // const querySnapshot = await getDocs(q);
            // const recipesData = querySnapshot.docs.map(doc => ({
            //     id: doc.id,
            //     ...doc.data()
            // }));

            // 임시로 Mock 데이터 사용
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

    return (
        <div style={{ paddingBottom: '100px' }}>
            {/* 통일된 헤더 컴포넌트 추가 */}
            <Header showScrollBanner={false} />

            <div className="main-container">
                {/* 배경 장식 원들 */}
                <div style={{
                    position: 'absolute',
                    top: '130px',
                    left: '-30px',
                    width: '140px',
                    height: '140px',
                    backgroundColor: '#f6e4f2',
                    borderRadius: '50%',
                    zIndex: 1
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '67px',
                    left: '-50px',
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#f7d1a9',
                    borderRadius: '50%',
                    zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    {/* 상단 제목과 캐릭터 */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '20px'
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '20px',
                                fontWeight: '800',
                                color: '#000000',
                                margin: '0 0 5px 0'
                            }}>
                                오늘은 어떤<br />요리를 할까요?
                            </h1>
                            <p style={{
                                fontSize: '14px',
                                color: '#666666',
                                margin: '0'
                            }}>
                                원하는 레시피를 검색해보세요
                            </p>
                        </div>

                        {/* 캐릭터 이미지 */}
                        <div style={{ position: 'relative' }}>
                            <img
                                src="/images/search/character.png"
                                alt="검색 캐릭터"
                                style={{
                                    width: '99px',
                                    height: '99px',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            {/* 캐릭터 이미지 fallback */}
                            <div style={{
                                width: '99px',
                                height: '99px',
                                backgroundColor: '#f7d1a9',
                                borderRadius: '50%',
                                display: 'none',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '50px'
                            }}>
                                👨‍🍳
                            </div>
                        </div>
                    </div>

                    {/* 검색 입력창 */}
                    <div style={{
                        position: 'relative',
                        marginBottom: '20px'
                    }}>
                        <input
                            type="text"
                            placeholder="레시피 이름, 재료, 작성자 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '15px 50px 15px 20px',
                                border: '2px solid #f0f0f0',
                                borderRadius: '30px',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#e53935'}
                            onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    color: '#999',
                                    cursor: 'pointer',
                                    padding: '0',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* 카테고리 필터 */}
                    <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: '10px',
                        marginBottom: '20px',
                        paddingBottom: '5px'
                    }}>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: selectedCategory === category ? '#e53935' : '#f8f8f8',
                                    color: selectedCategory === category ? 'white' : '#666',
                                    border: 'none',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* 검색 결과 카운트 */}
                    <div style={{
                        marginBottom: '15px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        {searchTerm || selectedCategory !== 'ALL' ? (
                            <>
                                검색 결과: <strong style={{ color: '#e53935' }}>{filteredRecipes.length}개</strong> 레시피
                                {searchTerm && (
                                    <span style={{ color: '#999', fontSize: '12px', marginLeft: '8px' }}>
                                        '{searchTerm}' 검색
                                    </span>
                                )}
                            </>
                        ) : (
                            `전체 <strong style="color: #e53935;">${recipes.length}개</strong> 레시피`
                        )}
                    </div>

                    {/* 레시피 목록 */}
                    <div style={{ marginBottom: '20px' }}>
                        {loading ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '50px 0',
                                color: '#666'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '3px solid #f3f3f3',
                                    borderTop: '3px solid #e53935',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                <span style={{ marginLeft: '15px' }}>레시피를 불러오는 중...</span>
                            </div>
                        ) : error ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '50px 20px',
                                color: '#666',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '40px', marginBottom: '15px' }}>😞</div>
                                <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>오류가 발생했습니다</p>
                                <p style={{ margin: '0', fontSize: '14px' }}>{error}</p>
                                <button
                                    onClick={loadRecipes}
                                    style={{
                                        marginTop: '20px',
                                        padding: '10px 20px',
                                        backgroundColor: '#e53935',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '20px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    다시 시도
                                </button>
                            </div>
                        ) : filteredRecipes.length === 0 ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '50px 20px',
                                color: '#666',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔍</div>
                                <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>검색 결과가 없습니다</p>
                                <p style={{ margin: '0', fontSize: '14px' }}>
                                    다른 키워드로 검색해보세요
                                </p>
                                {(searchTerm || selectedCategory !== 'ALL') && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('ALL');
                                        }}
                                        style={{
                                            marginTop: '15px',
                                            padding: '8px 16px',
                                            backgroundColor: '#f8f8f8',
                                            color: '#666',
                                            border: 'none',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        전체 보기
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px'
                            }}>
                                {filteredRecipes.map(recipe => (
                                    <Link
                                        key={recipe.id}
                                        to={`/recipe/${recipe.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div style={{
                                            backgroundColor: recipe.bgColor || '#f6eadd',
                                            borderRadius: '15px',
                                            padding: '15px',
                                            height: '160px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            cursor: 'pointer'
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
                                                        flex: 1
                                                    }}>
                                                        {recipe.title}
                                                    </h3>
                                                    <img
                                                        src={recipe.image}
                                                        alt={recipe.title}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '8px',
                                                            objectFit: 'cover',
                                                            marginLeft: '8px',
                                                            flexShrink: 0
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#ddd',
                                                        borderRadius: '8px',
                                                        display: 'none',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '16px',
                                                        marginLeft: '8px',
                                                        flexShrink: 0
                                                    }}>
                                                        🍽️
                                                    </div>
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
                                                    by {recipe.author}
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
                                                        ❤️ {recipe.likes}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '10px',
                                                        color: '#666'
                                                    }}>
                                                        ⏱️ {recipe.cookTime}
                                                    </span>
                                                </div>

                                                <span style={{
                                                    fontSize: '9px',
                                                    color: '#999',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                    padding: '2px 6px',
                                                    borderRadius: '8px'
                                                }}>
                                                    {recipe.category}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BottomNav />

            {/* 로딩 애니메이션 CSS */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Search; 