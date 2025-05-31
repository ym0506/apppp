// 환경 설정 파일 - 개발/운영 환경별 설정값 관리

/**
 * 환경별 API 서버 URL 설정
 * 개발 환경과 운영 환경에 따라 다른 URL 사용
 */
const getApiBaseUrl = () => {
    // 개발 환경인지 확인 (React 앱에서는 NODE_ENV가 자동으로 설정됨)
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
        // 🌍 다른 네트워크 환경에서 작업하는 경우 여기를 수정하세요!

        // 🌟 백엔드가 Railway에 배포된 경우 (추천!)
        // 백엔드 팀이 Railway URL을 알려주면 아래 주석을 해제하고 URL을 교체하세요:
        // return 'https://your-app-name.up.railway.app/api';  // ← Railway URL로 변경

        // 🔗 백엔드가 ngrok을 사용하는 경우 (임시 해결)
        // return 'https://abc123.ngrok.io/api';  // ← ngrok URL로 변경

        // 🏠 같은 네트워크 내 다른 컴퓨터인 경우
        // return 'http://192.168.1.100:8081/api';  // ← 팀원 IP로 변경

        // 💻 같은 컴퓨터인 경우 (기본값)
        return 'http://localhost:8081/api';

        // 📝 백엔드 팀에게 확인하세요:
        // 1. Railway 배포 완료? → Railway URL 요청 (가장 추천!)
        // 2. 같은 와이파이? → IP 주소 요청
        // 3. 다른 공간? → ngrok 또는 클라우드 서버 요청
        // 4. 포트 번호? → 8081 맞는지 확인

    } else {
        // 운영 환경 - 실제 배포된 백엔드 서버 URL
        return process.env.REACT_APP_API_URL || 'https://your-backend-domain.com/api';
    }
};

/**
 * 애플리케이션 전체 설정값들
 */
export const config = {
    // API 관련 설정
    api: {
        baseUrl: getApiBaseUrl(),
        timeout: 30000, // 30초 타임아웃
        maxRetries: 3, // 최대 재시도 횟수
    },

    // 파일 업로드 관련 설정
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        allowedImageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    },

    // 레시피 관련 설정
    recipe: {
        maxTitleLength: 50,
        maxDescriptionLength: 500,
        maxSteps: 20,
        minSteps: 1,
        categories: ['한식', '중식', '일식', '양식'],
        difficulties: ['쉬움', '보통', '어려움'],
        servingSizes: ['1인분', '2-3인분', '4-5인분', '6인분 이상'],
    },

    // UI 관련 설정
    ui: {
        pageSize: 20, // 한 페이지당 표시할 아이템 수
        debounceDelay: 300, // 검색 입력 지연 시간 (ms)
    },

    // 개발용 디버그 설정
    debug: {
        enableApiLogging: process.env.NODE_ENV === 'development',
        enablePerformanceLogging: process.env.NODE_ENV === 'development',
    }
};

// 백엔드 서버 포트 옵션들 (문제 해결용)
// 만약 8081이 아니라면 백엔드 팀에게 확인 후 위의 getApiBaseUrl에서 수정하세요:
// - http://localhost:8080/api (스프링 부트 기본)
// - http://localhost:3001/api (Node.js 대안)
// - http://localhost:8082/api (대안 포트)

/**
 * 환경 변수들을 체크하고 누락된 것이 있으면 경고
 */
export const validateConfig = () => {
    const requiredEnvVars = [];

    // 운영 환경에서는 REACT_APP_API_URL이 필요
    if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL) {
        requiredEnvVars.push('REACT_APP_API_URL');
    }

    if (requiredEnvVars.length > 0) {
        console.warn('누락된 환경 변수:', requiredEnvVars);
        console.warn('개발 환경에서는 기본값을 사용하지만, 운영 환경에서는 설정이 필요합니다.');
    }

    return requiredEnvVars.length === 0;
};

/**
 * 현재 환경 정보를 반환
 */
export const getEnvironmentInfo = () => {
    return {
        environment: process.env.NODE_ENV,
        apiBaseUrl: config.api.baseUrl,
        isProduction: process.env.NODE_ENV === 'production',
        isDevelopment: process.env.NODE_ENV === 'development',
    };
};

// 기본 export
export default config; 