import React, { useState, useEffect } from 'react';
import background from './background.png';
import logo from './logo.png';
import './App.css';
import { auth, provider, signInWithPopup, signOut } from './firebase';
import axios from 'axios';

function App() {
    const [showPanel, setShowPanel] = useState(false);
    const [panelMode, setPanelMode] = useState('add'); // 'add' or 'edit'
    const [inventory, setInventory] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [mealDetails, setMealDetails] = useState(null);
    const [showLogin, setShowLogin] = useState(false); // New state for login panel
    const [showSignUp, setShowSignUp] = useState(false); // New state for sign-up panel
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // New state for email
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [user, setUser] = useState(null); // User state
    const [ingredientSearchQuery, setIngredientSearchQuery] = useState(''); // New state for ingredient search
    const [showIngredientList, setShowIngredientList] = useState(false); // New state to show/hide ingredient list


    useEffect(() => {
        const fetchIngredients = async () => {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood');
            const data = await response.json();
            if (data.meals) {
                const ingredientsSet = new Set();
                for (let meal of data.meals) {
                    const mealDetailsResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
                    const mealDetails = await mealDetailsResponse.json();
                    if (mealDetails.meals) {
                        const mealDetail = mealDetails.meals[0];
                        for (let i = 1; i <= 20; i++) {
                            const ingredient = mealDetail[`strIngredient${i}`];
                            if (ingredient) {
                                ingredientsSet.add(ingredient);
                            }
                        }
                    }
                }
                // Convert set to array and sort alphabetically
                const sortedIngredients = Array.from(ingredientsSet).sort((a, b) => a.localeCompare(b));
                setAllIngredients(sortedIngredients);
            }
        };

        fetchIngredients();
    }, []);

    const appStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: '100%', // or 'cover'
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
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
        const data = await response.json();
        setSearchResults(data.meals || []);
    };

    const handleMealClick = async (id) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        setMealDetails(data.meals[0]);
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
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${inventory.join(',')}`);
            setSearchResults(response.data.meals || []);
        } catch (error) {
            console.error('Error generating recipe:', error);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
        setShowLogin(false); // Close login panel after login attempt
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Username:", username);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);
        setShowSignUp(false); // Close sign-up panel after sign-up attempt
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

    return (
        <div className="App" style={appStyle}>
            <header className="App-header">
                <div className="search-box">
                    <img src={logo} alt="RookCook Logo" className="site-logo" />
                    <form onSubmit={handleSearch}>
                        <label htmlFor="search">Quick recipe search: </label>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>
                <div className="auth-buttons">
                    {user ? (
                        <>
                            <span>{user.displayName}</span>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setShowLogin(true)}>Login</button>
                            <button onClick={() => setShowSignUp(true)}>Sign up</button> {/* Opens sign-up panel */}
                        </>
                    )}
                </div>
            </header>
            <button className="add-ingredient-button" onClick={() => { setShowPanel(true); setPanelMode('add'); }}>+</button>
            {showPanel && (
                <div className="ingredient-panel">
                    <div className="panel-header">
                        <button onClick={() => setShowPanel(false)}>Close</button>
                        <button onClick={() => setPanelMode('add')}>Add</button>
                        <button onClick={() => setPanelMode('edit')}>Edit</button>
                    </div>
                    {panelMode === 'add' && (
                        <div className="add-section ingredient-search">
                        <input
                            type="text"
                            placeholder="Search for an ingredient..."
                            value={ingredientSearchQuery}
                            onClick={() => setShowIngredientList(true)}
                            onChange={(e) => setIngredientSearchQuery(e.target.value)}
                            style={{ width: '152px' }} // Adjust the width value as per your requirement
                        />
                        {showIngredientList && filteredIngredients.length > 0 && (
                            <select
                                size={Math.min(10, filteredIngredients.length)}
                                value={selectedIngredient}
                                onChange={(e) => {
                                    setSelectedIngredient(e.target.value);
                                    handleAddIngredient(e.target.value);
                                }}
                                onClick={(e) => {
                                    if (e.target.tagName === 'OPTION') {
                                        handleAddIngredient(e.target.value);
                                    }
                                }}
                                style={{ height: 'auto', maxHeight: '200px', overflowY: 'auto' }} // Adjust the height dynamically
                            >
                                {filteredIngredients.map((ingredient, index) => (
                                    <option key={index} value={ingredient}>
                                        {ingredient}
                                    </option>
                                ))}
                            </select>
                            )}
                        </div>
                    )}
                    <div className="inventory-list">
                        <h3>Inventory</h3>
                        <ul>
                            {inventory.map((ingredient) => (
                                <li key={ingredient}>
                                    {ingredient}
                                    {panelMode === 'edit' && (
                                        <button onClick={() => handleDeleteIngredient(ingredient)}>Delete</button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {showLogin && (
                <div className="login-panel">
                    <div className="panel-header">
                        <button onClick={() => setShowLogin(false)}>Close</button>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="login-field">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="login-links">
                            <button type="button" className="link-button">Forget Username?</button>
                            <button type="button" className="link-button">Forget Password?</button>
                        </div>
                        <div className="login-google">
                            <button type="button" onClick={handleGoogleLogin}>Sign in with Google</button>
                        </div>
                        <button type="submit" className="login-confirm-button">Login</button>
                    </form>
                </div>
            )}
            {showSignUp && (
                <div className="login-panel"> {/* Reuse className for styling */}
                    <div className="panel-header">
                        <button onClick={() => setShowSignUp(false)}>Close</button>

                    </div>
                    <form onSubmit={handleSignUp}>
                        <div className="login-field">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-confirm-button">Sign Up</button>
                    </form>
                </div>
            )}
            <div className="search-results">
                {searchResults.map((meal) => (
                    <div key={meal.idMeal} onClick={() => handleMealClick(meal.idMeal)}>
                        <h3>{meal.strMeal}</h3>
                        <img src={meal.strMealThumb} alt={meal.strMeal} />
                    </div>
                    <form onSubmit={handleSignUp}>
                        <div className="login-field">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-confirm-button">Sign Up</button>
                    </form>
                </div>
            )}
            <div className="search-results">
                {searchResults.length > 0 ? (
                    searchResults.map((meal) => (
                        <div key={meal.idMeal} onClick={() => handleMealClick(meal.idMeal)}>
                            <h3>{meal.strMeal}</h3>
                            <img src={meal.strMealThumb} alt={meal.strMeal} />
                        </div>
                    ))
                ) : (
                    <p>No recipes found.</p>
                )}
            </div>
            {mealDetails && (
                <div className="meal-details">
                    <h2>{mealDetails.strMeal}</h2>
                    <img src={mealDetails.strMealThumb} alt={mealDetails.strMeal} />
                    <h3>Ingredients</h3>
                    <ul>
                    {Array.from({ length: 20 }).map((_, i) => {
                        {Array.from({ length: 20 }).map((_, i) => {

                            const ingredient = mealDetails[`strIngredient${i + 1}`];
                            const measure = mealDetails[`strMeasure${i + 1}`];
                            return ingredient ? (
                                <li key={i}>{ingredient} - {measure}</li>
                            ) : null;
                        })}
                    </ul>
                    <h3>Instructions</h3>
                    <p>{mealDetails.strInstructions}</p>
                </div>
            )}
            <button className="generate-recipe-button" onClick={generateRecipe}>Generate Recipe</button>
        </div>
    );
}

export default App;