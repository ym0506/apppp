import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Recipe from './pages/Recipe';
import RecipeForm from './pages/RecipeForm';
import MyPage from './pages/MyPage';
import Favorites from './pages/Favorites';
import './styles/global.css';

function AppContent() {
    return (
        <div className="app">
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/recipe/new" element={<RecipeForm />} />
                    <Route path="/recipe/:id" element={<Recipe />} />
                    <Route path="/recipe-form" element={<RecipeForm />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App; 