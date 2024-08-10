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
    // State to manage dropdown visibility, filtered search results, categories, and areas
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredSearchResults, setFilteredSearchResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        // Fetch categories from API and update state
        fetch('https://www.themealdb.com/api/json/v2/9973533/categories.php')
            .then(response => response.json())
            .then(data => setCategories(data.categories));

        // Fetch areas from API and update state
        fetch('https://www.themealdb.com/api/json/v2/9973533/list.php?a=list')
            .then(response => response.json())
            .then(data => setAreas(data.meals));
    }, []);

    useEffect(() => {
        // Construct the search URL based on the current search query
        const url = `https://www.themealdb.com/api/json/v2/9973533/search.php?s=${searchQuery}`;

        // Fetch search results from the API and update the filtered search results
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setFilteredSearchResults(data.meals || []);
            });
    }, [searchQuery]);

    // Handle the change in the input field and show the dropdown with results
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setShowDropdown(true);
    };

    // Handle clicking on a recipe from the dropdown
    const handleRecipeClick = (id, name) => {
        setSearchQuery(name);
        setShowDropdown(false);
        handlePopupMealClick(id);
    };

    // Show dropdown when the input field is focused
    const handleInputFocus = () => {
        setShowDropdown(true);
    };

    // Hide dropdown with a slight delay when the input field loses focus
    const handleInputBlur = () => {
        setTimeout(() => setShowDropdown(false), 100);
    };

    return (
        <header className="App-header">
            <div className="search-box">
                {/* Logo and title for the site */}
                <img src="logo.png" alt="RookCook Logo" title="RookCook" className="site-logo" />

                {/* Search form */}
                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <label htmlFor="search" style={{ marginRight: '10px' }}>Quick Recipe Search:</label>
                    <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        {/* Input field for entering the search query */}
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
                        {/* Search button */}
                        <button type="submit" title="Search" style={{ cursor: 'pointer' }}>Search</button>
                    </div>
                </form>

                {/* Dropdown showing search results */}
                {showDropdown && (
                    <div className="recipe-dropdown">
                        {filteredSearchResults.length > 0 ? (
                            <ul>
                                {/* Display each search result */}
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
            
            {/* Authentication buttons */}
            <div className="auth-buttons">
                {user ? (
                    <>
                        {/* If the user is logged in, show logout button and user-specific options */}
                    </>
                ) : (
                    <>
                        {/* If the user is not logged in, show login and sign-up buttons */}
                        <button onClick={() => setShowLogin(true)} title="Login">Login</button>
                        <button onClick={() => setShowSignUp(true)} title="Sign Up">Sign up</button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
