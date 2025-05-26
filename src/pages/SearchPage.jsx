import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryFilter from '../components/CategoryFilter';

const SearchPage = () => {
    // 샘플 데이터
    const searchResults = [
        { id: 1, title: '토마토 미트볼 파스타', image: 'https://via.placeholder.com/383x104' },
        { id: 2, title: '간단 김치찌개', image: 'https://via.placeholder.com/383x104' },
        { id: 3, title: '비빔밥', image: 'https://via.placeholder.com/383x104' },
        { id: 4, title: '계란말이', image: 'https://via.placeholder.com/383x104' }
    ];

    return (
        <div className="app-container">
            <Header searchBar={true} />

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontWeight: '800', fontSize: '20px', padding: '0 15px', marginBottom: '10px' }}>
                    오늘은<br />어떤 요리를 할까요?
                </h2>

                <div style={{ padding: '15px' }}>
                    <div className="search-bar" style={{ maxWidth: '100%', height: '48px' }}>
                        <input
                            type="text"
                            className="search-input"
                            style={{ fontSize: '14px' }}
                            placeholder="레시피를 검색해보세요!"
                        />
                        <div className="search-icon">
                            <div className="search-dot" style={{ width: '4px', height: '4px' }}></div>
                            <div className="search-dot" style={{ width: '4px', height: '4px' }}></div>
                            <div className="search-dot" style={{ width: '4px', height: '4px' }}></div>
                        </div>
                    </div>
                </div>

                <CategoryFilter size="large" />

                <div style={{ margin: '20px 15px' }}>
                    {searchResults.map(result => (
                        <div
                            key={result.id}
                            style={{
                                backgroundColor: '#D9D9D9',
                                borderRadius: '10px',
                                height: '104px',
                                marginBottom: '20px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <img
                                src={result.image}
                                alt={result.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                            {/* 북마크 아이콘 (오른쪽 상단에 표시) */}
                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="18" height="18" fill="none" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 여백 (푸터 공간 확보) */}
            <div style={{ height: '120px' }}></div>

            <Footer />
        </div>
    );
};

export default SearchPage; 