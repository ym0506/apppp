import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RecipeDetailPage = () => {
    const { id } = useParams();

    // 샘플 데이터
    const recipe = {
        id,
        title: '토마토 미트볼 파스타',
        time: '10min',
        servings: '1인분',
        difficulty: '난이도 하',
        author: 'Cameron Williamson',
        ingredients: [
            { id: 1, name: '소고기' },
            { id: 2, name: '양파' },
            { id: 3, name: '빵가루' },
            { id: 4, name: '우유' },
            { id: 5, name: '달걀' }
        ],
        steps: [
            { id: 1, description: '토마토 소스를 만듭니다.' },
            { id: 2, description: '미트볼을 동그랗게 빚습니다.' },
            { id: 3, description: '미트볼을 익혀줍니다.' },
            { id: 4, description: '소스에 미트볼을 넣고 같이 끓여줍니다.' },
            { id: 5, description: '삶은 파스타면을 소스에 넣고 섞어줍니다.' }
        ],
        comments: [
            { id: 1, author: '사용자1', text: '레시피 공유해주셔서 감사합니다 😭' },
            { id: 2, author: '사용자2', text: '아 군침도네용..' },
            { id: 3, author: '사용자3', text: '오늘 저녁으로 해봐야겠어요' },
            { id: 4, author: '사용자4', text: '레시피 완전 최고!' }
        ]
    };

    return (
        <div className="app-container">
            <Header />

            {/* 레시피 이미지 */}
            <div style={{ height: '234px', backgroundColor: '#D9D9D9', position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '32px'
                }}>
                    PHOTO
                </div>
            </div>

            {/* 레시피 정보 */}
            <div style={{ padding: '20px 15px' }}>
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid black',
                    borderRadius: '10px',
                    padding: '15px',
                    position: 'relative',
                    marginBottom: '30px'
                }}>
                    <h1 style={{ fontSize: '16px', fontWeight: '800', textAlign: 'center', marginBottom: '15px' }}>
                        {recipe.title}
                    </h1>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="22" height="22" fill="none" />
                            </svg>
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>{recipe.time}</span>
                        </div>

                        <span style={{ fontSize: '13px', fontWeight: '900' }}>{recipe.servings}</span>

                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{recipe.difficulty}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '24px', height: '24px', backgroundColor: '#D9D9D9', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '10px', fontWeight: '500' }}>{recipe.author}</span>
                        <div style={{
                            marginLeft: 'auto',
                            backgroundColor: '#D9D9D9',
                            borderRadius: '10px',
                            fontSize: '5px',
                            padding: '2px 5px'
                        }}>
                            구독
                        </div>
                    </div>
                </div>

                {/* 재료 */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ width: '33px', height: '33px', marginRight: '5px' }}>
                            <img src="https://via.placeholder.com/33" alt="재료 아이콘" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <h2 style={{ fontSize: '15px', fontWeight: '800' }}>재료</h2>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {recipe.ingredients.map(ingredient => (
                            <div key={ingredient.id} style={{
                                width: '65px',
                                height: '65px',
                                backgroundColor: '#D9D9D9',
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{ fontSize: '10px', fontWeight: '500', marginTop: '5px' }}>
                                    {ingredient.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 내용 */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ width: '32px', height: '32px', marginRight: '5px' }}>
                            <img src="https://via.placeholder.com/32" alt="내용 아이콘" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <h2 style={{ fontSize: '15px', fontWeight: '800' }}>내용</h2>
                    </div>

                    <div style={{
                        backgroundColor: '#D9D9D9',
                        borderRadius: '5px',
                        padding: '15px',
                        minHeight: '89px'
                    }}>
                        {/* 본문 내용 */}
                    </div>
                </div>

                {/* 레시피 */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ width: '31px', height: '31px', marginRight: '5px' }}>
                            <img src="https://via.placeholder.com/31" alt="레시피 아이콘" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <h2 style={{ fontSize: '15px', fontWeight: '800' }}>레시피</h2>
                    </div>

                    {recipe.steps.map(step => (
                        <div key={step.id} style={{ display: 'flex', marginBottom: '10px' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: '#D9D9D9',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '800',
                                fontSize: '15px',
                                marginRight: '15px'
                            }}>
                                {step.id}
                            </div>
                            <div style={{
                                flex: 1,
                                backgroundColor: '#D9D9D9',
                                borderRadius: '10px',
                                height: '17px'
                            }}></div>
                        </div>
                    ))}
                </div>

                {/* 커뮤니티 */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ width: '37px', height: '37px', marginRight: '5px' }}>
                            <img src="https://via.placeholder.com/37" alt="커뮤니티 아이콘" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <h2 style={{ fontSize: '15px', fontWeight: '800' }}>커뮤니티</h2>
                    </div>

                    <div style={{
                        backgroundColor: '#D9D9D9',
                        borderRadius: '10px',
                        padding: '15px',
                        minHeight: '207px'
                    }}>
                        {recipe.comments.map(comment => (
                            <div key={comment.id} style={{
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                padding: '5px 10px',
                                marginBottom: '10px',
                                fontSize: '12px',
                                fontWeight: '800'
                            }}>
                                {comment.text}
                            </div>
                        ))}

                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            marginTop: '20px',
                            fontSize: '10px',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <span>댓글을 남겨보세요!</span>
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="20" height="21" fill="none" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 여백 (푸터 공간 확보) */}
            <div style={{ height: '120px' }}></div>

            <Footer />
        </div>
    );
};

export default RecipeDetailPage; 