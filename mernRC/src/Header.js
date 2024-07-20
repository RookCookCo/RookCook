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
                    handlePopupMealClick,
                    filteredRecipes,
                    setDietaryFilter,
                    setEthnicFilter
                }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredSearchResults, setFilteredSearchResults] = useState([]);

    useEffect(() => {
        const filtered = filteredRecipes.filter(recipe =>
            recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSearchResults(filtered);
        setShowDropdown(filtered.length > 0);
    }, [searchQuery, filteredRecipes]);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRecipeClick = (id, name) => {
        setSearchQuery(name);
        setShowDropdown(false);
        handlePopupMealClick(id);
    };

    return (
        <header className="App-header">
            <div className="search-box">
                <img src="logo.png" alt="RookCook Logo" className="site-logo" />
                <form onSubmit={handleSearch}>
                    <label htmlFor="search">Quick recipe search: </label>
                    <input
                        type="text"
                        id="search"
                        name="search"
                        value={searchQuery}
                        onChange={handleInputChange}
                    />
                    <select onChange={(e) => setDietaryFilter(e.target.value)}>
                        <option value="">All Diets</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Gluten-Free">Gluten-Free</option>
                        {/* Add more dietary options as needed */}
                    </select>
                    <select onChange={(e) => setEthnicFilter(e.target.value)}>
                        <option value="">All Cuisines</option>
                        <option value="Canadian">Canadian</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Italian">Italian</option>
                        <option value="Mexican">Mexican</option>
                        {/* Add more cuisine options as needed */}
                    </select>
                    <button type="submit">Search</button>
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
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setShowLogin(true)}>Login</button>
                        <button onClick={() => setShowSignUp(true)}>Sign up</button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
