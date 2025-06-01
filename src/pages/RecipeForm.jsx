import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Firebase 관련 import 제거 (더 이상 직접 사용하지 않음)
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '../firebase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
// 새로 생성한 컴포넌트와 서비스 import
import ImageUpload from '../components/ImageUpload';
import { createRecipe } from '../services/apiService';

const RecipeForm = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        ingredients: '',
        description: '',
        steps: [''],
        cookTime: '',
        difficulty: '쉬움',
        category: '한식',
        servings: '2-3인분'
    });

    // 이미지 파일 상태 추가
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);

    const totalSteps = 5; // 이미지 업로드 단계 추가로 총 5단계로 변경

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = '레시피 제목을 입력해주세요.';
        }

        if (!formData.ingredients.trim()) {
            newErrors.ingredients = '재료를 입력해주세요.';
        }

        if (!formData.description.trim()) {
            newErrors.description = '레시피 설명을 입력해주세요.';
        }

        if (!formData.cookTime.trim()) {
            newErrors.cookTime = '요리 시간을 입력해주세요.';
        }

        if (formData.steps.some(step => !step.trim())) {
            newErrors.steps = '모든 요리 과정을 입력해주세요.';
        }

        if (formData.steps.length === 0) {
            newErrors.steps = '최소 1개의 요리 과정을 입력해주세요.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateCurrentStep = () => {
        const newErrors = {};

        switch (currentStep) {
            case 1:
                if (!formData.title.trim()) newErrors.title = '레시피 제목을 입력해주세요.';
                if (!formData.description.trim()) newErrors.description = '레시피 설명을 입력해주세요.';
                break;
            case 2:
                if (!formData.cookTime.trim()) newErrors.cookTime = '요리 시간을 입력해주세요.';
                break;
            case 3:
                if (!formData.ingredients.trim()) newErrors.ingredients = '재료를 입력해주세요.';
                break;
            case 4:
                if (formData.steps.some(step => !step.trim())) newErrors.steps = '모든 요리 과정을 입력해주세요.';
                break;
            case 5:
                // 이미지는 선택사항이므로 유효성 검사 없음
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 실시간 유효성 검사
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...formData.steps];
        newSteps[index] = value;
        setFormData(prev => ({
            ...prev,
            steps: newSteps
        }));

        if (errors.steps && value.trim()) {
            setErrors(prev => ({
                ...prev,
                steps: ''
            }));
        }
    };

    const addStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [...prev.steps, '']
        }));
    };

    const removeStep = (index) => {
        if (formData.steps.length > 1) {
            const newSteps = formData.steps.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                steps: newSteps
            }));
        }
    };

    // 이미지 파일 변경 핸들러 추가
    const handleImageChange = (imageFile) => {
        setSelectedImage(imageFile);
        console.log('선택된 이미지:', imageFile);
    };

    const nextStep = () => {
        if (validateCurrentStep() && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // 기존 handleSubmit 함수를 백엔드 API 연동으로 수정
    const handleSubmit = async () => {
        console.log('🚀 레시피 등록 시작 (5단계 전용 버튼)');

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (!validateForm()) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            // 디버깅: 전송할 데이터 로깅
            console.log('🚀 레시피 등록 데이터:', {
                formData,
                selectedImage: selectedImage ? {
                    name: selectedImage.name,
                    size: selectedImage.size,
                    type: selectedImage.type
                } : null,
                currentUser: {
                    uid: currentUser.uid,
                    email: currentUser.email
                }
            });

            // API 서비스를 통해 레시피 등록 (이미지 파일과 함께)
            const result = await createRecipe(formData, selectedImage);

            console.log('✅ 레시피 등록 성공:', result);
            alert('레시피가 성공적으로 등록되었습니다! 🎉');
            navigate('/mypage');

        } catch (error) {
            console.error('❌ 레시피 등록 오류:', error);
            console.error('에러 상세 정보:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });

            // 에러 메시지 처리 개선
            let errorMessage = '레시피 등록에 실패했습니다.';

            if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
                errorMessage = `🌐 서버 연결 실패: 백엔드 서버가 실행 중인지 확인해주세요.\n
현재 접속 시도 중인 서버: http://localhost:8081/api
\n해결 방법:
1. 백엔드 팀에게 서버 실행 상태 확인 요청
2. 서버 포트가 8081이 맞는지 확인
3. 방화벽이나 보안 프로그램 확인`;
            } else if (error.message.includes('사용자 인증')) {
                errorMessage = '로그인이 필요합니다. 다시 로그인해주세요.';
                navigate('/login');
            } else if (error.message.includes('API 오류')) {
                errorMessage = `서버 오류가 발생했습니다.\n\n상세 정보: ${error.message}\n\n백엔드 팀에게 이 오류를 전달해주세요.`;
            } else if (error.message.includes('network') || error.message.includes('ERR_')) {
                errorMessage = `네트워크 오류가 발생했습니다.\n\n가능한 원인:
1. 인터넷 연결 상태 확인
2. 백엔드 서버 실행 상태 확인
3. CORS 설정 문제 (백엔드 팀 확인 필요)`;
            } else if (error.message.includes('AbortError') || error.message.includes('timeout')) {
                errorMessage = '서버 응답 시간이 초과되었습니다. 백엔드 서버가 실행 중인지 확인해주세요.';
            } else {
                errorMessage = `알 수 없는 오류가 발생했습니다.\n\n에러 메시지: ${error.message}\n\n이 정보를 백엔드 팀에게 전달해주세요.`;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="recipe-form-page">
                <Header showScrollBanner={false} />

                <div className="auth-required-container">
                    <div className="auth-required-content">
                        <div className="auth-icon">🔒</div>
                        <h2 className="auth-title">로그인이 필요합니다</h2>
                        <p className="auth-message">레시피를 작성하려면 로그인해주세요.</p>
                        <Link to="/login" className="auth-login-btn">
                            로그인하기
                        </Link>
                    </div>
                </div>

                <BottomNav />
            </div>
        );
    }

    const getDifficultyEmoji = (difficulty) => {
        switch (difficulty) {
            case '쉬움': return '🟢';
            case '보통': return '🟡';
            case '어려움': return '🔴';
            default: return '🟢';
        }
    };

    const getCategoryEmoji = (category) => {
        switch (category) {
            case '한식': return '🥘';
            case '양식': return '🍝';
            case '일식': return '🍱';
            case '중식': return '🥢';
            case '베이커리': return '🍞';
            case '브런치': return '🥐';
            case '디저트': return '🍰';
            default: return '🍽️';
        }
    };

    return (
        <div className="recipe-form-page">
            <Header showScrollBanner={false} />

            <div className="form-container">
                {/* 🎨 배경 장식 요소들 */}
                <div className="form-bg-decorations">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>

                <div className="form-content">
                    {/* 📊 진행 표시기 */}
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                        <div className="step-indicators">
                            {[1, 2, 3, 4, 5].map(step => (
                                <div
                                    key={step}
                                    className={`step-indicator ${currentStep >= step ? 'active' : ''}`}
                                >
                                    {currentStep > step ? '✓' : step}
                                </div>
                            ))}
                        </div>
                        <div className="progress-text">
                            {currentStep} / {totalSteps} 단계
                        </div>
                    </div>

                    {/* 🎯 폼 헤더 */}
                    <div className="form-header">
                        <h1 className="form-title">
                            {currentStep === 1 && '📝 기본 정보'}
                            {currentStep === 2 && '⏱️ 요리 정보'}
                            {currentStep === 3 && '🥬 재료 준비'}
                            {currentStep === 4 && '👨‍🍳 요리 과정'}
                            {currentStep === 5 && '🖼️ 이미지 업로드'}
                        </h1>
                        <p className="form-subtitle">
                            {currentStep === 1 && '맛있는 레시피의 제목과 소개를 작성해주세요'}
                            {currentStep === 2 && '요리 시간과 난이도를 설정해주세요'}
                            {currentStep === 3 && '필요한 재료들을 입력해주세요'}
                            {currentStep === 4 && '단계별 요리 과정을 상세히 설명해주세요'}
                            {currentStep === 5 && '레시피와 관련된 이미지를 업로드해주세요'}
                        </p>
                    </div>

                    {/* 📋 폼 단계별 내용 */}
                    <form className="recipe-form">
                        {/* 1단계: 기본 정보 */}
                        {currentStep === 1 && (
                            <div className="form-step">
                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">📝</span>
                                        레시피 제목 *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={`form-input ${errors.title ? 'error' : ''}`}
                                        placeholder="예: 엄마표 김치찌개, 이탈리안 파스타"
                                        maxLength={50}
                                    />
                                    <div className="input-helper">
                                        {formData.title.length}/50자
                                    </div>
                                    {errors.title && <div className="error-message">⚠️ {errors.title}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">📖</span>
                                        레시피 소개 *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={`form-textarea ${errors.description ? 'error' : ''}`}
                                        rows="4"
                                        placeholder="이 레시피의 특별한 점이나 맛을 간단히 소개해주세요."
                                        maxLength={200}
                                    />
                                    <div className="input-helper">
                                        {formData.description.length}/200자
                                    </div>
                                    {errors.description && <div className="error-message">⚠️ {errors.description}</div>}
                                </div>
                            </div>
                        )}

                        {/* 2단계: 요리 정보 */}
                        {currentStep === 2 && (
                            <div className="form-step">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-icon">{getCategoryEmoji(formData.category)}</span>
                                            카테고리
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="한식">🥘 한식</option>
                                            <option value="양식">🍝 양식</option>
                                            <option value="일식">🍱 일식</option>
                                            <option value="중식">🥢 중식</option>
                                            <option value="베이커리">🍞 베이커리</option>
                                            <option value="브런치">🥐 브런치</option>
                                            <option value="디저트">🍰 디저트</option>
                                            <option value="기타">🍽️ 기타</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-icon">{getDifficultyEmoji(formData.difficulty)}</span>
                                            난이도
                                        </label>
                                        <select
                                            name="difficulty"
                                            value={formData.difficulty}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="쉬움">🟢 쉬움</option>
                                            <option value="보통">🟡 보통</option>
                                            <option value="어려움">🔴 어려움</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-icon">⏱️</span>
                                            요리 시간 *
                                        </label>
                                        <input
                                            type="text"
                                            name="cookTime"
                                            value={formData.cookTime}
                                            onChange={handleChange}
                                            className={`form-input ${errors.cookTime ? 'error' : ''}`}
                                            placeholder="예: 30분, 1시간 30분"
                                        />
                                        {errors.cookTime && <div className="error-message">⚠️ {errors.cookTime}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-icon">👥</span>
                                            몇 인분
                                        </label>
                                        <select
                                            name="servings"
                                            value={formData.servings}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="1인분">1인분</option>
                                            <option value="2-3인분">2-3인분</option>
                                            <option value="4-5인분">4-5인분</option>
                                            <option value="6인분 이상">6인분 이상</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3단계: 재료 */}
                        {currentStep === 3 && (
                            <div className="form-step">
                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">🥬</span>
                                        재료 목록 *
                                    </label>
                                    <textarea
                                        name="ingredients"
                                        value={formData.ingredients}
                                        onChange={handleChange}
                                        className={`form-textarea ${errors.ingredients ? 'error' : ''}`}
                                        rows="8"
                                        placeholder="재료를 한 줄씩 입력해주세요.

예시:
돼지고기 300g
김치 200g
양파 1개 (중간 크기)
대파 2대
마늘 3쪽
생강 1조각"
                                    />
                                    <div className="ingredient-tips">
                                        💡 팁: 정확한 양과 단위를 함께 적어주세요
                                    </div>
                                    {errors.ingredients && <div className="error-message">⚠️ {errors.ingredients}</div>}
                                </div>
                            </div>
                        )}

                        {/* 4단계: 요리 과정 */}
                        {currentStep === 4 && (
                            <div className="form-step">
                                <div className="form-group">
                                    <div className="steps-header">
                                        <label className="form-label">
                                            <span className="label-icon">👨‍🍳</span>
                                            요리 과정 *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addStep}
                                            className="add-step-btn"
                                        >
                                            <span>➕</span>
                                            단계 추가
                                        </button>
                                    </div>

                                    <div className="steps-container">
                                        {formData.steps.map((step, index) => (
                                            <div key={index} className="step-item">
                                                <div className="step-header">
                                                    <div className="step-number">
                                                        STEP {index + 1}
                                                    </div>
                                                    {formData.steps.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeStep(index)}
                                                            className="remove-step-btn"
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                                <textarea
                                                    value={step}
                                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                                    className={`step-textarea ${errors.steps ? 'error' : ''}`}
                                                    rows="3"
                                                    placeholder={`${index + 1}번째 요리 과정을 자세히 설명해주세요.

예: 팬에 기름을 두르고 중불에서 양파를 투명해질 때까지 볶아주세요.`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {errors.steps && <div className="error-message">⚠️ {errors.steps}</div>}
                                </div>
                            </div>
                        )}

                        {/* 5단계: 이미지 업로드 */}
                        {currentStep === 5 && (
                            <div className="form-step">
                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">🖼️</span>
                                        이미지 업로드
                                    </label>
                                    <ImageUpload
                                        onImageChange={handleImageChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 🎮 폼 액션 버튼들 */}
                        <div className="form-actions">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="btn btn-secondary"
                                >
                                    ← 이전
                                </button>
                            )}

                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="btn btn-primary"
                                >
                                    다음 →
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="btn btn-primary submit-btn"
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            등록 중...
                                        </>
                                    ) : (
                                        <>
                                            ✨ 레시피 등록하기
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <BottomNav />

            {/* 🎨 레시피 폼 전용 스타일 */}
            <style jsx>{`
                .recipe-form-page {
                    padding-bottom: 100px;
                    min-height: 100vh;
                    background: var(--background-app);
                }

                .auth-required-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: calc(100vh - 160px);
                    padding: var(--space-6);
                }

                .auth-required-content {
                    text-align: center;
                    background: var(--background-elevated);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-16);
                    box-shadow: var(--shadow-xl);
                    max-width: 400px;
                    width: 100%;
                }

                .auth-icon {
                    font-size: 64px;
                    margin-bottom: var(--space-6);
                    opacity: 0.7;
                }

                .auth-title {
                    font-size: var(--text-2xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-4);
                }

                .auth-message {
                    font-size: var(--text-base);
                    color: var(--text-secondary);
                    margin-bottom: var(--space-6);
                    line-height: var(--line-height-relaxed);
                }

                .auth-login-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-4) var(--space-8);
                    background: var(--primary-gradient);
                    color: var(--text-white);
                    text-decoration: none;
                    border-radius: var(--radius-lg);
                    font-weight: var(--font-weight-semibold);
                    transition: var(--transition-normal);
                    box-shadow: var(--shadow-primary);
                }

                .auth-login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-primary-lg);
                }

                .form-container {
                    position: relative;
                    max-width: 600px;
                    margin: 0 auto;
                    min-height: calc(100vh - 160px);
                }

                /* 🎭 배경 장식 요소들 */
                .form-bg-decorations {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 1;
                }

                .decoration-circle {
                    position: absolute;
                    border-radius: 50%;
                    opacity: 0.4;
                }

                .circle-1 {
                    top: 60px;
                    left: -50px;
                    width: 102px;
                    height: 102px;
                    background: linear-gradient(135deg, var(--secondary-300), var(--secondary-400));
                }

                .circle-2 {
                    top: 81px;
                    right: -30px;
                    width: 119px;
                    height: 119px;
                    background: linear-gradient(135deg, var(--primary-200), var(--primary-300));
                }

                .circle-3 {
                    bottom: 200px;
                    left: -40px;
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, var(--accent-blue)/30, var(--accent-purple)/30);
                }

                .form-content {
                    position: relative;
                    z-index: 2;
                    padding: var(--space-6);
                }

                /* 📊 진행 표시기 */
                .progress-container {
                    margin-bottom: var(--space-8);
                    animation: fadeInUp var(--duration-slow) var(--ease-out);
                }

                .progress-bar {
                    background: var(--neutral-200);
                    height: 6px;
                    border-radius: var(--radius-full);
                    margin-bottom: var(--space-4);
                    overflow: hidden;
                }

                .progress-fill {
                    background: var(--primary-gradient);
                    height: 100%;
                    border-radius: var(--radius-full);
                    transition: width var(--duration-slow) var(--ease-out);
                }

                .step-indicators {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: var(--space-2);
                }

                .step-indicator {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--neutral-200);
                    color: var(--text-tertiary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--text-sm);
                    font-weight: var(--font-weight-bold);
                    transition: var(--transition-normal);
                }

                .step-indicator.active {
                    background: var(--primary-gradient);
                    color: var(--text-white);
                    box-shadow: var(--shadow-primary);
                }

                .progress-text {
                    text-align: center;
                    font-size: var(--text-sm);
                    color: var(--text-secondary);
                    font-weight: var(--font-weight-medium);
                }

                /* 🎯 폼 헤더 */
                .form-header {
                    text-align: center;
                    margin-bottom: var(--space-10);
                    animation: fadeInUp var(--duration-slow) var(--ease-out) 0.1s both;
                }

                .form-title {
                    font-size: var(--text-3xl);
                    font-weight: var(--font-weight-extrabold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-3);
                    letter-spacing: var(--letter-spacing-tight);
                    line-height: var(--line-height-tight);
                }

                .form-subtitle {
                    font-size: var(--text-base);
                    color: var(--text-secondary);
                    margin: 0;
                    font-weight: var(--font-weight-medium);
                    line-height: var(--line-height-relaxed);
                }

                /* 📋 폼 요소들 */
                .recipe-form {
                    background: var(--background-elevated);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-8);
                    box-shadow: var(--shadow-xl);
                    border: 1px solid var(--border-light);
                    backdrop-filter: var(--glass-backdrop);
                    animation: fadeInUp var(--duration-slow) var(--ease-out) 0.2s both;
                }

                .form-step {
                    min-height: 300px;
                }

                .form-group {
                    margin-bottom: var(--space-6);
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-4);
                    margin-bottom: var(--space-6);
                }

                .form-label {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: var(--text-sm);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-secondary);
                    margin-bottom: var(--space-3);
                    text-transform: uppercase;
                    letter-spacing: var(--letter-spacing-wide);
                }

                .label-icon {
                    font-size: var(--text-base);
                }

                .form-input, .form-select, .form-textarea {
                    width: 100%;
                    padding: var(--space-4) var(--space-5);
                    font-size: var(--text-base);
                    font-weight: var(--font-weight-medium);
                    color: var(--text-primary);
                    background: var(--background-card);
                    border: 2px solid var(--border-medium);
                    border-radius: var(--radius-lg);
                    transition: var(--transition-normal);
                    font-family: inherit;
                    box-sizing: border-box;
                }

                .form-input:focus, .form-select:focus, .form-textarea:focus {
                    outline: none;
                    border-color: var(--primary-500);
                    box-shadow: 0 0 0 4px rgba(255, 97, 66, 0.15);
                    background: var(--background-elevated);
                    transform: translateY(-1px);
                }

                .form-input.error, .form-textarea.error {
                    border-color: var(--text-error);
                    background: rgba(220, 38, 38, 0.05);
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 100px;
                    line-height: var(--line-height-relaxed);
                }

                .input-helper {
                    font-size: var(--text-xs);
                    color: var(--text-tertiary);
                    text-align: right;
                    margin-top: var(--space-1);
                }

                .ingredient-tips {
                    font-size: var(--text-sm);
                    color: var(--accent-amber);
                    background: rgba(245, 158, 11, 0.1);
                    padding: var(--space-3);
                    border-radius: var(--radius-md);
                    margin-top: var(--space-2);
                    border-left: 4px solid var(--accent-amber);
                }

                /* 🏷️ 요리 과정 단계들 */
                .steps-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-4);
                }

                .add-step-btn {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-4);
                    background: var(--primary-gradient);
                    color: var(--text-white);
                    border: none;
                    border-radius: var(--radius-lg);
                    font-size: var(--text-sm);
                    font-weight: var(--font-weight-semibold);
                    cursor: pointer;
                    transition: var(--transition-normal);
                    text-transform: uppercase;
                    letter-spacing: var(--letter-spacing-wide);
                }

                .add-step-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-primary);
                }

                .steps-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-5);
                }

                .step-item {
                    background: var(--background-card);
                    border: 2px solid var(--border-light);
                    border-radius: var(--radius-xl);
                    padding: var(--space-5);
                    transition: var(--transition-normal);
                }

                .step-item:hover {
                    border-color: var(--primary-300);
                    box-shadow: var(--shadow-md);
                }

                .step-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-3);
                }

                .step-number {
                    background: var(--primary-gradient);
                    color: var(--text-white);
                    padding: var(--space-2) var(--space-4);
                    border-radius: var(--radius-full);
                    font-size: var(--text-xs);
                    font-weight: var(--font-weight-bold);
                    text-transform: uppercase;
                    letter-spacing: var(--letter-spacing-wide);
                }

                .remove-step-btn {
                    background: var(--text-error);
                    color: var(--text-white);
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: var(--transition-normal);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--text-sm);
                }

                .remove-step-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                }

                .step-textarea {
                    width: 100%;
                    padding: var(--space-4);
                    font-size: var(--text-base);
                    color: var(--text-primary);
                    background: var(--background-elevated);
                    border: 1px solid var(--border-medium);
                    border-radius: var(--radius-md);
                    transition: var(--transition-normal);
                    font-family: inherit;
                    resize: vertical;
                    min-height: 100px;
                    line-height: var(--line-height-relaxed);
                }

                .step-textarea:focus {
                    outline: none;
                    border-color: var(--primary-500);
                    box-shadow: 0 0 0 3px rgba(255, 97, 66, 0.1);
                }

                .step-textarea.error {
                    border-color: var(--text-error);
                    background: rgba(220, 38, 38, 0.05);
                }

                /* 🚨 에러 메시지 */
                .error-message {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    color: var(--text-error);
                    font-size: var(--text-sm);
                    font-weight: var(--font-weight-medium);
                    margin-top: var(--space-2);
                    padding: var(--space-2) var(--space-3);
                    background: rgba(220, 38, 38, 0.1);
                    border-radius: var(--radius-md);
                    border-left: 4px solid var(--text-error);
                }

                /* 🎮 폼 액션 버튼들 */
                .form-actions {
                    display: flex;
                    gap: var(--space-4);
                    margin-top: var(--space-8);
                    padding-top: var(--space-6);
                    border-top: 1px solid var(--border-medium);
                }

                .btn {
                    flex: 1;
                    padding: var(--space-4) var(--space-6);
                    font-size: var(--text-base);
                    font-weight: var(--font-weight-semibold);
                    border: none;
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    transition: var(--transition-normal);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-2);
                    text-transform: uppercase;
                    letter-spacing: var(--letter-spacing-wide);
                    min-height: 56px;
                }

                .btn-primary {
                    background: var(--primary-gradient);
                    color: var(--text-white);
                    box-shadow: var(--shadow-primary);
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-primary-lg);
                }

                .btn-secondary {
                    background: var(--background-elevated);
                    color: var(--text-secondary);
                    border: 2px solid var(--border-medium);
                    box-shadow: var(--shadow-md);
                }

                .btn-secondary:hover {
                    background: var(--neutral-50);
                    transform: translateY(-1px);
                    box-shadow: var(--shadow-lg);
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none !important;
                }

                .submit-btn {
                    background: linear-gradient(135deg, var(--accent-emerald) 0%, var(--primary-500) 100%);
                }

                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                /* 애니메이션 */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* 📱 반응형 디자인 */
                @media (max-width: 480px) {
                    .form-content {
                        padding: var(--space-4);
                    }

                    .recipe-form {
                        padding: var(--space-6);
                        border-radius: var(--radius-xl);
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                        gap: var(--space-6);
                    }

                    .form-title {
                        font-size: var(--text-2xl);
                    }

                    .steps-header {
                        flex-direction: column;
                        gap: var(--space-3);
                        align-items: stretch;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .btn {
                        width: 100%;
                    }

                    .step-indicators {
                        justify-content: center;
                        gap: var(--space-4);
                    }

                    .step-indicator {
                        width: 32px;
                        height: 32px;
                        font-size: var(--text-xs);
                    }
                }

                @media (max-width: 360px) {
                    .form-content {
                        padding: var(--space-3);
                    }

                    .recipe-form {
                        padding: var(--space-4);
                    }

                    .step-item {
                        padding: var(--space-4);
                    }
                }
            `}</style>
        </div>
    );
};

export default RecipeForm; 