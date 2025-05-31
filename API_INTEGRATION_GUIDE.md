# 🔗 백엔드 API 통합 가이드

이 문서는 백엔드 API와 프론트엔드의 통합 구현에 대한 설명입니다.

## 📋 **구현된 기능**

### 1. **레시피 등록 기능**
- ✅ **multipart/form-data** 형식으로 JSON + 이미지 파일 전송
- ✅ **Firebase UID** 자동 포함
- ✅ **이미지 업로드** 기능 (드래그 앤 드롭 지원)
- ✅ **실시간 유효성 검사**
- ✅ **에러 처리 및 재시도 로직**

### 2. **추가 API 엔드포인트**
- ✅ 카테고리별 레시피 조회
- ✅ 레시피 상세 조회
- ✅ 제목으로 레시피 검색
- ✅ 사용자별 레시피 목록 조회
- ✅ 레시피 수정 및 삭제

## 🏗️ **구현된 파일들**

### **1. API 서비스 모듈**
```
src/services/apiService.js
```
- 모든 백엔드 API 호출 함수들
- 에러 처리 및 재시도 로직
- 타임아웃 관리
- 데이터 유효성 검사

### **2. 이미지 업로드 컴포넌트**
```
src/components/ImageUpload.jsx
```
- 이미지 파일 선택, 미리보기, 삭제
- 드래그 앤 드롭 지원
- 파일 유효성 검사 (타입, 크기)
- 재사용 가능한 컴포넌트

### **3. 설정 관리**
```
src/config/config.js
```
- 환경별 API 서버 URL 관리
- 업로드 파일 제한 설정
- 레시피 관련 제약 조건
- 디버그 설정

### **4. 수정된 레시피 폼**
```
src/pages/RecipeForm.jsx
```
- 기존 Firebase → 백엔드 API 연동으로 변경
- 이미지 업로드 단계 추가 (총 5단계)
- 향상된 에러 처리

## 🚀 **사용 방법**

### **1. 백엔드 서버 실행**
```bash
# 백엔드 서버가 http://localhost:8081에서 실행되어야 합니다
```

### **2. 프론트엔드 실행**
```bash
cd apppp
npm start
```

### **3. 레시피 등록 테스트**
1. 로그인 후 "레시피 등록" 페이지로 이동
2. 5단계 폼을 순서대로 작성:
   - 1단계: 기본 정보 (제목, 소개)
   - 2단계: 요리 정보 (시간, 난이도, 카테고리)
   - 3단계: 재료 준비
   - 4단계: 요리 과정
   - 5단계: 이미지 업로드 (선택사항)
3. "레시피 등록하기" 버튼 클릭

## 📡 **API 호출 예시**

### **레시피 등록**
```javascript
import { createRecipe } from '../services/apiService';

const handleSubmit = async () => {
  try {
    const result = await createRecipe(formData, imageFile);
    console.log('등록 성공:', result);
  } catch (error) {
    console.error('등록 실패:', error.message);
  }
};
```

### **카테고리별 레시피 조회**
```javascript
import { getRecipesByCategory } from '../services/apiService';

const loadRecipes = async () => {
  try {
    const recipes = await getRecipesByCategory('한식');
    console.log('레시피 목록:', recipes);
  } catch (error) {
    console.error('조회 실패:', error.message);
  }
};
```

## 🔧 **설정 변경**

### **API 서버 URL 변경**
`src/config/config.js` 파일에서 수정:
```javascript
// 개발 환경
return 'http://localhost:8081/api';

// 운영 환경
return 'https://your-backend-domain.com/api';
```

### **파일 업로드 제한 변경**
```javascript
upload: {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
}
```

## 📊 **전송되는 데이터 형식**

### **레시피 등록 요청**
```
POST /api/recipes
Content-Type: multipart/form-data

Form Data:
- recipe: {
    "title": "레시피 제목",
    "category": "한식",
    "content": "레시피 설명",
    "cookingTime": "30분",
    "difficulty": "쉬움",
    "ingredients": ["재료1", "재료2"],
    "steps": ["과정1", "과정2"],
    "firebaseUid": "사용자_Firebase_UID"
  }
- imageFile: [이미지 파일] (선택사항)
```

## 🔍 **디버깅**

### **API 로깅 활성화**
개발 환경에서는 자동으로 API 요청/응답이 콘솔에 로그됩니다.

### **네트워크 탭 확인**
브라우저 개발자 도구의 Network 탭에서 실제 API 요청을 확인할 수 있습니다.

### **에러 처리**
- 네트워크 오류: 자동 재시도 (최대 3회)
- 타임아웃: 30초 후 자동 취소
- 유효성 검사 실패: 사용자 친화적 메시지 표시

## 🔄 **추가 통합 작업**

### **1. 다른 페이지들도 API 연동**
현재는 레시피 등록만 구현되었습니다. 다른 페이지들도 필요에 따라 연동:
- `src/pages/Home.jsx` - 레시피 목록 표시
- `src/pages/Search.jsx` - 레시피 검색
- `src/pages/MyPage.jsx` - 사용자 레시피 목록

### **2. 레시피 조회 페이지 수정**
```javascript
// 예시: Home.jsx에서 레시피 목록 로드
import { getRecipesByCategory } from '../services/apiService';

useEffect(() => {
  const loadRecipes = async () => {
    try {
      const recipes = await getRecipesByCategory('한식');
      setRecipes(recipes);
    } catch (error) {
      console.error('레시피 로드 실패:', error);
    }
  };
  
  loadRecipes();
}, []);
```

## ⚠️ **주의사항**

1. **CORS 설정**: 백엔드에서 프론트엔드 도메인에 대한 CORS 허용 필요
2. **이미지 업로드**: 백엔드에서 이미지 처리 및 저장 로직 구현 필요
3. **에러 핸들링**: 백엔드 API의 에러 응답 형식에 맞춰 프론트엔드 에러 처리 조정 필요
4. **보안**: 실제 운영환경에서는 API 인증 토큰 등 보안 고려사항 추가 필요

## 🎉 **완료된 작업 요약**

✅ **백엔드 API 서비스 모듈 구현**  
✅ **이미지 업로드 컴포넌트 구현**  
✅ **레시피 폼 백엔드 연동 완료**  
✅ **설정 관리 시스템 구축**  
✅ **에러 처리 및 재시도 로직 구현**  
✅ **파일 유효성 검사 강화**  
✅ **5단계 레시피 등록 플로우 완성**  

이제 백엔드 팀과 함께 테스트를 진행하고, 필요에 따라 다른 페이지들도 점진적으로 API 연동을 진행하시면 됩니다! 🚀 