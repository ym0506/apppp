import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            id: 'home',
            label: '홈',
            path: '/',
            icon: '/images/home/nav-home.png',
            textIcon: '/images/home/nav-text-home.png'
        },
        {
            id: 'search',
            label: '검색',
            path: '/search',
            icon: '/images/home/nav-search.png',
            textIcon: '/images/home/nav-text-search.png'
        },
        {
            id: 'recipe-form',
            label: '+',
            path: '/recipe-form',
            icon: '/images/home/nav-add.png',
            isCenter: true
        },
        {
            id: 'mypage',
            label: '마이',
            path: '/mypage',
            icon: '/images/home/nav-profile.png',
            textIcon: '/images/home/nav-text-profile.png'
        },
        {
            id: 'favorites',
            label: '찜',
            path: '/favorites',
            icon: '/images/home/nav-like.png',
            textIcon: '/images/home/nav-text-like.png'
        }
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#ffefd5',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderRadius: '15px 15px 0 0',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1000
        }}>
            {navItems.map((item) => {
                const active = isActive(item.path);

                if (item.isCenter) {
                    return (
                        <div
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            style={{
                                width: '62px',
                                height: '62px',
                                backgroundColor: '#e53935',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transform: 'translateY(-15px)',
                                boxShadow: '0 4px 12px rgba(229, 57, 53, 0.3)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <img
                                src={item.icon}
                                alt={item.label}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span style={{
                                color: '#ffffff',
                                fontSize: '24px',
                                fontWeight: '600',
                                display: 'none'
                            }}>
                                +
                            </span>
                        </div>
                    );
                }

                return (
                    <div
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '12px',
                            backgroundColor: active ? 'rgba(229, 57, 53, 0.1)' : 'transparent',
                            transition: 'all 0.2s ease',
                            minWidth: '50px'
                        }}
                    >
                        <div style={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={item.icon}
                                alt={item.label}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    filter: active ? 'brightness(0) saturate(100%) invert(25%) sepia(85%) saturate(6515%) hue-rotate(358deg) brightness(91%) contrast(84%)' : 'none'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span style={{
                                fontSize: '20px',
                                display: 'none',
                                color: active ? '#e53935' : '#666'
                            }}>
                                {item.id === 'home' ? '🏠' :
                                    item.id === 'search' ? '🔍' :
                                        item.id === 'mypage' ? '👤' : '❤️'}
                            </span>
                        </div>

                        {item.textIcon ? (
                            <img
                                src={item.textIcon}
                                alt={`${item.label} 텍스트`}
                                style={{
                                    height: '8px',
                                    objectFit: 'contain',
                                    filter: active ? 'brightness(0) saturate(100%) invert(25%) sepia(85%) saturate(6515%) hue-rotate(358deg) brightness(91%) contrast(84%)' : 'none'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                        ) : null}
                        <span style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            color: active ? '#e53935' : '#666',
                            display: item.textIcon ? 'none' : 'block'
                        }}>
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </nav>
    );
};

export default BottomNav; 