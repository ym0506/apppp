import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 페이지 임포트
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CreateRecipePage from './pages/CreateRecipePage';
import LoginPage from './pages/LoginPage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/create" element={<CreateRecipePage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
};

export default App; 