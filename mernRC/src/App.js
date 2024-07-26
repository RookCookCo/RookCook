import React, { useState, useEffect } from 'react';
import background from './background.png';
import './App.css';
import Header from './Header';
import IngredientPanel from './IngredientPanel';
import LoginPanel from './LoginPanel';
import SignUpPanel from './SignUpPanel';
import RecipePopup from './RecipePopup';
import { auth, provider, signInWithPopup, signOut } from './firebase';
import axios from 'axios';
import RecipeBookImage from './RecipeBook.png';

function App() {
    // State variables for UI panels, user inputs, and data
    const [showPanel, setShowPanel] = useState(false); // Show/hide ingredient panel
    const [panelMode, setPanelMode] = useState('add'); // Mode for ingredient panel (add/edit)
    const [inventory, setInventory] = useState([]); // User's ingredient inventory
    const [allIngredients, setAllIngredients] = useState([]); // All available ingredients from API
    const [selectedIngredient, setSelectedIngredient] = useState(''); // Currently selected ingredient
    const [searchQuery, setSearchQuery] = useState(''); // Search query for recipes
    const [searchResults, setSearchResults] = useState([]); // Search results for recipes
    const [showLogin, setShowLogin] = useState(false); // Show/hide login panel
    const [showSignUp, setShowSignUp] = useState(false); // Show/hide sign-up panel
    const [username, setUsername] = useState(''); // User's username
    const [email, setEmail] = useState(''); // User's email
    const [password, setPassword] = useState(''); // User's password
    const [confirmPassword, setConfirmPassword] = useState(''); // User's password confirmation
    const [user, setUser] = useState(null); // Currently logged-in user
    const [ingredientSearchQuery, setIngredientSearchQuery] = useState(''); // Search query for ingredients
    const [showIngredientList, setShowIngredientList] = useState(false); // Show/hide ingredient search list
    const [showPopup, setShowPopup] = useState(false); // Show/hide recipe popup
    const [popupSearchResults, setPopupSearchResults] = useState([]); // Search results for popup
    const [selectedMealDetails, setSelectedMealDetails] = useState(null); // Details of selected meal
    const [dietaryFilter, setDietaryFilter] = useState(''); // Dietary filter for recipe search
    const [ethnicFilter, setEthnicFilter] = useState(''); // Ethnic filter for recipe search

    // Fetch all available ingredients from API on component mount
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch('https://www.themealdb.com/api/json/v2/9973533/list.php?i=list');
                if (!response.ok) { // Check if response is ok
                    throw new Error('Network response was not ok');
                }
                const data = await response.json(); // Parse JSON data
                console.log('Fetched Ingredients:', data); // Debugging log
                if (data.meals) { // Check if meals data exists
                    const ingredients = data.meals.map(meal => meal.strIngredient); // Extract ingredient names
                    setAllIngredients(ingredients); // Set all ingredients
                    console.log('All Ingredients:', ingredients); // Debugging log
                }
            } catch (error) { // Handle fetch error
                console.error('Fetch Ingredients Error:', error);
            }
        };

        fetchIngredients(); // Call fetch function
    }, []); // Empty dependency array to run only once

    // Fetch recipes based on search query
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/search.php?s=${searchQuery}`);
                if (!response.ok) { // Check if response is ok
                    throw new Error('Network response was not ok');
                }
                const data = await response.json(); // Parse JSON data
                console.log('Fetched Recipes:', data); // Debugging log
                if (data.meals) { // Check if meals data exists
                    setSearchResults(data.meals); // Set search results
                }
            } catch (error) { // Handle fetch error
                console.error('Fetch Recipes Error:', error);
            }
        };

        fetchRecipes(); // Call fetch function
    }, [searchQuery]); // Dependency on searchQuery, re-run when it changes

    // Style for the app background
    const appStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '97vh',
    };

    // Add ingredient to inventory
    const handleAddIngredient = (ingredient) => {
        if (ingredient && !inventory.includes(ingredient)) { // Check if ingredient is valid and not already in inventory
            setInventory([...inventory, ingredient]); // Add to inventory
            setSelectedIngredient(''); // Clear selected ingredient
            setShowIngredientList(false); // Hide ingredient list
        }
    };

    // Remove ingredient from inventory
    const handleDeleteIngredient = (ingredient) => {
        setInventory(inventory.filter(item => item !== ingredient)); // Remove from inventory
    };

    // Handle recipe search form submission
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent form submission
        try {
            let apiUrl = `https://www.themealdb.com/api/json/v2/9973533/search.php?s=${searchQuery}`;

            // Build URLs for dietary and ethnic filters if present
            const dietaryFilterUrl = dietaryFilter ? `https://www.themealdb.com/api/json/v2/9973533/filter.php?c=${dietaryFilter}` : '';
            const ethnicFilterUrl = ethnicFilter ? `https://www.themealdb.com/api/json/v2/9973533/filter.php?a=${ethnicFilter}` : '';

            let dietaryResults = [];
            if (dietaryFilterUrl) { // Fetch dietary filter results
                const dietaryResponse = await fetch(dietaryFilterUrl);
                if (!dietaryResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const dietaryData = await dietaryResponse.json();
                dietaryResults = dietaryData.meals || []; // Set dietary results
            }

            let ethnicResults = [];
            if (ethnicFilterUrl) { // Fetch ethnic filter results
                const ethnicResponse = await fetch(ethnicFilterUrl);
                if (!ethnicResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const ethnicData = await ethnicResponse.json();
                ethnicResults = ethnicData.meals || []; // Set ethnic results
            }

            let finalResults = [];
            if (dietaryResults.length && ethnicResults.length) { // Combine results if both filters are present
                const dietaryIds = dietaryResults.map(meal => meal.idMeal);
                finalResults = ethnicResults.filter(meal => dietaryIds.includes(meal.idMeal));
            } else if (dietaryResults.length) { // Use dietary results if only dietary filter is present
                finalResults = dietaryResults;
            } else if (ethnicResults.length) { // Use ethnic results if only ethnic filter is present
                finalResults = ethnicResults;
            } else { // Fetch general search results if no filters are present
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                finalResults = data.meals || [];
            }

            setSearchResults(finalResults); // Set final search results
            setPopupSearchResults(finalResults); // Set popup search results
            setShowPopup(true); // Show popup
        } catch (error) {
            console.error('Search Error:', error);
        }
    };

    // Fetch meal details by ID
    const fetchMealDetails = async (id) => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=${id}`);
            if (!response.ok) { // Check if response is ok
                throw new Error('Network response was not ok');
            }
            const data = await response.json(); // Parse JSON data
            return data.meals ? data.meals[0] : null; // Return meal details
        } catch (error) { // Handle fetch error
            console.error('Fetch Meal Details Error:', error);
            return null;
        }
    };

    // Handle meal click in popup to fetch and display details
    const handlePopupMealClick = async (id) => {
        const mealDetails = await fetchMealDetails(id); // Fetch meal details
        setSelectedMealDetails(mealDetails); // Set selected meal details
        setShowPopup(true); // Show popup
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider); // Sign in with Google
            setUser(result.user); // Set user
        } catch (error) { // Handle sign-in error
            console.error('Error during sign-in:', error);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out
            setUser(null); // Clear user
        } catch (error) { // Handle sign-out error
            console.error('Error during sign-out:', error);
        }
    };

    // Generate recipe based on inventory ingredients
    const generateRecipe = async () => {
        try {
            let ingredientList = inventory.join(','); // Join inventory ingredients
            let response = await axios.get(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${ingredientList}`);
            let data = response.data.meals || []; // Fetch recipes based on ingredients

            if (data.length === 0) { // If no recipes found
                const userConfirmed = window.confirm("No recipes found with all ingredients. Would you like to see less specific recipes?");
                if (userConfirmed) { // If user agrees to see less specific recipes
                    let foundRecipes = new Map();

                    for (let i = inventory.length; i > 0; i--) { // Loop through all combinations of inventory ingredients
                        let combinations = getCombinations(inventory, i);
                        for (let combination of combinations) {
                            ingredientList = combination.join(',');
                            response = await axios.get(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${ingredientList}`);
                            data = response.data.meals || [];

                            data.forEach(meal => {
                                if (!foundRecipes.has(meal.idMeal)) { // Add recipe if not already in found recipes
                                    foundRecipes.set(meal.idMeal, meal);
                                }
                            });

                            if (foundRecipes.size > 0) break; // Break if recipes found
                        }
                        if (foundRecipes.size > 0) break; // Break if recipes found
                    }

                    setPopupSearchResults(Array.from(foundRecipes.values())); // Set popup search results
                }
            } else {
                setPopupSearchResults(data); // Set popup search results
            }

            setShowPopup(true); // Show popup
        } catch (error) { // Handle error
            console.error('Error generating recipe:', error);
        }
    };

    // Utility function to get all combinations of a given array
    const getCombinations = (array, length) => {
        const result = [];
        const f = (prefix, array) => {
            for (let i = 0; i < array.length; i++) {
                const newPrefix = prefix.concat(array[i]); // Create new prefix
                if (newPrefix.length === length) { // Check if prefix length matches required length
                    result.push(newPrefix); // Add to result
                } else {
                    f(newPrefix, array.slice(i + 1)); // Recur for remaining elements
                }
            }
        };
        f([], array); // Initialize recursion
        return result;
    };

    // Handle login form submission
    const handleLogin = (e) => {
        e.preventDefault(); // Prevent form submission
        console.log("Username:", username);
        console.log("Password:", password);
        setShowLogin(false); // Hide login panel
    };

    // Handle sign-up form submission
    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent form submission
        console.log("Email:", email);
        console.log("Username:", username);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);
        setShowSignUp(false); // Hide sign-up panel
    };

    // Handle clicks outside the ingredient search list to hide it
    const handleOutsideClick = (e) => {
        if (e.target.closest('.ingredient-search')) return; // Ignore clicks inside ingredient search
        setShowIngredientList(false); // Hide ingredient list
    };

    // Add event listener for outside clicks when ingredient list is shown
    useEffect(() => {
        if (showIngredientList) {
            document.addEventListener('click', handleOutsideClick);
        } else {
            document.removeEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [showIngredientList]);

    // Filter ingredients based on search query
    const filteredIngredients = allIngredients.filter(
        (ingredient) =>
            !inventory.includes(ingredient) && // Exclude already added ingredients
            ingredient.toLowerCase().startsWith(ingredientSearchQuery.toLowerCase()) // Match search query
    );
    console.log('Filtered Ingredients:', filteredIngredients); // Debugging log

    return (
        <div className="App" style={appStyle}>
            {/* Header component for top section including search and user actions */}
            <Header
                user={user}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                handleGoogleLogin={handleGoogleLogin}
                handleLogout={handleLogout}
                setShowLogin={setShowLogin}
                setShowSignUp={setShowSignUp}
                handlePopupMealClick={handlePopupMealClick}
                filteredRecipes={searchResults}
                setDietaryFilter={setDietaryFilter}
                setEthnicFilter={setEthnicFilter}
            />
            {/* Button to add new ingredient */}
            <button className="add-ingredient-button" onClick={() => { setShowPanel(true); setPanelMode('add'); }}>+</button>
            {/* Ingredient panel to manage ingredients */}
            {showPanel && (
                <IngredientPanel
                    panelMode={panelMode}
                    setShowPanel={setShowPanel}
                    setPanelMode={setPanelMode}
                    ingredientSearchQuery={ingredientSearchQuery}
                    setIngredientSearchQuery={setIngredientSearchQuery}
                    showIngredientList={showIngredientList}
                    setShowIngredientList={setShowIngredientList}
                    filteredIngredients={filteredIngredients}
                    selectedIngredient={selectedIngredient}
                    setSelectedIngredient={setSelectedIngredient}
                    handleAddIngredient={handleAddIngredient}
                    inventory={inventory}
                    handleDeleteIngredient={handleDeleteIngredient}
                />
            )}
            {/* Login panel for user login */}
            {showLogin && (
                <LoginPanel
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                    setShowLogin={setShowLogin}
                    handleGoogleLogin={handleGoogleLogin}
                />
            )}
            {/* Sign-up panel for new user registration */}
            {showSignUp && (
                <SignUpPanel
                    email={email}
                    setEmail={setEmail}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    handleSignUp={handleSignUp}
                    setShowSignUp={setShowSignUp}
                />
            )}
            {/* Button to generate recipes */}
            <button className="generate-recipe-button" onClick={generateRecipe}>
                <img src={RecipeBookImage} alt="Generate Recipes" style={{ width: '100%', height: '100%' }} />
            </button>
            {/* Popup for displaying recipe details */}
            {showPopup && (
                <RecipePopup
                    setShowPopup={setShowPopup}
                    selectedMealDetails={selectedMealDetails}
                    setSelectedMealDetails={setSelectedMealDetails}
                    popupSearchResults={popupSearchResults}
                    handlePopupMealClick={handlePopupMealClick}
                />
            )}
        </div>
    );
}

export default App;