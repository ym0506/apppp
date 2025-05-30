import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const Recipe = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    // 목 데이터
    const mockRecipe = {
        id: 1,
        title: '토마토 미트볼 파스타',
        image: '🍝',
        cookTime: '10min',
        difficulty: '난이도 하',
        author: {
            name: '계란말이요정',
            avatar: '👨‍🍳'
        },
        ingredients: '다진 고기, 빵가루, 우유, 계란, 양파, 마늘, 토마토홀(또는 토마토캔), 올리브오일, 파스타면, 소금, 후추, 허브(바질/오레가노), 설탕',
        description: '토마토 미트볼 파스타는 부드러운 고기와 진한 토마토 소스가 어우러진, 집에서도 근사하게 즐길 수 있는 이탈리안 요리입니다. 고소하게 구운 미트볼이 토마토 소스에 푹 졸여지며 깊은 풍미를 더하고, 향긋한 허브와 파마산 치즈가 입맛을 돋워줍니다. 특별한 날은 물론, 평범한 저녁도 특별하게 바꿔줄 수 있는 메뉴입니다.',
        steps: [
            '다진 고기에 빵가루, 계란, 다진 마늘·양파, 소금·후추를 넣고 동그랗게 빚어 미트볼을 만듭니다.',
            '팬에 기름을 두르고 미트볼을 겉만 노릇하게 구워줍니다.',
            '다른 팬에 올리브오일을 두르고 다진 마늘·양파를 볶다가 토마토홀, 설탕, 허브, 소금·후추를 넣어 소스를 만듭니다.',
            '여기에 구운 미트볼을 넣고 약불에서 10분간 끓입니다.',
            '소금 넣은 물에 파스타를 삶아 소스와 잘 섞어줍니다.',
            '접시에 담고 파마산 치즈나 바질로 마무리하면 완성!'
        ],
        likes: 47,
        comments: 12
    };

    // 찜 상태 확인
    const checkBookmarkStatus = async () => {
        if (!currentUser) return;

        try {
            const favoritesDoc = await getDoc(doc(db, 'favorites', currentUser.uid));
            if (favoritesDoc.exists()) {
                const recipeIds = favoritesDoc.data().recipeIds || [];
                setIsBookmarked(recipeIds.includes(id));
            }
        } catch (error) {
            console.error('찜 상태 확인 오류:', error);
        }
    };

    // 찜 토글 함수
    const toggleBookmark = async () => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        setBookmarkLoading(true);

        try {
            const favoritesRef = doc(db, 'favorites', currentUser.uid);

            if (isBookmarked) {
                // 찜 해제
                await updateDoc(favoritesRef, {
                    recipeIds: arrayRemove(id)
                });
                setIsBookmarked(false);
            } else {
                // 찜 추가
                const favoritesDoc = await getDoc(favoritesRef);
                if (favoritesDoc.exists()) {
                    await updateDoc(favoritesRef, {
                        recipeIds: arrayUnion(id)
                    });
                } else {
                    await setDoc(favoritesRef, {
                        recipeIds: [id],
                        createdAt: new Date()
                    });
                }
                setIsBookmarked(true);
            }
        } catch (error) {
            console.error('찜 토글 오류:', error);
            alert('찜 기능 오류가 발생했습니다.');
        } finally {
            setBookmarkLoading(false);
        }
    };

    useEffect(() => {
        // 실제로는 API 호출
        setRecipe(mockRecipe);
        setLoading(false);
        checkBookmarkStatus();
    }, [id, currentUser]);

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
                        <p>레시피를 불러오는 중...</p>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    if (!recipe) {
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
                            ❌
                        </div>
                        <p>레시피를 찾을 수 없습니다.</p>
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
                {/* 레시피 메인 이미지 */}
                <div style={{
                    width: '100%',
                    height: '236px',
                    backgroundColor: '#d9d9d9',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <img
                        src="/images/recipe/detail-main.jpg"
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
                        backgroundColor: '#d9d9d9',
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}>
                        레시피 메인 이미지
                    </div>

                    {/* 찜 버튼 */}
                    <button
                        onClick={toggleBookmark}
                        disabled={bookmarkLoading}
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            backgroundColor: isBookmarked ? '#e53935' : 'rgba(255, 255, 255, 0.9)',
                            color: isBookmarked ? '#ffffff' : '#e53935',
                            border: isBookmarked ? 'none' : '2px solid #e53935',
                            borderRadius: '25px',
                            padding: '8px 16px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: bookmarkLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.3s ease',
                            opacity: bookmarkLoading ? 0.6 : 1,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {bookmarkLoading ? '⏳' : (isBookmarked ? '❤️' : '🤍')}
                        {bookmarkLoading ? '처리중...' : (isBookmarked ? '찜 완료' : '찜하기')}
                    </button>

                    {/* 하단 재료/요리 아이콘 */}
                    <div style={{
                        position: 'absolute',
                        bottom: '15px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '80px'
                    }}>
                        <img
                            src="/images/recipe/pasta-icon.png"
                            alt="파스타 아이콘"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#f7d1a9',
                            borderRadius: '50%',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            textAlign: 'center',
                            fontWeight: '600'
                        }}>
                            요리<br />아이콘
                        </div>
                    </div>
                </div>

                {/* 레시피 제목 */}
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#000000',
                    marginBottom: '15px',
                    textAlign: 'center'
                }}>
                    {recipe.title}
                </h1>

                {/* 요리 정보 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#f7d1a9',
                        borderRadius: '15px',
                        padding: '5px 15px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#000000'
                    }}>
                        ⏰ {recipe.cookTime}
                    </div>
                    <div style={{
                        backgroundColor: '#f7d1a9',
                        borderRadius: '15px',
                        padding: '5px 15px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#000000'
                    }}>
                        {recipe.difficulty}
                    </div>
                </div>

                {/* 작성자 정보 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '30px',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#feeb9a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                    }}>
                        {recipe.author.avatar}
                    </div>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#000000'
                    }}>
                        {recipe.author.name}
                    </span>
                </div>

                {/* 재료 섹션 */}
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#e53935',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        🥕 재료
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: '#000000',
                        backgroundColor: '#ffffff',
                        padding: '15px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        {recipe.ingredients}
                    </p>
                </div>

                {/* 내용 섹션 */}
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#e53935',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        📝 내용
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#000000',
                        backgroundColor: '#ffffff',
                        padding: '15px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        {recipe.description}
                    </p>
                </div>

                {/* 요리 과정 */}
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#e53935',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        👩‍🍳 요리 과정
                    </h2>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        padding: '20px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        {recipe.steps.map((step, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                gap: '15px',
                                marginBottom: index < recipe.steps.length - 1 ? '15px' : '0'
                            }}>
                                <div style={{
                                    minWidth: '24px',
                                    height: '24px',
                                    backgroundColor: '#e53935',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    fontSize: '12px',
                                    fontWeight: '700'
                                }}>
                                    {index + 1}
                                </div>
                                <p style={{
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    color: '#000000',
                                    margin: 0,
                                    flex: 1
                                }}>
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 좋아요/댓글 정보 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        <span>👍</span>
                        {recipe.likes} 좋아요
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        <span>💬</span>
                        {recipe.comments} 댓글
                    </div>
                </div>
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav />
        </div>
    );
};

export default Recipe; 