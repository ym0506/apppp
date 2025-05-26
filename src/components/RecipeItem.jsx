import React from 'react';
import { Link } from 'react-router-dom';

const RecipeItem = ({ recipe, isNew = false }) => {
    return (
        <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="recipe-item">
                {isNew && (
                    <div className="new-badge">NEW</div>
                )}
            </div>
        </Link>
    );
};

export default RecipeItem; 