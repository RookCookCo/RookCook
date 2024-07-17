import React from 'react';

const RecipePopup = ({
                         setShowPopup,
                         selectedMealDetails,
                         setSelectedMealDetails,
                         popupSearchResults,
                         handlePopupMealClick
                     }) => {
    return (
        <div className="popup">
            <button className="exit-button" onClick={() => setShowPopup(false)}>X</button>
            <h2>Generated Recipe</h2>
            <div className="popup-content">
                {selectedMealDetails ? (
                    <div className="meal-details-popup">
                        <button onClick={() => setSelectedMealDetails(null)}>Back</button>
                        <h3>{selectedMealDetails.strMeal}</h3>
                        <img src={selectedMealDetails.strMealThumb} alt={selectedMealDetails.strMeal} />
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
            <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
    );
};

export default RecipePopup;
