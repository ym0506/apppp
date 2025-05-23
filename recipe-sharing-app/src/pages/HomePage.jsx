import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryFilter from '../components/CategoryFilter';
import RecipeCard from '../components/RecipeCard';
import RecipeItem from '../components/RecipeItem';

const HomePage = () => {
    // 샘플 데이터
    const featuredRecipe = {
        id: 1,
        title: '토마토 파스타',
        image: null
    };

    const newRecipes = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 }
    ];

    return (
        <div className="app-container">
            <Header />

            {/* Hero 섹션 */}
            <section className="hero-section">
                <div className="shape-orange circular-shape"></div>
                <div className="shape-pink circular-shape"></div>
                <div className="shape-pink-right circular-shape"></div>

                <div className="hero-text">
                    <div>SHARE</div>
                    <div>YOUR FOOD!</div>
                </div>

                <div className="hero-image">
                    <div style={{ marginBottom: '20px' }}>
                        <span className="hero-badge">COOK.</span>
                        <span className="hero-badge">SHARE.</span>
                    </div>
                    <div>
                        <span className="hero-badge">CREATE.</span>
                        <span className="hero-badge">TOGETHER.</span>
                    </div>
                </div>
            </section>

            <div style={{ textAlign: 'center', padding: '10px' }}>
                <p style={{ fontSize: '16px', fontWeight: '200' }}>
                    Let's get cooking Let's get cooking Let's get cooking Let's get cooking
                </p>
            </div>

            {/* 카테고리 */}
            <section>
                <h2 className="section-title">Categories</h2>
                <div className="category-grid">
                    <div className="category-item">
                        <img src="https://via.placeholder.com/85" alt="카테고리" className="category-image" />
                        <span className="category-name">한식</span>
                    </div>
                    <div className="category-item">
                        <img src="https://via.placeholder.com/85" alt="카테고리" className="category-image" />
                        <span className="category-name">일식</span>
                    </div>
                    <div className="category-item">
                        <img src="https://via.placeholder.com/85" alt="카테고리" className="category-image" />
                        <span className="category-name">중식</span>
                    </div>
                    <div className="category-item">
                        <img src="https://via.placeholder.com/85" alt="카테고리" className="category-image" />
                        <span className="category-name">양식</span>
                    </div>
                </div>
            </section>

            {/* 추천 레시피 */}
            <section>
                <h2 className="section-title">TODAY'S 추천 레시피</h2>
                <RecipeCard recipe={featuredRecipe} />
            </section>

            {/* 신규 등록 레시피 */}
            <section>
                <h2 className="section-title">신규 등록 레시피</h2>
                <div className="recipe-list">
                    {newRecipes.map(recipe => (
                        <RecipeItem key={recipe.id} recipe={recipe} isNew={true} />
                    ))}
                </div>
            </section>

            {/* 여백 (푸터 공간 확보) */}
            <div style={{ height: '120px' }}></div>

            <Footer />
        </div>
    );
};

export default HomePage; 