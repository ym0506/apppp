import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const RecipeForm = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        ingredients: '',
        description: '',
        steps: [''],
        cookTime: '',
        difficulty: '난이도 하',
        category: '한식'
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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

        // 실시간 유효성 검사
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Firebase Firestore에 레시피 저장
            const recipeData = {
                title: formData.title.trim(),
                category: formData.category,
                ingredients: formData.ingredients.trim(),
                description: formData.description.trim(),
                steps: formData.steps.map(step => step.trim()),
                cookTime: formData.cookTime.trim(),
                difficulty: formData.difficulty,
                authorId: currentUser.uid,
                authorName: currentUser.displayName || currentUser.email,
                authorEmail: currentUser.email,
                likes: 0,
                comments: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                isPublic: true,
                tags: [formData.category], // 기본 태그
                imageUrl: null, // 추후 이미지 업로드 기능 추가 시 사용
            };

            const docRef = await addDoc(collection(db, 'recipes'), recipeData);
            console.log('레시피 저장 완료. Document ID:', docRef.id);

            // 성공 알림
            alert('레시피가 성공적으로 등록되었습니다! 🎉');
            navigate('/mypage'); // 마이페이지로 이동하여 등록된 레시피 확인
        } catch (error) {
            console.error('레시피 저장 오류:', error);

            // 사용자 친화적 오류 메시지
            let errorMessage = '레시피 저장에 실패했습니다.';
            if (error.code === 'permission-denied') {
                errorMessage = '레시피 저장 권한이 없습니다. 로그인 상태를 확인해주세요.';
            } else if (error.code === 'network-request-failed') {
                errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
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
                            🔒
                        </div>
                        <h2 style={{ marginBottom: '10px' }}>로그인이 필요합니다</h2>
                        <p style={{ marginBottom: '30px' }}>
                            레시피를 작성하려면 로그인해주세요.
                        </p>
                        <Link
                            to="/login"
                            style={{
                                backgroundColor: '#e53935',
                                color: '#ffffff',
                                padding: '12px 24px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}
                        >
                            로그인하기
                        </Link>
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
                <div style={{
                    position: 'absolute',
                    top: '60px',
                    left: '-50px',
                    width: '102px',
                    height: '102px',
                    backgroundColor: '#f7d1a9',
                    borderRadius: '50%',
                    zIndex: 1
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '81px',
                    right: '-30px',
                    width: '119px',
                    height: '119px',
                    backgroundColor: '#f6e4f2',
                    borderRadius: '50%',
                    zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="form-container">
                        <h1 className="form-title">✏️ 새 레시피 작성</h1>
                        <p style={{
                            textAlign: 'center',
                            color: '#666',
                            fontSize: '14px',
                            marginBottom: '30px'
                        }}>
                            맛있는 레시피를 공유해보세요! 🍽️
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* 레시피 제목 */}
                            <div className="form-group">
                                <label className="form-label">
                                    레시피 제목 *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`form-input ${errors.title ? 'error' : ''}`}
                                    placeholder="맛있는 레시피 제목을 입력해주세요"
                                />
                                {errors.title && <div className="error-message">{errors.title}</div>}
                            </div>

                            {/* 카테고리 & 난이도 */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px',
                                marginBottom: '20px'
                            }}>
                                <div className="form-group">
                                    <label className="form-label">카테고리</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="form-input"
                                    >
                                        <option value="한식">한식</option>
                                        <option value="양식">양식</option>
                                        <option value="일식">일식</option>
                                        <option value="중식">중식</option>
                                        <option value="베이커리">베이커리</option>
                                        <option value="브런치">브런치</option>
                                        <option value="디저트">디저트</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">난이도</label>
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                        className="form-input"
                                    >
                                        <option value="난이도 하">쉬움 ⭐</option>
                                        <option value="난이도 중">보통 ⭐⭐</option>
                                        <option value="난이도 상">어려움 ⭐⭐⭐</option>
                                    </select>
                                </div>
                            </div>

                            {/* 요리 시간 */}
                            <div className="form-group">
                                <label className="form-label">요리 시간 *</label>
                                <input
                                    type="text"
                                    name="cookTime"
                                    value={formData.cookTime}
                                    onChange={handleChange}
                                    className={`form-input ${errors.cookTime ? 'error' : ''}`}
                                    placeholder="예: 30분, 1시간 30분"
                                />
                                {errors.cookTime && <div className="error-message">{errors.cookTime}</div>}
                            </div>

                            {/* 재료 */}
                            <div className="form-group">
                                <label className="form-label">재료 *</label>
                                <textarea
                                    name="ingredients"
                                    value={formData.ingredients}
                                    onChange={handleChange}
                                    className={`form-textarea ${errors.ingredients ? 'error' : ''}`}
                                    rows="4"
                                    placeholder="재료를 한 줄씩 입력해주세요.&#10;예:&#10;돼지고기 300g&#10;김치 200g&#10;양파 1개"
                                />
                                {errors.ingredients && <div className="error-message">{errors.ingredients}</div>}
                            </div>

                            {/* 레시피 설명 */}
                            <div className="form-group">
                                <label className="form-label">레시피 설명 *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                                    rows="3"
                                    placeholder="레시피에 대한 간단한 설명을 입력해주세요."
                                />
                                {errors.description && <div className="error-message">{errors.description}</div>}
                            </div>

                            {/* 요리 과정 */}
                            <div className="form-group">
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <label className="form-label">요리 과정 *</label>
                                    <button
                                        type="button"
                                        onClick={addStep}
                                        className="add-step-btn"
                                    >
                                        + 단계 추가
                                    </button>
                                </div>

                                {formData.steps.map((step, index) => (
                                    <div key={index} className="step-item">
                                        <div className="step-number">{index + 1}</div>
                                        <textarea
                                            value={step}
                                            onChange={(e) => handleStepChange(index, e.target.value)}
                                            className={`form-textarea ${errors.steps ? 'error' : ''}`}
                                            rows="2"
                                            placeholder={`${index + 1}단계 요리 과정을 입력해주세요.`}
                                        />
                                        {formData.steps.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeStep(index)}
                                                className="remove-step-btn"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {errors.steps && <div className="error-message">{errors.steps}</div>}
                            </div>

                            {/* 제출 버튼 */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="cancel-btn"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="submit-btn"
                                >
                                    {loading ? '등록 중...' : '✨ 레시피 등록하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default RecipeForm; 