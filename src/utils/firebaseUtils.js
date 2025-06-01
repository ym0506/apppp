import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    increment,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    onSnapshot,
    startAfter,
    limit
} from 'firebase/firestore';
import { db } from '../firebase';

// 🎯 좋아요 관련 함수들
export const likeService = {
    // 좋아요 토글
    async toggleLike(recipeId, userId) {
        try {
            console.log('👍 좋아요 토글 시작:', { recipeId, userId });
            const likeId = `${userId}_${recipeId}`;
            const likeRef = doc(db, 'likes', likeId);
            const recipeRef = doc(db, 'recipes', recipeId);

            const likeDoc = await getDoc(likeRef);
            console.log('👍 기존 좋아요 상태:', likeDoc.exists());

            if (likeDoc.exists()) {
                // 좋아요 취소
                console.log('👍 좋아요 취소 처리');
                await deleteDoc(likeRef);
                await updateDoc(recipeRef, {
                    likesCount: increment(-1)
                });
                console.log('✅ 좋아요 취소 완료');
                return false;
            } else {
                // 좋아요 추가
                console.log('👍 좋아요 추가 처리');
                await setDoc(likeRef, {
                    userId,
                    recipeId,
                    createdAt: serverTimestamp()
                });

                // 레시피 문서가 없으면 생성
                const recipeDoc = await getDoc(recipeRef);
                if (!recipeDoc.exists()) {
                    console.log('📝 레시피 문서 생성');
                    await setDoc(recipeRef, {
                        id: recipeId,
                        likesCount: 1,
                        commentsCount: 0,
                        createdAt: serverTimestamp()
                    });
                } else {
                    console.log('📝 레시피 좋아요 수 증가');
                    await updateDoc(recipeRef, {
                        likesCount: increment(1)
                    });
                }
                console.log('✅ 좋아요 추가 완료');
                return true;
            }
        } catch (error) {
            console.error('❌ 좋아요 토글 상세 오류:', error);
            console.error('❌ 오류 코드:', error.code, '메시지:', error.message);
            throw error;
        }
    },

    // 좋아요 상태 확인
    async checkIfLiked(recipeId, userId) {
        try {
            console.log('🔍 좋아요 상태 확인:', { recipeId, userId });
            const likeId = `${userId}_${recipeId}`;
            const likeRef = doc(db, 'likes', likeId);
            const likeDoc = await getDoc(likeRef);
            const isLiked = likeDoc.exists();
            console.log('✅ 좋아요 상태 결과:', isLiked);
            return isLiked;
        } catch (error) {
            console.error('❌ 좋아요 상태 확인 오류:', error);
            console.error('❌ 오류 코드:', error.code, '메시지:', error.message);
            return false;
        }
    },

    // 사용자가 좋아요한 레시피 목록 가져오기
    async getLikedRecipes(userId) {
        try {
            const q = query(
                collection(db, 'likes'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const likedRecipeIds = [];
            snapshot.forEach((doc) => {
                likedRecipeIds.push(doc.data().recipeId);
            });
            return likedRecipeIds;
        } catch (error) {
            console.error('좋아요한 레시피 가져오기 오류:', error);
            return [];
        }
    },

    // 좋아요 수 가져오기
    async getLikesCount(recipeId) {
        try {
            const recipeDoc = await getDoc(doc(db, 'recipes', recipeId));
            return recipeDoc.exists() ? (recipeDoc.data().likesCount || 0) : 0;
        } catch (error) {
            console.error('좋아요 수 가져오기 오류:', error);
            return 0;
        }
    }
};

// ❤️ 찜 관련 함수들
export const favoriteService = {
    // 찜 토글
    async toggleFavorite(recipeId, userId) {
        try {
            console.log('❤️ 찜 토글 시작:', { recipeId, userId });
            const favoritesRef = doc(db, 'favorites', userId);
            const favoritesDoc = await getDoc(favoritesRef);

            if (favoritesDoc.exists()) {
                const recipeIds = favoritesDoc.data().recipeIds || [];
                const isBookmarked = recipeIds.includes(recipeId);
                console.log('❤️ 기존 찜 상태:', isBookmarked, '찜 목록:', recipeIds);

                if (isBookmarked) {
                    // 찜 해제
                    console.log('❤️ 찜 해제 처리');
                    await updateDoc(favoritesRef, {
                        recipeIds: arrayRemove(recipeId),
                        updatedAt: serverTimestamp()
                    });
                    console.log('✅ 찜 해제 완료');
                    return false;
                } else {
                    // 찜 추가
                    console.log('❤️ 찜 추가 처리');
                    await updateDoc(favoritesRef, {
                        recipeIds: arrayUnion(recipeId),
                        updatedAt: serverTimestamp()
                    });
                    console.log('✅ 찜 추가 완료');
                    return true;
                }
            } else {
                // 첫 찜 추가
                console.log('❤️ 첫 찜 문서 생성');
                await setDoc(favoritesRef, {
                    recipeIds: [recipeId],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                console.log('✅ 첫 찜 추가 완료');
                return true;
            }
        } catch (error) {
            console.error('❌ 찜 토글 상세 오류:', error);
            console.error('❌ 오류 코드:', error.code, '메시지:', error.message);
            throw error;
        }
    },

    // 찜 상태 확인
    async checkIfBookmarked(recipeId, userId) {
        try {
            console.log('🔍 찜 상태 확인:', { recipeId, userId });
            const favoritesRef = doc(db, 'favorites', userId);
            const favoritesDoc = await getDoc(favoritesRef);

            if (favoritesDoc.exists()) {
                const recipeIds = favoritesDoc.data().recipeIds || [];
                const isBookmarked = recipeIds.includes(recipeId);
                console.log('✅ 찜 상태 결과:', isBookmarked, '찜 목록:', recipeIds);
                return isBookmarked;
            }
            console.log('ℹ️ 찜 문서 없음 - false 반환');
            return false;
        } catch (error) {
            console.error('❌ 찜 상태 확인 오류:', error);
            console.error('❌ 오류 코드:', error.code, '메시지:', error.message);
            return false;
        }
    },

    // 사용자의 찜한 레시피 목록 가져오기
    async getFavoriteRecipes(userId) {
        try {
            console.log('📋 찜 목록 조회:', userId);
            const favoritesDoc = await getDoc(doc(db, 'favorites', userId));
            if (favoritesDoc.exists()) {
                const recipeIds = favoritesDoc.data().recipeIds || [];
                console.log('✅ 찜 목록 조회 결과:', recipeIds.length, '개');
                return recipeIds;
            }
            console.log('ℹ️ 찜 목록 없음');
            return [];
        } catch (error) {
            console.error('❌ 찜 목록 가져오기 오류:', error);
            console.error('❌ 오류 코드:', error.code, '메시지:', error.message);
            return [];
        }
    }
};

// 💬 댓글 관련 함수들
export const commentService = {
    // 댓글 추가
    async addComment(recipeId, userId, userName, text) {
        try {
            const commentsRef = collection(db, 'comments');
            const recipeRef = doc(db, 'recipes', recipeId);

            // 댓글 추가
            const commentDoc = await addDoc(commentsRef, {
                recipeId,
                userId,
                userName,
                text: text.trim(),
                likes: 0,
                likedBy: [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // 레시피 댓글 수 증가
            const recipeDoc = await getDoc(recipeRef);
            if (!recipeDoc.exists()) {
                await setDoc(recipeRef, {
                    id: recipeId,
                    likesCount: 0,
                    commentsCount: 1,
                    createdAt: serverTimestamp()
                });
            } else {
                await updateDoc(recipeRef, {
                    commentsCount: increment(1)
                });
            }

            return {
                id: commentDoc.id,
                recipeId,
                userId,
                userName,
                text: text.trim(),
                likes: 0,
                likedBy: [],
                createdAt: new Date()
            };
        } catch (error) {
            console.error('댓글 추가 오류:', error);
            throw error;
        }
    },

    // 댓글 목록 가져오기
    async getComments(recipeId) {
        try {
            console.log('🔍 댓글 조회 시작 - recipeId:', recipeId);

            // 디버깅: 모든 댓글 먼저 확인
            try {
                const allCommentsSnapshot = await getDocs(collection(db, 'comments'));
                console.log('🔍 전체 댓글 수:', allCommentsSnapshot.docs.length);
                allCommentsSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    console.log('📋 전체 댓글:', doc.id, '- recipeId:', data.recipeId, '- text:', data.text?.substring(0, 20));
                });
            } catch (debugError) {
                console.error('❌ 전체 댓글 조회 실패:', debugError);
            }

            // orderBy 없이 먼저 시도
            const commentsQuery = query(
                collection(db, 'comments'),
                where('recipeId', '==', recipeId)
            );

            const snapshot = await getDocs(commentsQuery);
            console.log('📊 댓글 쿼리 결과:', snapshot.docs.length, '개');

            if (snapshot.docs.length > 0) {
                console.log('📝 첫 번째 댓글 데이터:', snapshot.docs[0].data());
            }

            const comments = snapshot.docs.map(doc => {
                const data = doc.data();
                console.log('🔄 댓글 처리:', doc.id, data);
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date()
                };
            });

            // 클라이언트에서 정렬
            comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            console.log('✅ 최종 댓글 목록:', comments.length, '개');
            return comments;
        } catch (error) {
            console.error('❌ 댓글 가져오기 상세 오류:', error);
            console.error('❌ 오류 상세:', error.code, error.message);
            return [];
        }
    },

    // 댓글 삭제
    async deleteComment(commentId, recipeId) {
        try {
            await deleteDoc(doc(db, 'comments', commentId));

            // 레시피 댓글 수 감소
            const recipeRef = doc(db, 'recipes', recipeId);
            await updateDoc(recipeRef, {
                commentsCount: increment(-1)
            });

            return true;
        } catch (error) {
            console.error('댓글 삭제 오류:', error);
            throw error;
        }
    },

    // 댓글 좋아요 토글
    async toggleCommentLike(commentId, userId) {
        try {
            const commentRef = doc(db, 'comments', commentId);
            const commentDoc = await getDoc(commentRef);

            if (commentDoc.exists()) {
                const likedBy = commentDoc.data().likedBy || [];
                const isLiked = likedBy.includes(userId);

                if (isLiked) {
                    // 좋아요 취소
                    await updateDoc(commentRef, {
                        likes: increment(-1),
                        likedBy: arrayRemove(userId),
                        updatedAt: serverTimestamp()
                    });
                    return false;
                } else {
                    // 좋아요 추가
                    await updateDoc(commentRef, {
                        likes: increment(1),
                        likedBy: arrayUnion(userId),
                        updatedAt: serverTimestamp()
                    });
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('댓글 좋아요 토글 오류:', error);
            throw error;
        }
    },

    // 실시간 댓글 구독
    subscribeToComments(recipeId, callback) {
        try {
            console.log('🔄 댓글 구독 시작:', recipeId);

            // orderBy 없이 먼저 시도
            const commentsQuery = query(
                collection(db, 'comments'),
                where('recipeId', '==', recipeId)
            );

            return onSnapshot(commentsQuery,
                (snapshot) => {
                    console.log('✅ 댓글 스냅샷 수신:', snapshot.docs.length, '개');

                    if (snapshot.docs.length > 0) {
                        console.log('📝 첫 번째 스냅샷 댓글:', snapshot.docs[0].data());
                    }

                    const comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        console.log('🔄 스냅샷 댓글 처리:', doc.id, data);
                        return {
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt?.toDate() || new Date()
                        };
                    });

                    // 클라이언트에서 정렬
                    comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                    console.log('✅ 스냅샷 최종 댓글:', comments.length, '개');
                    callback(comments);
                },
                (error) => {
                    console.error('❌ 댓글 구독 실시간 오류:', error);
                    console.error('❌ 구독 오류 상세:', error.code, error.message);
                    // 실시간 구독 실패 시 일회성 조회로 폴백
                    this.getComments(recipeId).then(comments => {
                        console.log('🔄 폴백으로 댓글 조회:', comments.length);
                        callback(comments);
                    }).catch(fallbackError => {
                        console.error('❌ 폴백 댓글 조회도 실패:', fallbackError);
                        callback([]);
                    });
                }
            );
        } catch (error) {
            console.error('❌ 댓글 구독 초기화 오류:', error);
            console.error('❌ 구독 초기화 오류 상세:', error.code, error.message);
            // 구독 실패 시 일회성 조회로 폴백
            this.getComments(recipeId).then(comments => {
                console.log('🔄 초기화 실패 시 폴백으로 댓글 조회:', comments.length);
                callback(comments);
            }).catch(fallbackError => {
                console.error('❌ 초기화 실패 시 폴백 댓글 조회도 실패:', fallbackError);
                callback([]);
            });
            return () => { };
        }
    }
};

// 📊 레시피 통계 관련 함수들
export const recipeStatsService = {
    // 레시피 통계 가져오기
    async getRecipeStats(recipeId) {
        try {
            const recipeDoc = await getDoc(doc(db, 'recipes', recipeId));
            if (recipeDoc.exists()) {
                return {
                    likesCount: recipeDoc.data().likesCount || 0,
                    commentsCount: recipeDoc.data().commentsCount || 0
                };
            }
            return { likesCount: 0, commentsCount: 0 };
        } catch (error) {
            console.error('레시피 통계 가져오기 오류:', error);
            return { likesCount: 0, commentsCount: 0 };
        }
    },

    // 실시간 레시피 통계 구독
    subscribeToRecipeStats(recipeId, callback) {
        try {
            const recipeRef = doc(db, 'recipes', recipeId);
            return onSnapshot(recipeRef, (doc) => {
                if (doc.exists()) {
                    callback({
                        likesCount: doc.data().likesCount || 0,
                        commentsCount: doc.data().commentsCount || 0
                    });
                } else {
                    callback({ likesCount: 0, commentsCount: 0 });
                }
            });
        } catch (error) {
            console.error('레시피 통계 구독 오류:', error);
            return () => { };
        }
    }
};

// 🔄 배치 작업 유틸리티
export const batchService = {
    // 사용자 데이터 일괄 삭제 (계정 삭제 시)
    async deleteUserData(userId) {
        try {
            // 사용자의 좋아요 삭제
            const likesQuery = query(collection(db, 'likes'), where('userId', '==', userId));
            const likesSnapshot = await getDocs(likesQuery);
            const deletePromises = [];

            likesSnapshot.docs.forEach(doc => {
                deletePromises.push(deleteDoc(doc.ref));
            });

            // 사용자의 댓글 삭제
            const commentsQuery = query(collection(db, 'comments'), where('userId', '==', userId));
            const commentsSnapshot = await getDocs(commentsQuery);

            commentsSnapshot.docs.forEach(doc => {
                deletePromises.push(deleteDoc(doc.ref));
            });

            // 사용자의 찜 목록 삭제
            deletePromises.push(deleteDoc(doc(db, 'favorites', userId)));

            await Promise.all(deletePromises);
            return true;
        } catch (error) {
            console.error('사용자 데이터 삭제 오류:', error);
            throw error;
        }
    }
};

// 📖 레시피 관련 함수들 (Firebase 전용)
export const recipeService = {
    // 모든 레시피 가져오기
    async getAllRecipes(limit = 10, page = 1) {
        try {
            let q = query(
                collection(db, 'recipes'),
                where('isPublic', '==', true),
                orderBy('createdAt', 'desc'),
                limit(limit)
            );

            const snapshot = await getDocs(q);
            const recipes = [];
            snapshot.forEach((doc) => {
                recipes.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return {
                recipes,
                hasMore: snapshot.docs.length === limit,
                totalCount: recipes.length
            };
        } catch (error) {
            console.error('레시피 목록 가져오기 오류:', error);
            return { recipes: [], hasMore: false, totalCount: 0 };
        }
    },

    // 특정 레시피 가져오기
    async getRecipeById(recipeId) {
        try {
            const docRef = doc(db, 'recipes', recipeId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                };
            } else {
                console.log('레시피를 찾을 수 없습니다.');
                return null;
            }
        } catch (error) {
            console.error('레시피 가져오기 오류:', error);
            return null;
        }
    },

    // 사용자별 레시피 가져오기
    async getRecipesByUser(userId, limit = 10) {
        try {
            const q = query(
                collection(db, 'recipes'),
                where('authorId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(limit)
            );

            const snapshot = await getDocs(q);
            const recipes = [];
            snapshot.forEach((doc) => {
                recipes.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return recipes;
        } catch (error) {
            console.error('사용자 레시피 가져오기 오류:', error);
            return [];
        }
    },

    // 레시피 검색
    async searchRecipes(searchTerm, category = null, limit = 20) {
        try {
            let q = query(
                collection(db, 'recipes'),
                where('isPublic', '==', true),
                orderBy('createdAt', 'desc'),
                limit(limit)
            );

            if (category && category !== 'ALL') {
                q = query(
                    collection(db, 'recipes'),
                    where('isPublic', '==', true),
                    where('category', '==', category),
                    orderBy('createdAt', 'desc'),
                    limit(limit)
                );
            }

            const snapshot = await getDocs(q);
            const recipes = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                const recipe = {
                    id: doc.id,
                    ...data
                };

                // 클라이언트 사이드에서 텍스트 검색
                if (!searchTerm ||
                    recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    recipe.ingredients?.toLowerCase().includes(searchTerm.toLowerCase())) {
                    recipes.push(recipe);
                }
            });

            return recipes;
        } catch (error) {
            console.error('레시피 검색 오류:', error);
            return [];
        }
    },

    // 카테고리별 레시피 가져오기
    async getRecipesByCategory(category, limit = 10) {
        try {
            return await this.searchRecipes('', category, limit);
        } catch (error) {
            console.error('카테고리별 레시피 가져오기 오류:', error);
            return [];
        }
    },

    // 인기 레시피 가져오기
    async getPopularRecipes(limit = 6) {
        try {
            const q = query(
                collection(db, 'recipes'),
                where('isPublic', '==', true),
                orderBy('createdAt', 'desc'),
                limit(limit)
            );

            const snapshot = await getDocs(q);
            const recipes = [];
            snapshot.forEach((doc) => {
                recipes.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // 좋아요 수로 정렬
            return recipes.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        } catch (error) {
            console.error('인기 레시피 가져오기 오류:', error);
            return [];
        }
    },

    // 레시피 삭제
    async deleteRecipe(recipeId, userId) {
        try {
            const recipeRef = doc(db, 'recipes', recipeId);
            const recipeDoc = await getDoc(recipeRef);

            if (!recipeDoc.exists()) {
                throw new Error('레시피를 찾을 수 없습니다.');
            }

            const recipeData = recipeDoc.data();
            if (recipeData.authorId !== userId) {
                throw new Error('삭제 권한이 없습니다.');
            }

            await deleteDoc(recipeRef);
            return true;
        } catch (error) {
            console.error('레시피 삭제 오류:', error);
            throw error;
        }
    },

    // 레시피 수정
    async updateRecipe(recipeId, recipeData, userId) {
        try {
            const recipeRef = doc(db, 'recipes', recipeId);
            const recipeDoc = await getDoc(recipeRef);

            if (!recipeDoc.exists()) {
                throw new Error('레시피를 찾을 수 없습니다.');
            }

            const existingData = recipeDoc.data();
            if (existingData.authorId !== userId) {
                throw new Error('수정 권한이 없습니다.');
            }

            await updateDoc(recipeRef, {
                ...recipeData,
                updatedAt: serverTimestamp()
            });

            return { id: recipeId, ...recipeData };
        } catch (error) {
            console.error('레시피 수정 오류:', error);
            throw error;
        }
    }
};

export default {
    likeService,
    favoriteService,
    commentService,
    recipeStatsService,
    batchService,
    recipeService
}; 