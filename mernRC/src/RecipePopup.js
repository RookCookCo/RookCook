import React, { useState } from 'react';

const RecipePopup = ({
    setShowPopup,
    selectedMealDetails,
    setSelectedMealDetails,
    popupSearchResults,
    handlePopupMealClick
}) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

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
                        }}>Back</button>
                        <h3>{selectedMealDetails.strMeal}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
                            </div>
                        </div>
                        <div style={{ margin: '10px 0' }}></div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '50px' }}>
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
