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
            background: 'linear-gradient(135deg, rgba(255, 249, 245, 0.95) 0%, rgba(255, 244, 230, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            padding: '20px 24px 24px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderRadius: '24px 24px 0 0',
            boxShadow: `
                0 -8px 32px rgba(0, 0, 0, 0.08),
                0 -4px 16px rgba(255, 107, 71, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.6)
            `,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderBottom: 'none',
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
                                width: '68px',
                                height: '68px',
                                background: 'linear-gradient(135deg, #ff8a65 0%, #ff6b47 50%, #ff5722 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transform: 'translateY(-16px)',
                                boxShadow: `
                                    0 8px 32px rgba(255, 107, 71, 0.4),
                                    0 0 0 4px rgba(255, 255, 255, 0.8),
                                    inset 0 2px 0 rgba(255, 255, 255, 0.3),
                                    inset 0 -2px 0 rgba(0, 0, 0, 0.1)
                                `,
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-20px) scale(1.05)';
                                e.target.style.boxShadow = `
                                    0 12px 40px rgba(255, 107, 71, 0.5),
                                    0 0 0 4px rgba(255, 255, 255, 0.9),
                                    inset 0 2px 0 rgba(255, 255, 255, 0.4),
                                    inset 0 -2px 0 rgba(0, 0, 0, 0.1)
                                `;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(-16px) scale(1)';
                                e.target.style.boxShadow = `
                                    0 8px 32px rgba(255, 107, 71, 0.4),
                                    0 0 0 4px rgba(255, 255, 255, 0.8),
                                    inset 0 2px 0 rgba(255, 255, 255, 0.3),
                                    inset 0 -2px 0 rgba(0, 0, 0, 0.1)
                                `;
                            }}
                        >
                            {/* 글로우 효과 */}
                            <div style={{
                                position: 'absolute',
                                top: '-2px',
                                left: '-2px',
                                right: '-2px',
                                bottom: '-2px',
                                background: 'linear-gradient(135deg, #ffab8e, #ff8a65)',
                                borderRadius: '50%',
                                zIndex: -1,
                                opacity: 0,
                                transition: 'opacity 0.3s ease'
                            }} />

                            <img
                                src={item.icon}
                                alt={item.label}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    objectFit: 'contain',
                                    filter: 'brightness(0) invert(1)',
                                    transition: 'all 0.3s ease'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span style={{
                                color: '#ffffff',
                                fontSize: '28px',
                                fontWeight: '300',
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
                            gap: '6px',
                            cursor: 'pointer',
                            padding: '12px 8px',
                            borderRadius: '16px',
                            background: active
                                ? 'linear-gradient(135deg, rgba(255, 107, 71, 0.15) 0%, rgba(255, 107, 71, 0.1) 100%)'
                                : 'transparent',
                            border: active
                                ? '1px solid rgba(255, 107, 71, 0.2)'
                                : '1px solid transparent',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            minWidth: '56px',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: active
                                ? '0 4px 16px rgba(255, 107, 71, 0.15)'
                                : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (!active) {
                                e.currentTarget.style.background = 'rgba(255, 107, 71, 0.08)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 71, 0.1)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!active) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }}
                    >
                        {/* 활성 상태 배경 글로우 */}
                        {active && (
                            <div style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                right: '0',
                                bottom: '0',
                                background: 'linear-gradient(135deg, rgba(255, 107, 71, 0.1) 0%, transparent 50%)',
                                borderRadius: '16px',
                                zIndex: -1
                            }} />
                        )}

                        <div style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                        }}>
                            <img
                                src={item.icon}
                                alt={item.label}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    filter: active
                                        ? 'brightness(0) saturate(100%) invert(25%) sepia(85%) saturate(6515%) hue-rotate(358deg) brightness(91%) contrast(84%)'
                                        : 'brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(70%) contrast(100%)',
                                    transition: 'all 0.3s ease',
                                    transform: active ? 'scale(1.1)' : 'scale(1)'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span style={{
                                fontSize: '20px',
                                display: 'none',
                                color: active ? '#ff6b47' : '#666'
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
                                    height: '10px',
                                    objectFit: 'contain',
                                    filter: active
                                        ? 'brightness(0) saturate(100%) invert(25%) sepia(85%) saturate(6515%) hue-rotate(358deg) brightness(91%) contrast(84%)'
                                        : 'brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(70%) contrast(100%)',
                                    transition: 'all 0.3s ease',
                                    transform: active ? 'scale(1.05)' : 'scale(1)'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                        ) : null}
                        <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: active ? '#ff6b47' : '#666',
                            display: item.textIcon ? 'none' : 'block',
                            transition: 'all 0.3s ease',
                            letterSpacing: '-0.01em'
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