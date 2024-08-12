import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';

// Utility function to fetch data from an API endpoint
const fetchFromApi = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

// RecipePopup component that displays recipes, filters, and reviews
const RecipePopup = ({
                         showPopup,// Show/hide recipe popup
                         setShowPopup, // Function to control the visibility of the popup
                         selectedMealDetails, // Details of the currently selected meal
                         setSelectedMealDetails, // Function to update the selected meal details
                         popupSearchResults, // List of search results to be displayed in the popup
                         handlePopupMealClick // Function to handle meal selection from search results
                     }) => {
    const [rating, setRating] = useState(0); // State for storing the current rating
    const [hover, setHover] = useState(0); // State for storing the hover state over the rating stars
    const [reviews, setReviews] = useState([]); // State for storing the list of reviews
    const [reviewText, setReviewText] = useState(''); // State for storing the text of the current review
    const [filtersVisible, setFiltersVisible] = useState(false); // State to toggle the visibility of filters
    const [categories, setCategories] = useState([]); // State for storing meal categories
    const [areas, setAreas] = useState([]); // State for storing meal areas (regions)
    const [ingredients, setIngredients] = useState([]); // State for storing meal ingredients
    const [selectedCategory, setSelectedCategory] = useState(''); // State for the selected category filter
    const [selectedArea, setSelectedArea] = useState(''); // State for the selected area filter
    const [selectedIngredient, setSelectedIngredient] = useState(''); // State for the selected ingredient filter
    const [filteredResults, setFilteredResults] = useState([]); // State for storing filtered search results
    const reviewsRef = useRef(null); // Reference to the reviews section for scrolling

    // Fetch filter data (categories, areas, ingredients) when the component mounts
    useEffect(() => {
        const fetchFilterData = async () => {
            const categoriesData = await fetchFromApi('https://www.themealdb.com/api/json/v2/9973533/categories.php');
            const areasData = await fetchFromApi('https://www.themealdb.com/api/json/v2/9973533/list.php?a=list');
            const ingredientsData = await fetchFromApi('https://www.themealdb.com/api/json/v2/9973533/list.php?i=list');
            //console.log("Current reviews:", reviews);
            setCategories(categoriesData.categories);
            setAreas(areasData.meals);
            setIngredients(ingredientsData.meals);
        };

        fetchFilterData();
        // operate load the comment 
        // load the detail from the backend

        if (selectedMealDetails) {
        console.log("Selected meal details are displayed:", selectedMealDetails);

        // Fetch comments/reviews for the selected meal from the backend
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/recipes/${selectedMealDetails.idMeal}/comments`);
                setReviews(response.data); // Assuming the response is an array of comments
            } catch (error) {
                console.error('Error loading comments:', error);
            }
        };

        fetchReviews();
    } else {
        console.log("closed");
    }



    }, [selectedMealDetails]);

    // Function to handle adding a comment to a specific recipe only use to communicate with backend
    const handleAddComment = async (recipeId, rating, text) => {
        try {
            // Send the review to the backend
            const response = await axios.post(`http://localhost:5001/recipes/${recipeId}/comments`, {
                text: text,
                rating: rating
            });

            return response.data; // Return the updated list of comments
        } catch (error) {
            console.error('Error adding review:', error);
            throw error; // Rethrow the error so it can be handled by the calling function
            }
        };
    // Handle adding a review
    const handleAddReview = () => {
        if (reviewText.trim() !== '') {
            setReviews([...reviews, { rating, text: reviewText }]); // Add new review to the list
            try {
            // call the backend handel to add comments
            handleAddComment(selectedMealDetails.idMeal, rating, reviewText);
            } catch (error) {
            console.error('Failed to add review:', error);
            // Optionally handle the error by showing a message to the user
            }

            setReviewText(''); // Clear the review text field
            setRating(0); // Reset the rating
            setHover(0); // Reset the hover state

        }
        console.log("Selected meal details are displayed:", rating, reviewText);
        console.log("Selected meal details are displayed:", reviews);
        // put it into the backened
    };

    // Calculate the average rating using useMemo to optimize performance
    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return parseFloat((totalRating / reviews.length).toFixed(1));
    }, [reviews]);

    // Scroll to the reviews section when called
    const scrollToReviews = () => {
        reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch meals based on the selected filters (category, area, ingredient)
    useEffect(() => {
        const fetchFilteredMeals = async () => {
            let categoryMeals = [];
            let areaMeals = [];
            let ingredientMeals = [];
            let combinedMeals = [];

            // Fetch meals for selected category
            if (selectedCategory) {
                const categoryData = await fetchFromApi(`https://www.themealdb.com/api/json/v2/9973533/filter.php?c=${selectedCategory}`);
                categoryMeals = categoryData.meals || [];
            }

            // Fetch meals for selected area
            if (selectedArea) {
                const areaData = await fetchFromApi(`https://www.themealdb.com/api/json/v2/9973533/filter.php?a=${selectedArea}`);
                areaMeals = areaData.meals || [];
            }

            // Fetch meals for selected ingredient
            if (selectedIngredient) {
                const ingredientData = await fetchFromApi(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${selectedIngredient}`);
                ingredientMeals = ingredientData.meals || [];
            }

            // Combine results based on selected filters
            if (selectedCategory && selectedArea && selectedIngredient) {
                combinedMeals = categoryMeals.filter(meal =>
                    areaMeals.some(areaMeal => areaMeal.idMeal === meal.idMeal) &&
                    ingredientMeals.some(ingredientMeal => ingredientMeal.idMeal === meal.idMeal)
                );
            } else if (selectedCategory && selectedArea) {
                combinedMeals = categoryMeals.filter(meal =>
                    areaMeals.some(areaMeal => areaMeal.idMeal === meal.idMeal)
                );
            } else if (selectedCategory && selectedIngredient) {
                combinedMeals = categoryMeals.filter(meal =>
                    ingredientMeals.some(ingredientMeal => ingredientMeal.idMeal === meal.idMeal)
                );
            } else if (selectedArea && selectedIngredient) {
                combinedMeals = areaMeals.filter(meal =>
                    ingredientMeals.some(ingredientMeal => ingredientMeal.idMeal === meal.idMeal)
                );
            } else {
                combinedMeals = categoryMeals.concat(areaMeals, ingredientMeals);
            }

            setFilteredResults(combinedMeals); // Update the state with filtered results
        };

        fetchFilteredMeals();
    }, [selectedCategory, selectedArea, selectedIngredient]);

    // Function to reset all filters and clear the filtered results
    const resetFilters = () => {
        setSelectedCategory('');
        setSelectedArea('');
        setSelectedIngredient('');
        setFilteredResults([]); // Clear the filtered results
    };

    return (
        <div className="popup">
            {/* Button to close the popup */}
            <button className="exit-button" onClick={() => setShowPopup(false)}>X</button>
            <h2>Recipes</h2>
            {/* Button to toggle filter visibility */}
            {!selectedMealDetails && (
                <button
                    className="show-filters-button"
                    onClick={() => setFiltersVisible(!filtersVisible)}
                    style={{ marginBottom: '20px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px' }}
                >
                    {filtersVisible ? 'Hide Filters' : 'Show Filters'}
                </button>
            )}
            {/* Filter section for selecting categories, areas, and ingredients */}
            {filtersVisible && !selectedMealDetails && (
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
                {/* Display selected meal details if available */}
                {selectedMealDetails ? (
                    <div className="meal-details-popup">
                        <button onClick={() => {
                            setSelectedMealDetails(null); // Clear selected meal details
                            setRating(0); // Reset rating
                            setHover(0); // Reset hover state
                        }}>Back</button>
                        <h3>{selectedMealDetails.strMeal}</h3>
                        {/* Display the average rating with stars */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {[...Array(5)].map((star, index) => {
                                    index += 1;
                                    const fullStar = '\u2605'; // Unicode for solid star

                                    // Determine whether to display a full, half, or empty star
                                    let starColor = "#e4e5e9"; // Default color for empty star
                                    let isHalfStar = false;

                                    if (index <= Math.floor(averageRating)) {
                                        starColor = "#ffc107"; // Full star color
                                    } else if (index === Math.ceil(averageRating) && averageRating % 1 !== 0) {
                                        starColor = "#e4e5e9"; // Half star color
                                        isHalfStar = true;
                                    }

                                    return (
                                        <span
                                            key={index}
                                            style={{
                                                fontSize: '1.5rem',
                                                color: starColor,
                                                position: 'relative',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {/* Full star */}
                                            <span>
                                                {fullStar}
                                            </span>
                                            {/* Half star */}
                                            {isHalfStar && (
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '50%',
                                                        overflow: 'hidden',
                                                        color: '#ffc107',
                                                        fontSize: '1.5rem',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    {fullStar}
                                                </span>
                                            )}
                                        </span>
                                    );
                                })}
                                {/* Link to scroll to the reviews section */}
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
                        {/* Embed YouTube video if available */}
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
                        {/* Reviews section */}
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
                            {/* Input for adding a new review */}
                            <div style={{ display: 'flex', alignItems: 'marginLeft', justifyContent: 'marginLeft' }}>
                                <div style={{ display: 'flex', alignItems: 'marginLeft', gap: '10px' }}>
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
                        {/* Display filtered results if available */}
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
                        {/* Display popup search results if no filtered results */}
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
