import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Link } from 'react-router-dom';
import {
    likeService,
    favoriteService,
    commentService,
    recipeStatsService
} from '../utils/firebaseUtils';
// 백엔드 API 서비스 추가
import { getRecipeById } from '../services/apiService';

const Recipe = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    // 댓글 관련 상태
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(true);

    // 통계 관련 상태
    const [stats, setStats] = useState({
        likesCount: 0,
        commentsCount: 0
    });

    // 확장된 레시피 데이터베이스 - 각 음식별 고유 정보 (백엔드 API 실패 시 fallback 용도)
    const recipeDatabase = {
        'kimchi-stew': {
            id: 'kimchi-stew',
            title: '돼지고기 김치찌개',
            image: '🥘',
            imageUrl: '/images/home/kimchi-stew.jpg', // 이미지 URL 추가
            cookTime: '25min',
            difficulty: '난이도 중',
            author: {
                name: '김치요정',
                avatar: '👨‍🍳'
            },
            ingredients: '돼지고기 앞다리살 200g, 신김치 300g, 김치국물 100ml, 양파 1/2개, 대파 1대, 마늘 3쪽, 고춧가루 1큰술, 된장 1작은술, 설탕 1작은술, 참기름, 물 400ml, 두부 1/3모',
            description: '깊은 맛의 돼지고기와 잘 익은 김치가 만나 시원하고 칼칼한 국물이 일품인 한국의 대표 찌개입니다. 추운 날씨에 몸을 따뜻하게 해주는 최고의 음식으로, 밥과 함께 먹으면 더욱 맛있습니다.',
            steps: [
                '돼지고기는 한입 크기로 썰고, 신김치는 3cm 길이로 썰어 준비합니다.',
                '팬에 참기름을 두르고 돼지고기를 볶다가 김치를 넣어 함께 볶습니다.',
                '고춧가루와 된장을 넣고 볶다가 물과 김치국물을 부어 끓입니다.',
                '15분간 끓인 후 썬 양파와 두부를 넣고 5분 더 끓입니다.',
                '마지막에 대파를 넣고 설탕으로 간을 맞춰 완성합니다.'
            ]
        },
        'pasta': {
            id: 'pasta',
            title: '토마토 미트볼 파스타',
            image: '🍝',
            imageUrl: '/images/home/pasta.jpg',
            cookTime: '35min',
            difficulty: '난이도 중',
            author: {
                name: '파스타마스터',
                avatar: '👨‍🍳'
            },
            ingredients: '다진 고기 300g, 빵가루 3큰술, 우유 2큰술, 계란 1개, 양파 1개, 마늘 4쪽, 토마토홀 400g, 올리브오일, 파스타면 300g, 소금, 후추, 바질, 오레가노, 설탕 1작은술, 파마산 치즈',
            description: '부드러운 미트볼과 진한 토마토 소스가 어우러진 이탈리안 스타일의 정통 파스타입니다. 고소하게 구운 미트볼이 토마토 소스에 푹 졸여지며 깊은 풍미를 더하고, 향긋한 허브와 파마산 치즈가 입맛을 돋워줍니다.',
            steps: [
                '다진 고기에 빵가루, 우유, 계란, 다진 마늘·양파, 소금·후추를 넣고 동그랗게 빚어 미트볼을 만듭니다.',
                '팬에 올리브오일을 두르고 미트볼을 겉만 노릇하게 구워줍니다.',
                '다른 팬에 올리브오일을 두르고 다진 마늘·양파를 볶다가 토마토홀을 넣어 으깹니다.',
                '설탕, 바질, 오레가노, 소금·후추를 넣고 구운 미트볼을 넣어 약불에서 15분간 끓입니다.',
                '소금 넣은 물에 파스타를 삶아 소스와 잘 섞어줍니다.',
                '접시에 담고 파마산 치즈와 바질로 마무리하면 완성!'
            ]
        },
        'millefeuille': {
            id: 'millefeuille',
            title: '밀푀유나베',
            image: '🍲',
            imageUrl: '/images/home/millefeuille.jpg',
            cookTime: '20min',
            difficulty: '난이도 하',
            author: {
                name: '나베킹',
                avatar: '👨‍🍳'
            },
            ingredients: '배추 1/2포기, 얇은 돼지고기 300g, 청주 2큰술, 간장 2큰술, 다시마 우린 물 300ml, 생강 1쪽, 대파 1대, 팽이버섯 1팩, 소금, 후추',
            description: '배추와 고기를 켜켜이 쌓아 만든 일본식 전골 요리입니다. 깔끔하고 담백한 국물이 특징이며, 배추의 단맛과 돼지고기의 고소함이 조화롭게 어우러집니다.',
            steps: [
                '배추는 4cm 폭으로 자르고, 돼지고기는 청주와 소금으로 밑간을 합니다.',
                '냄비에 배추와 돼지고기를 번갈아 가며 켜켜이 쌓습니다.',
                '다시마 우린 물에 간장, 생강즙을 넣어 육수를 만듭니다.',
                '육수를 부어 뚜껑을 덮고 중불에서 15분간 끓입니다.',
                '팽이버섯과 대파를 넣고 5분 더 끓여 완성합니다.'
            ]
        },
        'fried-rice': {
            id: 'fried-rice',
            title: '새우볶음밥',
            image: '🍤',
            imageUrl: '/images/home/kimchi-stew.jpg', // 임시 이미지
            cookTime: '15min',
            difficulty: '난이도 하',
            author: {
                name: '볶음밥장인',
                avatar: '👨‍🍳'
            },
            ingredients: '새우 200g, 밥 2공기, 계란 2개, 양파 1/2개, 당근 1/3개, 완두콩 50g, 마늘 2쪽, 대파 1대, 식용유, 굴소스 1큰술, 간장 1큰술, 소금, 후추, 참기름',
            description: '프리프리한 새우와 고슬고슬한 밥이 만나 담백하고 고소한 맛의 중화요리입니다. 간단하면서도 영양 만점인 일품요리로 온 가족이 좋아하는 메뉴입니다.',
            steps: [
                '새우는 껍질을 벗기고 등쪽에 칼집을 내어 준비합니다.',
                '계란은 풀어서 스크램블을 만들고, 야채들은 잘게 썹니다.',
                '팬에 기름을 두르고 새우를 볶다가 야채를 넣어 볶습니다.',
                '밥을 넣고 덩어리를 풀면서 볶다가 스크램블 계란을 넣습니다.',
                '굴소스와 간장으로 간을 맞추고 대파와 참기름을 넣어 마무리합니다.'
            ]
        },
        'chicken-steak': {
            id: 'chicken-steak',
            title: '치킨 스테이크',
            image: '🍗',
            imageUrl: '/images/home/pasta.jpg', // 임시 이미지
            cookTime: '30min',
            difficulty: '난이도 중',
            author: {
                name: '스테이크셰프',
                avatar: '👨‍🍳'
            },
            ingredients: '닭가슴살 2장, 올리브오일 3큰술, 마늘 4쪽, 로즈마리 2줄기, 소금, 후추, 버터 2큰술, 화이트와인 50ml, 레몬 1/2개, 감자 2개, 브로콜리 1송이',
            description: '부드럽고 육즙이 풍부한 닭가슴살을 완벽하게 구워낸 서양식 메인 요리입니다. 허브의 향과 버터의 고소함이 어우러져 레스토랑 못지않은 맛을 선사합니다.',
            steps: [
                '닭가슴살은 두께를 균일하게 만들고 소금, 후추로 간을 합니다.',
                '마늘과 로즈마리를 올리브오일에 우려 허브오일을 만듭니다.',
                '팬에 허브오일을 두르고 닭가슴살을 앞뒤로 노릇하게 굽습니다.',
                '화이트와인을 넣고 알코올을 날린 후 버터를 넣어 소스를 만듭니다.',
                '삶은 감자와 브로콜리를 곁들이고 레몬즙을 뿌려 완성합니다.'
            ]
        },
        'soup': {
            id: 'soup',
            title: '미역국',
            image: '🥣',
            imageUrl: '/images/home/millefeuille.jpg', // 임시 이미지
            cookTime: '15min',
            difficulty: '난이도 하',
            author: {
                name: '국물장인',
                avatar: '👨‍🍳'
            },
            ingredients: '마른 미역 20g, 소고기 100g, 참기름 1큰술, 마늘 2쪽, 물 1L, 국간장 2큰술, 소금, 후추, 대파 1/2대',
            description: '영양이 풍부한 미역으로 끓인 한국의 전통 국물 요리입니다. 깔끔하고 시원한 맛으로 몸보신에 좋고, 생일이나 산후조리 때 빠지지 않는 특별한 음식입니다.',
            steps: [
                '마른 미역은 찬물에 불려 부드러워지면 적당한 크기로 자릅니다.',
                '소고기는 잘게 썰어 참기름에 볶다가 미역을 넣어 함께 볶습니다.',
                '물을 붓고 끓어오르면 중불로 줄여 10분간 끓입니다.',
                '국간장과 다진 마늘을 넣고 간을 맞춥니다.',
                '마지막에 대파를 넣고 한 번 더 끓여 완성합니다.'
            ]
        }
    };

    // 관련 레시피 데이터
    const relatedRecipes = [
        {
            id: 'seafood-pasta',
            title: '해산물 크림파스타',
            image: '/images/home/pasta.jpg',
            category: '양식',
            cookTime: '30분',
            likes: 92
        },
        {
            id: 'spicy-soup',
            title: '매운 김치찌개',
            image: '/images/home/kimchi-stew.jpg',
            category: '한식',
            cookTime: '20분',
            likes: 78
        },
        {
            id: 'fried-chicken',
            title: '치킨 스테이크',
            image: '/images/home/millefeuille.jpg',
            category: '양식',
            cookTime: '40분',
            likes: 65
        }
    ];

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

    // 🔄 데이터 로드 및 구독 설정 - 백엔드 API 우선 사용으로 개선
    useEffect(() => {
        const loadRecipeData = async () => {
            setLoading(true);

            try {
                console.log('🔍 백엔드 API에서 레시피 조회 시도:', id);

                // 1순위: 백엔드 API에서 레시피 조회
                const backendRecipe = await getRecipeById(id);

                if (backendRecipe) {
                    console.log('✅ 백엔드에서 레시피 조회 성공:', backendRecipe);

                    // 백엔드 API 응답을 프론트엔드 형식으로 변환
                    const formattedRecipe = {
                        id: backendRecipe.id,
                        title: backendRecipe.title,
                        image: '🍽️', // 기본 이모지
                        imageUrl: backendRecipe.imageUrl || null, // 백엔드에서 제공하는 이미지 URL
                        cookTime: backendRecipe.cookingTime || backendRecipe.cookTime,
                        difficulty: backendRecipe.difficulty || '난이도 보통',
                        author: {
                            name: backendRecipe.authorName || '익명',
                            avatar: '👨‍🍳'
                        },
                        ingredients: Array.isArray(backendRecipe.ingredients)
                            ? backendRecipe.ingredients.join(', ')
                            : backendRecipe.ingredients || '',
                        description: backendRecipe.content || backendRecipe.description || '',
                        steps: Array.isArray(backendRecipe.steps)
                            ? backendRecipe.steps
                            : [backendRecipe.steps || '요리 과정이 없습니다.'],
                        category: backendRecipe.category || '기타'
                    };

                    setRecipe(formattedRecipe);
                    return; // 성공했으므로 여기서 종료
                }
            } catch (error) {
                console.warn('⚠️ 백엔드 API 레시피 조회 실패:', error.message);
            }

            // 2순위: 하드코딩된 데이터에서 조회 (fallback)
            console.log('🔄 하드코딩 데이터에서 레시피 조회:', id);
            const fallbackRecipe = recipeDatabase[id];

            if (fallbackRecipe) {
                console.log('✅ 하드코딩 데이터에서 레시피 조회 성공');
                setRecipe(fallbackRecipe);
            } else {
                console.error('❌ 레시피를 찾을 수 없음:', id);
                setRecipe(null);
            }
        };

        const loadInitialData = async () => {
            // 레시피 데이터 로드
            await loadRecipeData();

            // 사용자 관련 데이터 로드 (로그인한 경우만)
            if (currentUser) {
                console.log('👤 사용자 데이터 로딩 시작:', currentUser.uid);
                try {
                    // 찜 상태 확인
                    console.log('❤️ 찜 상태 확인 시작');
                    const favorited = await favoriteService.checkIfBookmarked(id, currentUser.uid);
                    console.log('❤️ 찜 상태 확인 완료:', favorited);
                    setIsBookmarked(favorited);

                    // 좋아요 상태 확인
                    console.log('👍 좋아요 상태 확인 시작');
                    const liked = await likeService.checkIfLiked(id, currentUser.uid);
                    console.log('👍 좋아요 상태 확인 완료:', liked);
                    setIsLiked(liked);
                } catch (error) {
                    console.error('❌ 사용자 데이터 로드 상세 오류:', error);
                    console.error('❌ 오류 코드:', error.code, '메시지:', error.message);
                }
            } else {
                console.log('ℹ️ 로그인하지 않은 사용자 - 찜/좋아요 기능 비활성화');
            }

            setLoading(false);
        };

        // 통계 실시간 구독
        const unsubscribeStats = recipeStatsService.subscribeToRecipeStats(id, (newStats) => {
            setStats(newStats);
        });

        // 댓글 실시간 구독 - 지능적 병합 처리
        const unsubscribeComments = commentService.subscribeToComments(id, (firebaseComments) => {
            console.log('📝 댓글 콜백 수신:', firebaseComments.length);
            setComments(prevComments => {
                // 임시 댓글들을 찾아냄
                const tempComments = prevComments.filter(comment => comment.isTemp);

                // Firebase에서 온 실제 댓글들과 임시 댓글들을 병합
                // 중복 제거: 같은 사용자가 같은 시간대에 같은 텍스트로 작성한 댓글 제거
                const mergedComments = [...firebaseComments];

                tempComments.forEach(tempComment => {
                    // 임시 댓글과 동일한 내용의 실제 댓글이 Firebase에 없는 경우에만 유지
                    const isDuplicate = firebaseComments.some(fbComment =>
                        fbComment.userId === tempComment.userId &&
                        fbComment.text === tempComment.text &&
                        Math.abs(fbComment.createdAt.getTime() - tempComment.createdAt.getTime()) < 10000 // 10초 이내
                    );

                    if (!isDuplicate) {
                        mergedComments.unshift(tempComment); // 최신 순으로 유지
                    }
                });

                return mergedComments;
            });
            // 댓글 데이터를 받았으므로 (빈 배열이어도) 로딩 해제
            setCommentsLoading(false);
        });

        // 추가적으로 일회성 댓글 조회도 시도 (실시간 구독이 늦을 경우 대비)
        const loadCommentsOnce = async () => {
            try {
                console.log('🔄 일회성 댓글 조회 시도 - recipeId:', id);
                console.log('📋 현재 레시피 ID 타입:', typeof id, '값:', id);
                const initialComments = await commentService.getComments(id);
                console.log('📝 일회성 댓글 조회 결과:', initialComments.length, '개');

                if (initialComments.length > 0) {
                    console.log('✅ 댓글 있음 - 상태 업데이트');
                    setComments(initialComments);
                } else {
                    console.log('ℹ️ 댓글 없음 - 빈 배열 설정');
                    setComments([]);
                }
                // 일회성 조회 완료 후에도 로딩 해제
                setTimeout(() => {
                    console.log('⏰ 일회성 조회 타임아웃 - 로딩 해제');
                    setCommentsLoading(false);
                }, 2000);
            } catch (error) {
                console.error('❌ 일회성 댓글 조회 실패:', error);
                console.error('❌ 오류 상세:', error.code, error.message);
                // 실패해도 로딩은 해제
                setTimeout(() => {
                    console.log('⏰ 오류 후 타임아웃 - 로딩 해제');
                    setCommentsLoading(false);
                }, 3000);
            }
        };

        // 댓글 로딩 타임아웃 설정 (5초 후 강제로 로딩 해제)
        const commentLoadingTimeout = setTimeout(() => {
            console.log('⏰ 댓글 로딩 타임아웃 - 강제로 로딩 상태 해제');
            setCommentsLoading(false);
        }, 5000);

        loadInitialData();
        loadCommentsOnce();

        // 클린업 함수
        return () => {
            unsubscribeStats();
            unsubscribeComments();
            clearTimeout(commentLoadingTimeout);
        };
    }, [id, currentUser]);

    // 💖 찜 토글 함수
    const toggleBookmark = async () => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        console.log('❤️ 찜 버튼 클릭:', { recipeId: id, userId: currentUser.uid });
        setBookmarkLoading(true);

        try {
            const newBookmarkState = await favoriteService.toggleFavorite(id, currentUser.uid);
            console.log('✅ 찜 토글 성공:', newBookmarkState);
            setIsBookmarked(newBookmarkState);

            // 사용자 피드백
            if (newBookmarkState) {
                console.log('💝 찜 추가됨');
            } else {
                console.log('💔 찜 해제됨');
            }
        } catch (error) {
            console.error('❌ 찜 토글 UI 오류:', error);
            alert('찜 기능 오류가 발생했습니다: ' + error.message);
        } finally {
            setBookmarkLoading(false);
        }
    };

    // 👍 좋아요 토글 함수
    const toggleLike = async () => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        console.log('👍 좋아요 버튼 클릭:', { recipeId: id, userId: currentUser.uid });
        setLikeLoading(true);

        try {
            const newLikeState = await likeService.toggleLike(id, currentUser.uid);
            console.log('✅ 좋아요 토글 성공:', newLikeState);
            setIsLiked(newLikeState);

            // 사용자 피드백
            if (newLikeState) {
                console.log('👍 좋아요 추가됨');
            } else {
                console.log('👎 좋아요 해제됨');
            }
        } catch (error) {
            console.error('❌ 좋아요 토글 UI 오류:', error);
            alert('좋아요 기능 오류가 발생했습니다: ' + error.message);
        } finally {
            setLikeLoading(false);
        }
    };

    // 💬 댓글 추가 함수 - 낙관적 업데이트 적용
    const handleAddComment = async () => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!newComment.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        const commentText = newComment.trim();
        const userName = currentUser.displayName || currentUser.email || '익명 사용자';

        // 임시 댓글 객체 생성 (낙관적 업데이트용)
        const tempComment = {
            id: `temp_${Date.now()}`, // 임시 ID
            recipeId: id,
            userId: currentUser.uid,
            userName,
            text: commentText,
            likes: 0,
            likedBy: [],
            createdAt: new Date(),
            isTemp: true // 임시 댓글 플래그
        };

        setCommentLoading(true);
        setNewComment(''); // 입력창 즉시 클리어

        try {
            // 1. 낙관적 업데이트: 댓글 목록에 즉시 추가
            setComments(prevComments => [tempComment, ...prevComments]);

            // 2. 통계 즉시 업데이트
            setStats(prevStats => ({
                ...prevStats,
                commentsCount: prevStats.commentsCount + 1
            }));

            // 3. Firebase에 실제 댓글 저장
            const savedComment = await commentService.addComment(id, currentUser.uid, userName, commentText);

            // 4. 임시 댓글을 실제 댓글로 교체 (중복 방지)
            setComments(prevComments => {
                // 임시 댓글 제거하고 실제 댓글로 교체
                const withoutTemp = prevComments.filter(comment => comment.id !== tempComment.id);

                // 이미 같은 댓글이 Firebase 구독을 통해 추가되었는지 확인
                const alreadyExists = withoutTemp.some(comment =>
                    comment.id === savedComment.id ||
                    (comment.userId === savedComment.userId &&
                        comment.text === savedComment.text &&
                        Math.abs(comment.createdAt.getTime() - savedComment.createdAt.getTime()) < 5000)
                );

                if (!alreadyExists) {
                    return [{ ...savedComment, isTemp: false }, ...withoutTemp];
                }

                return withoutTemp;
            });

            console.log('✅ 댓글 추가 성공:', savedComment);

        } catch (error) {
            console.error('❌ 댓글 추가 오류:', error);

            // 오류 발생 시 낙관적 업데이트 롤백
            setComments(prevComments =>
                prevComments.filter(comment => comment.id !== tempComment.id)
            );
            setStats(prevStats => ({
                ...prevStats,
                commentsCount: Math.max(0, prevStats.commentsCount - 1)
            }));

            // 입력 내용 복원
            setNewComment(commentText);
            alert('댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setCommentLoading(false);
        }
    };

    // 🗑️ 댓글 삭제 함수
    const handleDeleteComment = async (commentId) => {
        if (!currentUser) return;

        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            try {
                await commentService.deleteComment(commentId, id);
            } catch (error) {
                console.error('댓글 삭제 오류:', error);
                alert('댓글 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    // 👍 댓글 좋아요 토글 함수
    const handleCommentLike = async (commentId) => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            await commentService.toggleCommentLike(commentId, currentUser.uid);
        } catch (error) {
            console.error('댓글 좋아요 오류:', error);
            alert('댓글 좋아요 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return (
            <div style={{ paddingBottom: '120px' }}>
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
            <div style={{ paddingBottom: '120px' }}>
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
                        <h2 style={{ marginBottom: '10px', color: '#333' }}>레시피를 찾을 수 없습니다</h2>
                        <p>요청하신 레시피가 존재하지 않거나 삭제되었습니다.</p>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '120px' }}>
            <Header showScrollBanner={false} />

            <div className="main-container">
                {/* 레시피 메인 이미지 */}
                <div style={{
                    width: '100%',
                    height: '236px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                    border: '2px solid rgba(255, 97, 66, 0.1)'
                }}>
                    {/* 백엔드 이미지 우선 표시, 실패 시 이모지 fallback */}
                    {recipe.imageUrl ? (
                        <img
                            src={recipe.imageUrl.startsWith('/uploads/')
                                ? `http://localhost:8081${recipe.imageUrl}`
                                : recipe.imageUrl
                            }
                            alt={recipe.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '16px'
                            }}
                            onError={(e) => {
                                console.warn('이미지 로딩 실패:', recipe.imageUrl);
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}

                    {/* 이미지 없거나 로딩 실패 시 표시할 fallback */}
                    <div style={{
                        fontSize: '80px',
                        opacity: 0.8,
                        display: recipe.imageUrl ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                    }}>
                        {recipe.image || '🍽️'}
                    </div>

                    <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#333'
                    }}>
                        {recipe.cookTime} • {recipe.difficulty}
                    </div>

                    {/* 찜 버튼 */}
                    <button
                        onClick={toggleBookmark}
                        disabled={bookmarkLoading}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            backgroundColor: isBookmarked ? '#ff6142' : 'rgba(255, 255, 255, 0.95)',
                            color: isBookmarked ? '#ffffff' : '#ff6142',
                            border: isBookmarked ? 'none' : '2px solid #ff6142',
                            borderRadius: '20px',
                            padding: '8px 16px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: bookmarkLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.3s ease',
                            opacity: bookmarkLoading ? 0.6 : 1,
                            boxShadow: '0 4px 12px rgba(255, 97, 66, 0.3)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {bookmarkLoading ? '⏳' : (isBookmarked ? '❤️' : '🤍')}
                        {bookmarkLoading ? '처리중...' : (isBookmarked ? '찜 완료' : '찜하기')}
                    </button>
                </div>

                {/* 레시피 제목 */}
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: '#1a1a1a',
                    marginBottom: '16px',
                    textAlign: 'center',
                    letterSpacing: '-0.02em'
                }}>
                    {recipe.title}
                </h1>

                {/* 요리 정보 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #ffa726, #ffcc02)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(255, 167, 38, 0.3)'
                    }}>
                        ⏰ {recipe.cookTime}
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, #66bb6a, #4caf50)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                    }}>
                        {recipe.difficulty}
                    </div>
                </div>

                {/* 작성자 정보 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '32px',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdrop: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '12px 20px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff8a65, #ff7043)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: '0 4px 12px rgba(255, 138, 101, 0.3)'
                    }}>
                        {recipe.author.avatar}
                    </div>
                    <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1a1a1a'
                    }}>
                        {recipe.author.name}
                    </span>
                </div>

                {/* 좋아요/댓글 정보 - 실시간 업데이트 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '24px',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        <span style={{ color: '#ff6b47', fontSize: '16px' }}>❤️</span>
                        <span style={{ fontWeight: '600' }}>{stats.likesCount}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        <span style={{ color: '#42a5f5', fontSize: '16px' }}>💬</span>
                        <span style={{ fontWeight: '600' }}>{stats.commentsCount}</span>
                    </div>
                </div>

                {/* 재료 섹션 */}
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#ff6142',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        🥕 재료
                    </h2>
                    <div style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#333',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 249, 245, 0.8))',
                        padding: '20px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(255, 97, 66, 0.1)'
                    }}>
                        {recipe.ingredients}
                    </div>
                </div>

                {/* 내용 섹션 */}
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#ff6142',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        📝 요리 소개
                    </h2>
                    <div style={{
                        fontSize: '15px',
                        lineHeight: '1.7',
                        color: '#333',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 249, 245, 0.8))',
                        padding: '20px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(255, 97, 66, 0.1)'
                    }}>
                        {recipe.description}
                    </div>
                </div>

                {/* 요리 과정 */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#ff6142',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        👨‍🍳 요리 과정
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recipe.steps.map((step, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                gap: '16px',
                                padding: '20px',
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 249, 245, 0.8))',
                                borderRadius: '16px',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
                                border: '1px solid rgba(255, 97, 66, 0.1)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #ff6142, #ff8a65)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 12px rgba(255, 97, 66, 0.3)'
                                }}>
                                    {index + 1}
                                </div>
                                <p style={{
                                    fontSize: '15px',
                                    lineHeight: '1.6',
                                    color: '#333',
                                    margin: 0,
                                    flex: 1
                                }}>
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 액션 버튼들 - Firebase 연동 */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '20px'
                }}>
                    <button
                        onClick={toggleLike}
                        disabled={likeLoading}
                        style={{
                            flex: 1,
                            background: isLiked ?
                                'linear-gradient(135deg, #ff6142, #ff8a65)' :
                                'rgba(255, 255, 255, 0.9)',
                            color: isLiked ? 'white' : '#ff6142',
                            border: isLiked ? 'none' : '2px solid #ff6142',
                            borderRadius: '16px',
                            padding: '16px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: likeLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: isLiked ?
                                '0 8px 24px rgba(255, 97, 66, 0.3)' :
                                '0 4px 12px rgba(0, 0, 0, 0.1)',
                            opacity: likeLoading ? 0.6 : 1
                        }}
                    >
                        {likeLoading ? '⏳' : (isLiked ? '❤️' : '👍')} 좋아요 {stats.likesCount}
                    </button>
                    <button style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#ff6142',
                        border: '2px solid #ff6142',
                        borderRadius: '16px',
                        padding: '16px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                    }}>
                        💬 댓글 {stats.commentsCount}
                    </button>
                </div>

                {/* 댓글 입력 섹션 - Firebase 연동 */}
                <div className="comment-input-section">
                    <h4 className="comment-title">
                        <span className="comment-icon">💬</span>
                        댓글 남기기
                    </h4>
                    <div className="comment-input-wrapper">
                        <textarea
                            className="comment-input"
                            placeholder={currentUser ? "이 레시피에 대한 의견을 남겨주세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={!currentUser || commentLoading}
                        />
                        <button
                            className="comment-submit-btn"
                            onClick={handleAddComment}
                            disabled={!currentUser || !newComment.trim() || commentLoading}
                            style={{
                                opacity: (!currentUser || !newComment.trim() || commentLoading) ? 0.5 : 1,
                                cursor: (!currentUser || !newComment.trim() || commentLoading) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <span>{commentLoading ? '등록중...' : '등록'}</span>
                            <span className="submit-icon">{commentLoading ? '⏳' : '📝'}</span>
                        </button>
                    </div>
                </div>

                {/* 댓글 목록 - Firebase 실시간 데이터 */}
                <div className="comments-list">
                    {commentsLoading ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#666'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                            <p>댓글을 불러오는 중...</p>
                        </div>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className={`comment-item ${comment.isTemp ? 'comment-temp' : ''}`}
                                style={{
                                    opacity: comment.isTemp ? 0.7 : 1,
                                    background: comment.isTemp
                                        ? 'rgba(255, 97, 66, 0.05)'
                                        : 'rgba(255, 255, 255, 0.6)'
                                }}
                            >
                                <div className="comment-header">
                                    <div className="comment-avatar">
                                        {comment.userName.charAt(0)}
                                    </div>
                                    <div className="comment-meta">
                                        <span className="comment-author">
                                            {comment.userName}
                                            {comment.isTemp && (
                                                <span style={{
                                                    marginLeft: '6px',
                                                    fontSize: '11px',
                                                    color: '#ff6142',
                                                    fontWeight: '500'
                                                }}>
                                                    (등록중...)
                                                </span>
                                            )}
                                        </span>
                                        <span className="comment-date">
                                            {comment.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                    {currentUser && currentUser.uid === comment.userId && !comment.isTemp && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#999',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                padding: '4px'
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                                <p className="comment-content">{comment.text}</p>
                                <div className="comment-actions">
                                    <button
                                        className="comment-like-btn"
                                        onClick={() => handleCommentLike(comment.id)}
                                        disabled={!currentUser || comment.isTemp}
                                        style={{
                                            opacity: (!currentUser || comment.isTemp) ? 0.5 : 1,
                                            cursor: (!currentUser || comment.isTemp) ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <span>
                                            {comment.likedBy?.includes(currentUser?.uid) ? '❤️' : '👍'}
                                        </span>
                                        <span>{comment.likes || 0}</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#666',
                            background: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '16px'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💭</div>
                            <p>아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
                        </div>
                    )}
                </div>

                {/* 관련 레시피 */}
                <div className="related-recipes-section">
                    <h3 className="section-title">
                        <span className="title-icon">🍽️</span>
                        이런 레시피는 어때요?
                    </h3>
                    <div className="related-recipes-grid">
                        {relatedRecipes.map((recipe) => (
                            <Link
                                key={recipe.id}
                                to={`/recipe/${recipe.id}`}
                                className="related-recipe-card"
                            >
                                <div className="related-card-image">
                                    <img src={recipe.image} alt={recipe.title} />
                                    <div className="related-card-category" style={{
                                        backgroundColor: getCategoryColor(recipe.category)
                                    }}>
                                        {recipe.category}
                                    </div>
                                </div>
                                <div className="related-card-content">
                                    <h4 className="related-card-title">{recipe.title}</h4>
                                    <div className="related-card-meta">
                                        <span className="related-meta-item">
                                            <span>⏰</span>
                                            {recipe.cookTime}
                                        </span>
                                        <span className="related-meta-item">
                                            <span>❤️</span>
                                            {recipe.likes}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 하단 네비게이션 */}
                <div className="recipe-bottom-nav">
                    <Link to="/" className="nav-btn">
                        <span className="nav-icon">🏠</span>
                        <span>홈으로</span>
                    </Link>
                    <Link to="/search" className="nav-btn">
                        <span className="nav-icon">🔍</span>
                        <span>레시피 찾기</span>
                    </Link>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="nav-btn"
                    >
                        <span className="nav-icon">⬆️</span>
                        <span>맨 위로</span>
                    </button>
                </div>
            </div>

            <BottomNav />

            {/* 🎨 레시피 상세 페이지 전용 스타일 */}
            <style jsx>{`
                .recipe-page {
                    padding-bottom: 120px;
                    min-height: 100vh;
                    background: linear-gradient(145deg, 
                        rgba(255, 255, 255, 0.98) 0%, 
                        rgba(254, 253, 251, 0.95) 100%);
                }

                /* ... existing code ... */

                /* 댓글 섹션 개선 */
                .comments-section {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 32px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(255, 97, 66, 0.1);
                }

                .comment-input-section {
                    margin-bottom: 32px;
                }

                .comment-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .comment-icon {
                    font-size: 20px;
                }

                .comment-input-wrapper {
                    position: relative;
                }

                .comment-input {
                    width: 100%;
                    padding: 16px;
                    border: 1.5px solid rgba(255, 97, 66, 0.2);
                    border-radius: 16px;
                    font-size: 14px;
                    font-family: inherit;
                    line-height: 1.5;
                    resize: vertical;
                    min-height: 80px;
                    background: rgba(255, 255, 255, 0.8);
                    transition: all 0.3s ease;
                }

                .comment-input:focus {
                    outline: none;
                    border-color: #ff6142;
                    box-shadow: 0 0 0 3px rgba(255, 97, 66, 0.1);
                    background: white;
                }

                .comment-input::placeholder {
                    color: #999;
                }

                .comment-submit-btn {
                    position: absolute;
                    bottom: 12px;
                    right: 12px;
                    background: linear-gradient(135deg, #ff6142, #ff8a65);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 8px 16px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .comment-submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 97, 66, 0.3);
                }

                .submit-icon {
                    font-size: 16px;
                }

                /* 댓글 목록 */
                .comments-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .comment-item {
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }

                .comment-item:hover {
                    background: rgba(255, 255, 255, 0.8);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                }

                .comment-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .comment-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff6142, #ff8a65);
                    color: white;
                    display: flex;
                    alignItems: 'center';
                    justifyContent: 'center';
                    font-weight: 700;
                    font-size: 16px;
                }

                .comment-meta {
                    flex: 1;
                }

                .comment-author {
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                    display: block;
                    margin-bottom: 2px;
                }

                .comment-date {
                    font-size: 12px;
                    color: #999;
                }

                .comment-content {
                    color: #555;
                    line-height: 1.6;
                    margin-bottom: 12px;
                    font-size: 14px;
                }

                .comment-actions {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                }

                .comment-like-btn, .comment-reply-btn {
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 13px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 8px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }

                .comment-like-btn:hover, .comment-reply-btn:hover {
                    background: rgba(255, 97, 66, 0.1);
                    color: #ff6142;
                }

                /* 관련 레시피 섹션 */
                .related-recipes-section {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 32px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(255, 97, 66, 0.1);
                }

                .related-recipes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                }

                .related-recipe-card {
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 16px;
                    overflow: hidden;
                    text-decoration: none;
                    color: inherit;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .related-recipe-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                    border-color: rgba(255, 97, 66, 0.2);
                }

                .related-card-image {
                    position: relative;
                    height: 120px;
                    overflow: hidden;
                }

                .related-card-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: all 0.3s ease;
                }

                .related-recipe-card:hover .related-card-image img {
                    transform: scale(1.05);
                }

                .related-card-category {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    padding: 4px 8px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 600;
                    color: white;
                    backdrop-filter: blur(10px);
                }

                .related-card-content {
                    padding: 16px;
                }

                .related-card-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .related-card-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .related-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    color: #666;
                    font-weight: 500;
                }

                /* 하단 네비게이션 */
                .recipe-bottom-nav {
                    display: flex;
                    justify-content: center;
                    gap: 16px;
                    padding: 24px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(255, 97, 66, 0.1);
                }

                .nav-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.8);
                    border: 1px solid rgba(255, 97, 66, 0.2);
                    border-radius: 12px;
                    text-decoration: none;
                    color: #333;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    min-width: 80px;
                }

                .nav-btn:hover {
                    background: rgba(255, 97, 66, 0.1);
                    border-color: #ff6142;
                    transform: translateY(-2px);
                    color: #ff6142;
                }

                .nav-icon {
                    font-size: 18px;
                }

                /* 레시피 찾을 수 없음 */
                .recipe-not-found {
                    text-align: center;
                    padding: 80px 20px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }

                .not-found-icon {
                    font-size: 80px;
                    margin-bottom: 24px;
                    opacity: 0.6;
                }

                .not-found-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 12px;
                }

                .not-found-text {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 32px;
                    line-height: 1.5;
                }

                .back-home-btn {
                    display: inline-block;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #ff6142, #ff8a65);
                    color: white;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .back-home-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 97, 66, 0.3);
                }

                /* 반응형 */
                @media (max-width: 480px) {
                    .recipe-container {
                        padding: 20px 16px;
                    }

                    .comments-section,
                    .related-recipes-section {
                        padding: 20px;
                    }

                    .comment-input {
                        padding: 12px;
                        font-size: 13px;
                    }

                    .comment-submit-btn {
                        padding: 6px 12px;
                        font-size: 13px;
                    }

                    .comment-item {
                        padding: 16px;
                    }

                    .comment-avatar {
                        width: 36px;
                        height: 36px;
                        font-size: 14px;
                    }

                    .related-recipes-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }

                    .related-card-image {
                        height: 100px;
                    }

                    .related-card-content {
                        padding: 12px;
                    }

                    .related-card-title {
                        font-size: 13px;
                    }

                    .recipe-bottom-nav {
                        padding: 16px;
                        gap: 12px;
                    }

                    .nav-btn {
                        padding: 10px 12px;
                        font-size: 12px;
                        min-width: 70px;
                    }

                    .nav-icon {
                        font-size: 16px;
                    }

                    .not-found-icon {
                        font-size: 60px;
                    }

                    .not-found-title {
                        font-size: 20px;
                    }

                    .not-found-text {
                        font-size: 14px;
                    }
                }

                /* 임시 댓글 스타일 */
                .comment-temp {
                    position: relative;
                    border: 1px solid rgba(255, 97, 66, 0.2) !important;
                    background: rgba(255, 97, 66, 0.03) !important;
                }

                .comment-temp::before {
                    content: '⏳';
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    font-size: 12px;
                    opacity: 0.6;
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }

                .comment-temp .comment-avatar {
                    background: linear-gradient(135deg, rgba(255, 97, 66, 0.7), rgba(255, 138, 101, 0.7)) !important;
                }

                .comment-temp .comment-content {
                    color: rgba(85, 85, 85, 0.8) !important;
                }
            `}</style>
        </div>
    );
};

export default Recipe; 