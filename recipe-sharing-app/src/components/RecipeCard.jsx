import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    return (
        <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="recipe-card">
                <div style={{ height: '210px', backgroundColor: '#D9D9D9', borderRadius: '30px' }}>
                    {recipe.image && <img src={recipe.image} alt={recipe.title} />}
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard; 