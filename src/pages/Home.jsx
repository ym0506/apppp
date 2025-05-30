import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [, setRandomRecipes] = useState([]);

    useEffect(() => {
        // 랜덤 레시피 로직 (추후 Firebase 연동)
        const fetchRandomRecipes = async () => {
            // 임시 데이터
            const mockRecipes = [
                { id: 'kimchi-stew', name: '돼지고기 김치찌개', imageUrl: '/images/home/kimchi-stew.jpg' },
                { id: 'pasta', name: '토마토 미트볼 파스타', imageUrl: '/images/home/pasta.jpg' },
                { id: 'millefeuille', name: '밀푀유나베', imageUrl: '/images/home/millefeuille.jpg' },
            ];
            setRandomRecipes(mockRecipes);
        };

        fetchRandomRecipes();
    }, []);

    return (
        <div className="App" style={{ paddingBottom: '100px' }}>
            {/* 통일된 헤더 컴포넌트 사용 */}
            <Header showScrollBanner={true} />

            {/* 배너 이미지 */}
            <div className="main-banner">
                <div className="banner-image-wrap">
                    <img src="/images/home/main-visual.png" alt="main-visual" className="main-visual" />
                    <img src="/images/home/banner-overlay.png" alt="overlay" className="banner-overlay" />
                </div>

                {/* 검색창 */}
                <div className="search-bar">
                    <img src="/images/home/search-icon.png" alt="검색" className="search-icon-inline" />
                    <input
                        type="text"
                        placeholder="오늘은 어떤 요리를 할까요?"
                        onClick={() => navigate('/search')}
                        readOnly
                    />
                </div>
            </div>

            {/* 카테고리 */}
            <div className="section">
                <h3>Categories</h3>
                <div className="category-list">
                    {['korean', 'japanese', 'chinese', 'western'].map((type) => (
                        <div className="category" key={type} onClick={() => navigate(`/search?category=${type}`)}>
                            <div className="category-img-wrap">
                                <img src={`/images/categories/${type}.png`} alt={type} className="category-img" />
                                <img src="/images/home/plate.png" alt="plate" className="plate-img" />
                            </div>
                            <span>
                                {type === 'korean' ? '한식' : type === 'japanese' ? '일식' : type === 'chinese' ? '중식' : '양식'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 베스트 메뉴 */}
            <div className="section">
                <h3>Best Menu</h3>
                <div className="best-menu">
                    {[
                        { id: 'kimchi-stew', name: '돼지고기 김치찌개', imageUrl: '/images/home/kimchi-stew.jpg' },
                        { id: 'pasta', name: '토마토 미트볼 파스타', imageUrl: '/images/home/pasta.jpg' },
                        { id: 'millefeuille', name: '밀푀유나베', imageUrl: '/images/home/millefeuille.jpg' },
                    ].map(item => (
                        <div className="menu-card" key={item.id} onClick={() => navigate(`/recipe/${item.id}`)}>
                            <img src={item.imageUrl} alt={item.name} />
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* 캐릭터 말풍선 */}
                <div className="menu-bot-character">
                    <img src="/images/home/speech.png" alt="말풍선" className="speech-img" />
                    <img src="/images/home/bot.png" alt="오늘 뭐 먹지?" className="bot-img" />
                </div>
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav />
        </div>
    );
};

export default Home;



