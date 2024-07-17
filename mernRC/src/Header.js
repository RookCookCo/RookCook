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
                    filteredRecipes
                }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowDropdown(query.length > 0);
    };

    const handleRecipeClick = (id, name) => {
        setSearchQuery(name);
        setShowDropdown(false);
        handlePopupMealClick(id);
    };

    const filteredRecipesStart = filteredRecipes.filter(recipe =>
        recipe.strMeal.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

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
                    <button type="submit">Search</button>
                </form>
                {showDropdown && (
                    <div className="recipe-dropdown">
                        {filteredRecipesStart.length > 0 ? (
                            <ul>
                                {filteredRecipesStart.map((recipe) => (
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
