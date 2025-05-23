import React from 'react';

const CategoryFilter = ({ size = 'small' }) => {
    const categories = [
        { id: 1, name: 'ALL' },
        { id: 2, name: '한식' },
        { id: 3, name: '베이커리' },
        { id: 4, name: '브런치' }
    ];

    return (
        <div className="category-filters">
            {categories.map(category => (
                <div
                    key={category.id}
                    className="category-filter"
                    style={{
                        height: size === 'large' ? '32px' : '15px',
                        fontSize: size === 'large' ? '14px' : '8px',
                        minWidth: size === 'large' ? '78px' : '37px',
                    }}
                >
                    {category.name}
                </div>
            ))}
        </div>
    );
};

export default CategoryFilter; 