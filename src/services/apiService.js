// API 서비스 모듈 - 백엔드와의 모든 HTTP 통신을 담당
import { auth } from '../firebase';
import { config } from '../config/config';

/**
 * API 요청을 위한 공통 fetch 함수 (에러 처리 및 재시도 로직 포함)
 * @param {string} url - 요청 URL
 * @param {Object} options - fetch 옵션
 * @param {number} retryCount - 현재 재시도 횟수
 * @returns {Promise} fetch 응답
 */
const apiRequest = async (url, options = {}, retryCount = 0) => {
    try {
        // 타임아웃 설정
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);

        const fetchOptions = {
            ...options,
            signal: controller.signal,
        };

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        // 로깅 (개발 환경에서만)
        if (config.debug.enableApiLogging) {
            console.log(`API 요청: ${options.method || 'GET'} ${url}`, {
                status: response.status,
                ok: response.ok
            });
        }

        return response;

    } catch (error) {
        // 네트워크 오류나 타임아웃 시 재시도
        if (retryCount < config.api.maxRetries &&
            (error.name === 'AbortError' || error.message.includes('fetch'))) {

            console.warn(`API 요청 실패, 재시도 중... (${retryCount + 1}/${config.api.maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // 지수적 백오프
            return apiRequest(url, options, retryCount + 1);
        }

        throw error;
    }
};

/**
 * 레시피 등록 API 호출 함수
 * @param {Object} recipeData - 레시피 정보 객체
 * @param {File} imageFile - 업로드할 이미지 파일 (선택사항)
 * @returns {Promise} API 응답 결과
 */
export const createRecipe = async (recipeData, imageFile = null) => {
    try {
        // 현재 사용자의 Firebase UID 가져오기
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('사용자 인증이 필요합니다.');
        }

        // FormData 객체 생성 - multipart/form-data 형식으로 전송하기 위함
        const formData = new FormData();

        // 레시피 데이터를 JSON 문자열로 변환하여 추가
        // API 명세서에 따르면 'recipe' 필드명으로 JSON 데이터를 전송
        const recipeJson = {
            title: recipeData.title.trim(),
            category: recipeData.category,
            content: recipeData.description.trim(), // API 명세서의 'content' 필드명에 맞춤
            cookingTime: recipeData.cookTime.trim(), // API 명세서의 'cookingTime' 필드명에 맞춤
            difficulty: recipeData.difficulty,
            ingredients: recipeData.ingredients.split('\n').filter(item => item.trim()), // 배열로 변환
            steps: recipeData.steps.filter(step => step.trim()), // 빈 스텝 제거
            firebaseUid: currentUser.uid // API 명세서에 따른 Firebase UID 추가
        };

        // 데이터 유효성 검사
        if (!recipeJson.title || recipeJson.title.length > config.recipe.maxTitleLength) {
            throw new Error(`레시피 제목은 1-${config.recipe.maxTitleLength}자 이내여야 합니다.`);
        }

        if (recipeJson.steps.length < config.recipe.minSteps || recipeJson.steps.length > config.recipe.maxSteps) {
            throw new Error(`요리 과정은 ${config.recipe.minSteps}-${config.recipe.maxSteps}개 이내여야 합니다.`);
        }

        // JSON 데이터를 FormData에 추가
        formData.append('recipe', JSON.stringify(recipeJson));

        // 이미지 파일이 있다면 FormData에 추가
        if (imageFile) {
            // 이미지 파일 유효성 검사
            if (imageFile.size > config.upload.maxFileSize) {
                throw new Error(`이미지 파일 크기는 ${config.upload.maxFileSize / (1024 * 1024)}MB 이하여야 합니다.`);
            }

            if (!config.upload.allowedImageTypes.includes(imageFile.type)) {
                throw new Error('지원되지 않는 이미지 형식입니다. JPG, PNG, GIF, WebP 파일만 업로드 가능합니다.');
            }

            formData.append('imageFile', imageFile);
        }

        // API 호출 - apiRequest 함수를 사용하여 재시도 로직 적용
        const response = await apiRequest(`${config.api.baseUrl}/recipes`, {
            method: 'POST',
            body: formData, // FormData 객체를 body로 전송
            // Content-Type 헤더는 자동으로 설정됨 (multipart/form-data)
            // 수동으로 설정하면 boundary가 누락될 수 있으므로 제외
        });

        // 응답 상태 확인
        if (!response.ok) {
            // HTTP 에러 상태인 경우 에러 메시지 생성
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || `HTTP ${response.status} 오류`;
            } catch {
                errorMessage = await response.text();
            }
            throw new Error(`API 오류 (${response.status}): ${errorMessage}`);
        }

        // 성공 응답 반환
        const result = await response.json();
        return result;

    } catch (error) {
        // 에러 로깅 및 재발생
        console.error('레시피 등록 API 호출 오류:', error);
        throw error;
    }
};

/**
 * 카테고리별 레시피 목록 조회 API
 * @param {string} category - 카테고리 (한식, 중식, 일식, 양식)
 * @returns {Promise} 레시피 목록
 */
export const getRecipesByCategory = async (category) => {
    try {
        // 카테고리 유효성 검사
        if (!config.recipe.categories.includes(category)) {
            throw new Error(`지원되지 않는 카테고리입니다: ${category}`);
        }

        const response = await apiRequest(`${config.api.baseUrl}/recipes/category/${encodeURIComponent(category)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API 오류 (${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error('카테고리별 레시피 조회 오류:', error);
        throw error;
    }
};

/**
 * 레시피 상세 조회 API
 * @param {string} category - 카테고리
 * @param {string} id - 레시피 ID
 * @returns {Promise} 레시피 상세 정보
 */
export const getRecipeDetail = async (category, id) => {
    try {
        const response = await apiRequest(`${config.api.baseUrl}/recipes/category/${encodeURIComponent(category)}/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API 오류 (${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error('레시피 상세 조회 오류:', error);
        throw error;
    }
};

/**
 * 제목으로 레시피 검색 API
 * @param {string} title - 검색할 제목
 * @returns {Promise} 검색 결과
 */
export const searchRecipesByTitle = async (title) => {
    try {
        if (!title || title.trim().length === 0) {
            return { data: [] }; // 빈 검색어인 경우 빈 결과 반환
        }

        const response = await apiRequest(`${config.api.baseUrl}/recipes/search?title=${encodeURIComponent(title.trim())}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API 오류 (${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error('레시피 검색 오류:', error);
        throw error;
    }
};

/**
 * 사용자별 레시피 목록 조회 API
 * @param {string} firebaseUid - Firebase UID
 * @returns {Promise} 사용자의 레시피 목록
 */
export const getUserRecipes = async (firebaseUid) => {
    try {
        if (!firebaseUid) {
            throw new Error('사용자 UID가 필요합니다.');
        }

        const response = await apiRequest(`${config.api.baseUrl}/recipes/user/${encodeURIComponent(firebaseUid)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API 오류 (${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error('사용자 레시피 조회 오류:', error);
        throw error;
    }
};

/**
 * 레시피 수정 API
 * @param {string} id - 레시피 ID
 * @param {Object} recipeData - 수정할 레시피 데이터
 * @param {File} imageFile - 새 이미지 파일 (선택사항)
 * @returns {Promise} API 응답 결과
 */
export const updateRecipe = async (id, recipeData, imageFile = null) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('사용자 인증이 필요합니다.');
        }

        const formData = new FormData();

        const recipeJson = {
            title: recipeData.title.trim(),
            category: recipeData.category,
            content: recipeData.description.trim(),
            cookingTime: recipeData.cookTime.trim(),
            difficulty: recipeData.difficulty,
            ingredients: recipeData.ingredients.split('\n').filter(item => item.trim()),
            steps: recipeData.steps.filter(step => step.trim()),
            firebaseUid: currentUser.uid
        };

        formData.append('recipe', JSON.stringify(recipeJson));

        if (imageFile) {
            formData.append('imageFile', imageFile);
        }

        const response = await apiRequest(`${config.api.baseUrl}/recipes/${encodeURIComponent(id)}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API 오류 (${response.status}): ${errorText}`);
        }

        return await response.json();

    } catch (error) {
        console.error('레시피 수정 API 호출 오류:', error);
        throw error;
    }
};

/**
 * 레시피 삭제 API
 * @param {string} id - 삭제할 레시피 ID
 * @returns {Promise} API 응답 결과
 */
export const deleteRecipe = async (id) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('사용자 인증이 필요합니다.');
        }

        const response = await apiRequest(`${config.api.baseUrl}/recipes/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API 오류 (${response.status}): ${errorText}`);
        }

        // 204 No Content 응답인 경우 JSON 파싱하지 않음
        if (response.status === 204) {
            return { success: true };
        }

        return await response.json();

    } catch (error) {
        console.error('레시피 삭제 API 호출 오류:', error);
        throw error;
    }
}; 