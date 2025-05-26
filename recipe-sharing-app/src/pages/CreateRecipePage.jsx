import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CreateRecipePage = () => {
    const [recipe, setRecipe] = useState({
        category: '',
        title: '',
        content: '',
        ingredients: ['', '', '', '', ''],
        steps: ['', '', ''],
        isPublic: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleIngredientsChange = (index, value) => {
        const newIngredients = [...recipe.ingredients];
        newIngredients[index] = value;
        setRecipe(prev => ({
            ...prev,
            ingredients: newIngredients
        }));
    };

    const handleStepsChange = (index, value) => {
        const newSteps = [...recipe.steps];
        newSteps[index] = value;
        setRecipe(prev => ({
            ...prev,
            steps: newSteps
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('레시피 등록:', recipe);
        // 여기서 API 호출하여 레시피 등록
    };

    return (
        <div className="app-container">
            <Header />

            <div className="recipe-form">
                <div className="shape-orange circular-shape" style={{ left: '150px', top: '20px' }}></div>
                <div className="shape-pink circular-shape" style={{ left: '230px', top: '50px' }}></div>

                <h1 className="recipe-form-title">
                    나만의 레시피를<br />등록해보세요!
                </h1>

                <form onSubmit={handleSubmit}>
                    {/* 카테고리 */}
                    <div className="input-group">
                        <label className="input-label">카테고리</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                            {['한식', '일식', '중식', '양식', '기타'].map((category, index) => (
                                <div
                                    key={index}
                                    className={`category-button ${recipe.category === category ? 'active' : ''}`}
                                    onClick={() => setRecipe(prev => ({ ...prev, category }))}
                                >
                                    {category}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 요리명 */}
                    <div className="input-group">
                        <label className="input-label">요리명</label>
                        <div style={{
                            height: '26px',
                            backgroundColor: '#D9D9D9',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 10px'
                        }}>
                            <input
                                type="text"
                                name="title"
                                value={recipe.title}
                                onChange={handleChange}
                                placeholder="센스있는 요리명을 지어주세요"
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    width: '100%',
                                    fontSize: '8px',
                                    color: 'white',
                                    fontWeight: '800'
                                }}
                            />
                        </div>
                    </div>

                    {/* 내용 */}
                    <div className="input-group">
                        <label className="input-label">내용</label>
                        <div style={{
                            height: '57px',
                            backgroundColor: '#D9D9D9',
                            borderRadius: '5px',
                            padding: '10px'
                        }}>
                            <textarea
                                name="content"
                                value={recipe.content}
                                onChange={handleChange}
                                placeholder="본문을 작성해주세요"
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    width: '100%',
                                    height: '100%',
                                    resize: 'none',
                                    fontSize: '8px',
                                    color: 'white',
                                    fontWeight: '800'
                                }}
                            />
                        </div>
                    </div>

                    {/* 주재료 */}
                    <div className="input-group">
                        <label className="input-label">주재료</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                            {recipe.ingredients.map((ingredient, index) => (
                                <div key={index} className="ingredient-item">
                                    <div className="ingredient-icon"></div>
                                    <input
                                        type="text"
                                        value={ingredient}
                                        onChange={(e) => handleIngredientsChange(index, e.target.value)}
                                        className="ingredient-input"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 요리과정 */}
                    <div className="input-group">
                        <label className="input-label">요리과정</label>
                        {recipe.steps.map((step, index) => (
                            <div key={index} className="step-input">
                                <div className="step-number">{index + 1}</div>
                                <div style={{
                                    backgroundColor: '#D9D9D9',
                                    borderRadius: '10px',
                                    height: '17px',
                                    flex: 1,
                                    position: 'relative'
                                }}>
                                    <input
                                        type="text"
                                        value={step}
                                        onChange={(e) => handleStepsChange(index, e.target.value)}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            opacity: 0,
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <div
                                className="add-step-button"
                                onClick={() => setRecipe(prev => ({ ...prev, steps: [...prev.steps, ''] }))}
                            >
                                +
                            </div>
                        </div>
                    </div>

                    {/* 완성음식 등록 */}
                    <div className="input-group">
                        <label className="input-label">완성음식 등록</label>
                        <div className="photo-upload">
                            <div style={{
                                width: '21px',
                                height: '21px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                margin: '10px 0'
                            }}></div>
                            <span style={{ fontWeight: '700', fontSize: '14px' }}>PHOTO</span>
                        </div>
                    </div>

                    {/* 닉네임 공개 */}
                    <div className="input-group">
                        <label className="input-label">닉네임 공개</label>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={recipe.isPublic}
                                onChange={() => setRecipe(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {/* 등록 버튼 */}
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button type="submit" className="btn btn-primary">등록하기</button>
                    </div>
                </form>
            </div>

            {/* 여백 (푸터 공간 확보) */}
            <div style={{ height: '120px' }}></div>

            <Footer />
        </div>
    );
};

export default CreateRecipePage; 