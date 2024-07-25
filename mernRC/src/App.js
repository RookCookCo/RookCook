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
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched Ingredients:', data); // Debugging log
                if (data.meals) {
                    const ingredients = data.meals.map(meal => meal.strIngredient); // Extract ingredient names
                    setAllIngredients(ingredients);
                    console.log('All Ingredients:', ingredients); // Debugging log
                }
            } catch (error) {
                console.error('Fetch Ingredients Error:', error);
            }
        };

        fetchIngredients();
    }, []);

    // Fetch recipes based on search query
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/search.php?s=${searchQuery}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched Recipes:', data); // Debugging log
                if (data.meals) {
                    setSearchResults(data.meals); // Set search results
                }
            } catch (error) {
                console.error('Fetch Recipes Error:', error);
            }
        };

        fetchRecipes();
    }, [searchQuery]);

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
        if (ingredient && !inventory.includes(ingredient)) {
            setInventory([...inventory, ingredient]);
            setSelectedIngredient('');
            setShowIngredientList(false);
        }
    };

    // Remove ingredient from inventory
    const handleDeleteIngredient = (ingredient) => {
        setInventory(inventory.filter(item => item !== ingredient));
    };

    // Handle recipe search form submission
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            let apiUrl = `https://www.themealdb.com/api/json/v2/9973533/search.php?s=${searchQuery}`;

            const dietaryFilterUrl = dietaryFilter ? `https://www.themealdb.com/api/json/v2/9973533/filter.php?c=${dietaryFilter}` : '';
            const ethnicFilterUrl = ethnicFilter ? `https://www.themealdb.com/api/json/v2/9973533/filter.php?a=${ethnicFilter}` : '';

            let dietaryResults = [];
            if (dietaryFilterUrl) {
                const dietaryResponse = await fetch(dietaryFilterUrl);
                if (!dietaryResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const dietaryData = await dietaryResponse.json();
                dietaryResults = dietaryData.meals || [];
            }

            let ethnicResults = [];
            if (ethnicFilterUrl) {
                const ethnicResponse = await fetch(ethnicFilterUrl);
                if (!ethnicResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const ethnicData = await ethnicResponse.json();
                ethnicResults = ethnicData.meals || [];
            }

            let finalResults = [];
            if (dietaryResults.length && ethnicResults.length) {
                const dietaryIds = dietaryResults.map(meal => meal.idMeal);
                finalResults = ethnicResults.filter(meal => dietaryIds.includes(meal.idMeal));
            } else if (dietaryResults.length) {
                finalResults = dietaryResults;
            } else if (ethnicResults.length) {
                finalResults = ethnicResults;
            } else {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                finalResults = data.meals || [];
            }

            setSearchResults(finalResults);
            setPopupSearchResults(finalResults);
            setShowPopup(true);
        } catch (error) {
            console.error('Search Error:', error);
        }
    };

    // Fetch meal details by ID
    const fetchMealDetails = async (id) => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error('Fetch Meal Details Error:', error);
            return null;
        }
    };

    // Handle meal click in popup to fetch and display details
    const handlePopupMealClick = async (id) => {
        const mealDetails = await fetchMealDetails(id);
        setSelectedMealDetails(mealDetails);
        setShowPopup(true);
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    };

    // Generate recipe based on inventory ingredients
    const generateRecipe = async () => {
        try {
            let ingredientList = inventory.join(',');
            let response = await axios.get(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${ingredientList}`);
            let data = response.data.meals || [];

            if (data.length === 0) {
                const userConfirmed = window.confirm("No recipes found with all ingredients. Would you like to see less specific recipes?");
                if (userConfirmed) {
                    let foundRecipes = new Map();

                    for (let i = inventory.length; i > 0; i--) {
                        let combinations = getCombinations(inventory, i);
                        for (let combination of combinations) {
                            ingredientList = combination.join(',');
                            response = await axios.get(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${ingredientList}`);
                            data = response.data.meals || [];

                            data.forEach(meal => {
                                if (!foundRecipes.has(meal.idMeal)) {
                                    foundRecipes.set(meal.idMeal, meal);
                                }
                            });

                            if (foundRecipes.size > 0) break;
                        }
                        if (foundRecipes.size > 0) break;
                    }

                    setPopupSearchResults(Array.from(foundRecipes.values()));
                }
            } else {
                setPopupSearchResults(data);
            }

            setShowPopup(true);
        } catch (error) {
            console.error('Error generating recipe:', error);
        }
    };

    // Utility function to get all combinations of a given array
    const getCombinations = (array, length) => {
        const result = [];
        const f = (prefix, array) => {
            for (let i = 0; i < array.length; i++) {
                const newPrefix = prefix.concat(array[i]);
                if (newPrefix.length === length) {
                    result.push(newPrefix);
                } else {
                    f(newPrefix, array.slice(i + 1));
                }
            }
        };
        f([], array);
        return result;
    };

    // Handle login form submission
    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
        setShowLogin(false);
    };

    // Handle sign-up form submission
    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Username:", username);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);
        setShowSignUp(false);
    };

    // Handle clicks outside the ingredient search list to hide it
    const handleOutsideClick = (e) => {
        if (e.target.closest('.ingredient-search')) return;
        setShowIngredientList(false);
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
            !inventory.includes(ingredient) &&
            ingredient.toLowerCase().startsWith(ingredientSearchQuery.toLowerCase())
    );
    console.log('Filtered Ingredients:', filteredIngredients); // Debugging log

    return (
        <div className="App" style={appStyle}>
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
                filteredRecipes={searchResults} // Pass search results to Header
                setDietaryFilter={setDietaryFilter}
                setEthnicFilter={setEthnicFilter}
            />
            <button className="add-ingredient-button" onClick={() => { setShowPanel(true); setPanelMode('add'); }}>+</button>
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
            <button className="generate-recipe-button" onClick={generateRecipe}>
                <img src={RecipeBookImage} alt="Generate Recipes" style={{ width: '100%', height: '100%' }} />
            </button>
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
