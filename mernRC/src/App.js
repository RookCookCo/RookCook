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

function App() {
    const [showPanel, setShowPanel] = useState(false);
    const [panelMode, setPanelMode] = useState('add');
    const [inventory, setInventory] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState(null);
    const [ingredientSearchQuery, setIngredientSearchQuery] = useState('');
    const [showIngredientList, setShowIngredientList] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupSearchResults, setPopupSearchResults] = useState([]);
    const [selectedMealDetails, setSelectedMealDetails] = useState(null);
    const [dietaryFilter, setDietaryFilter] = useState('');
    const [ethnicFilter, setEthnicFilter] = useState('');

    useEffect(() => {
        const fetchIngredients = async () => {
            const response = await fetch('https://www.themealdb.com/api/json/v2/9973533/list.php?i=list');
            const data = await response.json();
            console.log('Fetched Ingredients:', data); // Debugging log
            if (data.meals) {
                const ingredients = data.meals.map(meal => meal.strIngredient); // Extract ingredient names
                setAllIngredients(ingredients);
                console.log('All Ingredients:', ingredients); // Debugging log
            }
        };

        fetchIngredients();
    }, []);

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/search.php?s=${searchQuery}`);
            const data = await response.json();
            console.log('Fetched Recipes:', data); // Debugging log
            if (data.meals) {
                setSearchResults(data.meals); // Set search results
            }
        };

        fetchRecipes();
    }, [searchQuery]);

    const appStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '97vh',
    };

    const handleAddIngredient = (ingredient) => {
        if (ingredient && !inventory.includes(ingredient)) {
            setInventory([...inventory, ingredient]);
            setSelectedIngredient('');
            setShowIngredientList(false);
        }
    };

    const handleDeleteIngredient = (ingredient) => {
        setInventory(inventory.filter(item => item !== ingredient));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        let apiUrl = `https://www.themealdb.com/api/json/v2/9973533/search.php?s=${searchQuery}`;

        const dietaryFilterUrl = dietaryFilter ? `https://www.themealdb.com/api/json/v2/9973533/filter.php?c=${dietaryFilter}` : '';
        const ethnicFilterUrl = ethnicFilter ? `https://www.themealdb.com/api/json/v2/9973533/filter.php?a=${ethnicFilter}` : '';

        let dietaryResults = [];
        if (dietaryFilterUrl) {
            const dietaryResponse = await fetch(dietaryFilterUrl);
            const dietaryData = await dietaryResponse.json();
            dietaryResults = dietaryData.meals || [];
        }

        let ethnicResults = [];
        if (ethnicFilterUrl) {
            const ethnicResponse = await fetch(ethnicFilterUrl);
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
            const data = await response.json();
            finalResults = data.meals || [];
        }

        setSearchResults(finalResults);
        setPopupSearchResults(finalResults);
        setShowPopup(true);
    };

    const fetchMealDetails = async (id) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    };

    const handlePopupMealClick = async (id) => {
        const mealDetails = await fetchMealDetails(id);
        setSelectedMealDetails(mealDetails);
        setShowPopup(true);
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    };

    const generateRecipe = async () => {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${inventory.join(',')}`);
            const data = response.data.meals || [];

            const allRecipesDetails = await Promise.all(data.map(async (meal) => {
                const details = await fetchMealDetails(meal.idMeal);
                return details;
            }));

            const filteredRecipes = allRecipesDetails.filter((recipe) => {
                const ingredients = [];
                for (let i = 1; i <= 20; i++) {
                    if (recipe[`strIngredient${i}`]) {
                        ingredients.push(recipe[`strIngredient${i}`].toLowerCase());
                    }
                }
                return ingredients.every(ingredient => inventory.includes(ingredient));
            });

            setPopupSearchResults(filteredRecipes);
            setShowPopup(true);
        } catch (error) {
            console.error('Error generating recipe:', error);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
        setShowLogin(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Username:", username);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);
        setShowSignUp(false);
    };

    const handleOutsideClick = (e) => {
        if (e.target.closest('.ingredient-search')) return;
        setShowIngredientList(false);
    };

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
            <button className="generate-recipe-button" onClick={generateRecipe}>Generate Recipe</button>
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
