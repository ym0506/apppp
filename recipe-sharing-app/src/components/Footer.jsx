import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <Link to="/" className="footer-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="36" height="36" fill="none" />
                    <path d="M18 6L3 18H7V30H15V22H21V30H29V18H33L18 6Z" fill="#333" />
                </svg>
            </Link>

            <div className="footer-center">
                <Link to="/create">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" fill="none" />
                        <path d="M20 10V30M10 20H30" stroke="#333" strokeWidth="2" />
                    </svg>
                </Link>
            </div>

            <Link to="/search" className="footer-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" fill="none" />
                    <circle cx="18" cy="18" r="8" stroke="#333" strokeWidth="2" />
                    <path d="M24 24L30 30" stroke="#333" strokeWidth="2" />
                </svg>
            </Link>
        </footer>
    );
};

export default Footer; 