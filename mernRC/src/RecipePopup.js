import React, { useState, useEffect, useRef } from 'react';

// Utility function to fetch data from an API endpoint
const fetchFromApi = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

const RecipePopup = ({
    setShowPopup,
    selectedMealDetails,
    setSelectedMealDetails,
    popupSearchResults,
    handlePopupMealClick
}) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [filteredResults, setFilteredResults] = useState([]); // State for filtered search results
    const reviewsRef = useRef(null);

    // Fetch filter data when the component mounts
    useEffect(() => {
        const fetchFilterData = async () => {
            const categoriesData = await fetchFromApi('https://www.themealdb.com/api/json/v2/9973533/categories.php');
            const areasData = await fetchFromApi('https://www.themealdb.com/api/json/v2/9973533/list.php?a=list');
            const ingredientsData = await fetchFromApi('https://www.themealdb.com/api/json/v2/9973533/list.php?i=list');
            
            setCategories(categoriesData.categories);
            setAreas(areasData.meals);
            setIngredients(ingredientsData.meals);
        };

        fetchFilterData();
    }, []);

    // Handle adding a review
    const handleAddReview = () => {
        if (reviewText.trim() !== '') {
            setReviews([...reviews, { rating, text: reviewText }]);
            setReviewText('');
            setRating(0);
            setHover(0);
        }
    };

    // Scroll to reviews section
    const scrollToReviews = () => {
        reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch meals based on selected filters
    useEffect(() => {
        if (selectedCategory || selectedArea || selectedIngredient) {
            let url = 'https://www.themealdb.com/api/json/v2/9973533/filter.php?';

            if (selectedCategory) url += `c=${selectedCategory}&`;
            if (selectedArea) url += `a=${selectedArea}&`;
            if (selectedIngredient) url += `i=${selectedIngredient}&`;

            fetchFromApi(url).then(data => {
                setFilteredResults(data.meals || []); // Update filtered results
            });
        }
    }, [selectedCategory, selectedArea, selectedIngredient]);

    // Function to reset filters
    const resetFilters = () => {
        setSelectedCategory('');
        setSelectedArea('');
        setSelectedIngredient('');
        setFilteredResults([]); // Clear filtered results
    };

    return (
        <div className="popup">
            <button className="exit-button" onClick={() => setShowPopup(false)}>X</button>
            <h2>Recipes</h2>
            <button 
                className="show-filters-button" 
                onClick={() => setFiltersVisible(!filtersVisible)}
                style={{ marginBottom: '20px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px' }}
            >
                {filtersVisible ? 'Hide Filters' : 'Show Filters'}
            </button>
            {filtersVisible && (
                <div className="filters-section" style={{ marginBottom: '20px' }}>
                    <h4>Filters</h4>
                    <div>
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ marginBottom: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.strCategory} value={category.strCategory}>
                                    {category.strCategory}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select 
                            value={selectedArea} 
                            onChange={(e) => setSelectedArea(e.target.value)}
                            style={{ marginBottom: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                        >
                            <option value="">Select an area</option>
                            {areas.map((area) => (
                                <option key={area.strArea} value={area.strArea}>
                                    {area.strArea}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select 
                            value={selectedIngredient} 
                            onChange={(e) => setSelectedIngredient(e.target.value)}
                            style={{ marginBottom: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                        >
                            <option value="">Select an ingredient</option>
                            {ingredients.map((ingredient) => (
                                <option key={ingredient.strIngredient} value={ingredient.strIngredient}>
                                    {ingredient.strIngredient}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={resetFilters}
                        style={{ marginTop: '10px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px' }}
                    >
                        Reset Filters
                    </button>
                </div>
            )}
            <div className="popup-content">
                {selectedMealDetails ? (
                    <div className="meal-details-popup">
                        <button onClick={() => {
                            setSelectedMealDetails(null);
                            setRating(0); // Reset rating when going back to search results
                            setHover(0);
                        }}>Back</button>
                        <h3>{selectedMealDetails.strMeal}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {[...Array(5)].map((star, index) => {
                                    index += 1;
                                    return (
                                        <button
                                            type="button"
                                            key={index}
                                            className={index <= (hover || rating) ? "on" : "off"}
                                            onClick={() => setRating(index)}
                                            onMouseEnter={() => setHover(index)}
                                            onMouseLeave={() => setHover(rating)}
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '1.5rem',
                                                color: index <= (hover || rating) ? "#ffc107" : "#e4e5e9",
                                            }}
                                        >
                                            <span className="star">&#9733;</span>
                                        </button>
                                    );
                                })}
                                <span 
                                    style={{ cursor: 'pointer', color: '#007bff', marginLeft: '10px' }} 
                                    onClick={scrollToReviews}
                                >
                                    {reviews.length} review{reviews.length !== 1 && 's'}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '50px', marginTop: '20px' }}>
                            <img 
                                style={{ width: '50%', maxWidth: '200px' }}
                                src={selectedMealDetails.strMealThumb} 
                                alt={selectedMealDetails.strMeal} 
                            />
                            <div style={{ textAlign: 'left' }}>
                                <h4>Ingredients</h4>
                                <ul>
                                    {Array.from({ length: 20 }).map((_, i) => {
                                        const ingredient = selectedMealDetails[`strIngredient${i + 1}`];
                                        const measure = selectedMealDetails[`strMeasure${i + 1}`];
                                        return ingredient ? (
                                            <li key={i}>{ingredient} - {measure}</li>
                                        ) : null;
                                    })}
                                </ul>
                            </div>
                        </div>
                        <h4>Instructions</h4>
                        <p>{selectedMealDetails.strInstructions}</p>
                        {selectedMealDetails.strYoutube && (
                            <div className="video-container">
                                <h4>Video Instructions</h4>
                                <iframe
                                    width="560"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${selectedMealDetails.strYoutube.split('=')[1]}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                        <div ref={reviewsRef} style={{ marginTop: '20px' }}>
                            <h4>Reviews</h4>
                            {reviews.length > 0 ? (
                                <ul>
                                    {reviews.map((review, index) => (
                                        <li key={index} style={{ margin: '10px 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                {[...Array(5)].map((star, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            fontSize: '1rem',
                                                            color: i < review.rating ? "#ffc107" : "#e4e5e9",
                                                        }}
                                                    >
                                                        &#9733;
                                                    </span>
                                                ))}
                                            </div>
                                            <p>{review.text}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write your review here..."
                                rows="3"
                                style={{ width: '95%', padding: '10px', marginTop: '10px', resize: 'vertical' }}
                            ></textarea>
                            <button onClick={handleAddReview} style={{ marginTop: '10px' }}>Add Review</button>
                        </div>
                    </div>
                ) : (
                    <div className="search-results">
                        {filteredResults.length > 0 && (
                            <div className="recipe-grid">
                                {filteredResults.map((meal) => (
                                    <div key={meal.idMeal} className="recipe-card" onClick={() => handlePopupMealClick(meal.idMeal)}>
                                        <h3>{meal.strMeal}</h3>
                                        <img src={meal.strMealThumb} alt={meal.strMeal} />
                                    </div>
                                ))}
                            </div>
                        )}
                        {filteredResults.length === 0 && popupSearchResults.length > 0 && (
                            <div className="recipe-grid">
                                {popupSearchResults.map((meal) => (
                                    <div key={meal.idMeal} className="recipe-card" onClick={() => handlePopupMealClick(meal.idMeal)}>
                                        <h3>{meal.strMeal}</h3>
                                        <img src={meal.strMealThumb} alt={meal.strMeal} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipePopup;
