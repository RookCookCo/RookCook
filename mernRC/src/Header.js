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
    setDietaryFilter,
    setEthnicFilter
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredSearchResults, setFilteredSearchResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [dietaryFilter, setDietaryFilterLocal] = useState('');
    const [ethnicFilter, setEthnicFilterLocal] = useState('');

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
        // Build URL with filters
        let url = 'https://www.themealdb.com/api/json/v2/9973533/filter.php?';

        if (dietaryFilter) {
            url += `c=${dietaryFilter}&`;
        }
        if (ethnicFilter) {
            url += `a=${ethnicFilter}&`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Filter recipes based on search query
                let filteredResults = data.meals || [];
                if (searchQuery) {
                    filteredResults = filteredResults.filter(meal =>
                        meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }
                setFilteredSearchResults(filteredResults);
            });
    }, [dietaryFilter, ethnicFilter, searchQuery]);

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
                <img src="logo.png" alt="RookCook Logo" className="site-logo" />
                <form onSubmit={handleSearch}>
                    <label htmlFor="search">Quick recipe search: </label>
                    <input
                        type="text"
                        id="search"
                        name="search"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                    />
                    <select onChange={(e) => {
                        setDietaryFilterLocal(e.target.value);
                        setDietaryFilter(e.target.value);
                    }}>
                        <option value="">All Diets</option>
                        {categories.map(category => (
                            <option key={category.strCategory} value={category.strCategory}>
                                {category.strCategory}
                            </option>
                        ))}
                    </select>
                    <select onChange={(e) => {
                        setEthnicFilterLocal(e.target.value);
                        setEthnicFilter(e.target.value);
                    }}>
                        <option value="">All Cuisines</option>
                        {areas.map(area => (
                            <option key={area.strArea} value={area.strArea}>
                                {area.strArea}
                            </option>
                        ))}
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
