import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import './styles/auth.css';

console.log('index.js가 실행되었습니다! (CSS 포함 버전)');

try {
    const rootElement = document.getElementById('root');
    console.log('root 엘리먼트:', rootElement);

    if (!rootElement) {
        throw new Error('root 엘리먼트를 찾을 수 없습니다!');
    }

    const root = createRoot(rootElement);
    console.log('createRoot 성공!');

    root.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
    console.log('render 완료! (BrowserRouter + CSS 포함)');

} catch (error) {
    console.error('렌더링 에러:', error);

    // 에러 발생 시 직접 HTML 조작
    document.body.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: red;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            text-align: center;
            z-index: 9999;
        ">
            <div>
                <h1>🚨 렌더링 에러 발생!</h1>
                <p>콘솔을 확인해주세요: ${error.message}</p>
            </div>
        </div>
    `;
} 