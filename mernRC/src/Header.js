import React, { useState, useEffect } from 'react';

const Header = ({
    user,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleGoogleLogin,
    handleLogout,
    setShowLogin,
    setShowSignUp,
    handlePopupMealClick
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredSearchResults, setFilteredSearchResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        // Fetch categories
        fetch('https://www.themealdb.com/api/json/v2/9973533/categories.php')
            .then(response => response.json())
            .then(data => setCategories(data.categories));

        // Fetch areas
        fetch('https://www.themealdb.com/api/json/v2/9973533/list.php?a=list')
            .then(response => response.json())
            .then(data => setAreas(data.meals));
    }, []);

    useEffect(() => {
        // Build URL for search
        const url = `https://www.themealdb.com/api/json/v2/9973533/search.php?s=${searchQuery}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setFilteredSearchResults(data.meals || []);
            });
    }, [searchQuery]);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setShowDropdown(true);
    };

    const handleRecipeClick = (id, name) => {
        setSearchQuery(name);
        setShowDropdown(false);
        handlePopupMealClick(id);
    };

    const handleInputFocus = () => {
        setShowDropdown(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => setShowDropdown(false), 100);
    };

    return (
       <header className="App-header">
        <div className="search-box">
            <img src="logo.png" alt="RookCook Logo" title="RookCook" className="site-logo" />
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <label htmlFor="search" style={{ marginRight: '10px' }}>Quick Recipe Search:</label>
                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <input
                        type="text"
                        title="Enter Recipe or Ingredient"
                        id="search"
                        name="search"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        style={{ width: 250, paddingLeft: '10px', marginRight: '5px' }} // Adjust width to accommodate button
                    />
                <button type="submit" title="Search" style={{ cursor: 'pointer' }}>Search</button>
                </div>
            </form>

            {showDropdown && (
                <div className="recipe-dropdown">
                    {filteredSearchResults.length > 0 ? (
                        <ul>
                            {filteredSearchResults.map((recipe) => (
                                <li
                                    key={recipe.idMeal}
                                    onClick={() => handleRecipeClick(recipe.idMeal, recipe.strMeal)}
                                >
                                    {recipe.strMeal}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>No recipes found</div>
                    )}
                </div>
            )}
        </div>
        <div className="auth-buttons">
            {user ? (
                <>
                    <span>{user.displayName}</span>
                </>
            ) : (
                <>
                    <button onClick={() => setShowLogin(true)} title="Login">Login</button>
                    <button onClick={() => setShowSignUp(true)} title="Sign Up">Sign up</button>
                </>
            )}
        </div>
    </header>

    );
};

export default Header;
