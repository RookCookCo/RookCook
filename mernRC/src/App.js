import React, { useState, useEffect } from 'react';
import background from './background.png';
import logo from './logo.png';
import './App.css';

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
                setAllIngredients([...ingredientsSet]);
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

    const handleAddIngredient = () => {
        if (selectedIngredient && !inventory.includes(selectedIngredient)) {
            setInventory([...inventory, selectedIngredient]);
            setSelectedIngredient('');
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

    const handleLogin = (e) => {
        e.preventDefault();
        // Add login logic here
        console.log("Username:", username);
        console.log("Password:", password);
        setShowLogin(false); // Close login panel after login attempt
    };

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
                    <button onClick={() => setShowLogin(true)}>Login</button>
                    <button>Sign up</button>
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
                        <div className="add-section">
                            <select value={selectedIngredient} onChange={(e) => setSelectedIngredient(e.target.value)}>
                                <option value="">Select Ingredient</option>
                                {allIngredients.filter(ingredient => !inventory.includes(ingredient)).map((ingredient) => (
                                    <option key={ingredient} value={ingredient}>{ingredient}</option>
                                ))}
                            </select>
                            <button onClick={handleAddIngredient}>Add to Inventory</button>
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
                        <button type="submit" className="login-confirm-button">Login</button>
                    </form>
                </div>
            )}
            <div className="search-results">
                {searchResults.map((meal) => (
                    <div key={meal.idMeal} onClick={() => handleMealClick(meal.idMeal)}>
                        <h3>{meal.strMeal}</h3>
                        <img src={meal.strMealThumb} alt={meal.strMeal} />
                    </div>
                ))}
            </div>
            {mealDetails && (
                <div className="meal-details">
                    <h2>{mealDetails.strMeal}</h2>
                    <img src={mealDetails.strMealThumb} alt={mealDetails.strMeal} />
                    <h3>Ingredients</h3>
                    <ul>
                        {Array.from({ length: 20 }, (_, i) => mealDetails[`strIngredient${i + 1}`])
                            .filter(ingredient => ingredient)
                            .map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                    </ul>
                    <h3>Instructions</h3>
                    <p>{mealDetails.strInstructions}</p>
                </div>
            )}
        </div>
    );
}

export default App;
