import React, { useState, useRef } from 'react';

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
    const reviewsRef = useRef(null);

    const handleAddReview = () => {
        if (reviewText.trim() !== '') {
            setReviews([...reviews, { rating, text: reviewText }]);
            setReviewText('');
            setRating(0);
            setHover(0);
        }
    };

    const scrollToReviews = () => {
        reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="popup">
            <button className="exit-button" onClick={() => setShowPopup(false)}>X</button>
            <h2>Recipes</h2>
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
                        {popupSearchResults.length > 0 && (
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
