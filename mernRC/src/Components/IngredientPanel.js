import React, { useState } from 'react';

// IngredientPanel component definition
const IngredientPanel = ({
    panelMode, // Mode of the panel (add/edit)
    setShowPanel, // Function to toggle visibility of the panel
    setPanelMode, // Function to set the panel mode (add/edit)
    ingredientSearchQuery, // Query string for ingredient search
    setIngredientSearchQuery, // Function to update the search query
    showIngredientList, // Boolean to show or hide the ingredient list
    setShowIngredientList, // Function to toggle visibility of the ingredient list
    filteredIngredients, // Array of filtered ingredients based on the search query
    selectedIngredient, // The currently selected ingredient
    setSelectedIngredient, // Function to update the selected ingredient
    handleAddIngredient, // Function to add an ingredient to the inventory
    inventory, // Array of ingredients in the inventory
    handleDeleteIngredient // Function to delete an ingredient from the inventory
}) => {
    // State to manage the visibility of the PreferencesPanel
    const [showPreferencesPanel, setShowPreferencesPanel] = useState(false);

    // Debugging logs to check the filtered ingredients and the ingredient list visibility
    console.log('Filtered Ingredients:', filteredIngredients); 
    console.log('Show Ingredient List:', showIngredientList); 

    // Sort the inventory alphabetically for display purposes
    const sortedInventory = [...inventory].sort();

    // Base URL for ingredient images
    const imageUrlBase = 'https://www.themealdb.com/images/ingredients/';

    // Function to construct the image URL for a given ingredient
    const getImageUrl = (ingredient) => {
        return `${imageUrlBase}${ingredient}.png`;
    };

    // JSX structure of the IngredientPanel component
    return (
        <div className="ingredient-panel">
            {/* Panel header section with an exit button */}
            <div className="panel-header">
                <div>
                    <button className="exit-button" onClick={() => setShowPanel(false)}>X</button>
                </div>

                {/* Display buttons based on the current panel mode (edit/add) */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {panelMode === 'edit' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Button to switch to 'add' mode */}
                            <button
                                style={{
                                    width: '100px',
                                    height: '40px',
                                    fontSize: '16px',
                                    backgroundColor: '#A1002D', 
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: 'transform 0.3s ease', 
                                }}
                                onClick={() => setPanelMode('add')}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} 
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                Add
                            </button>
                            {/* Button to open the PreferencesPanel */}
                        </div>
                    ) : (
                        // Button to switch back to 'edit' mode
                        <button
                            style={{
                                width: '100px',
                                height: '40px',
                                fontSize: '16px',
                                backgroundColor: '#A1002D', 
                                color: '#fff',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'transform 0.3s ease', 
                            }}
                            onClick={() => setPanelMode('edit')}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} 
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Inventory list section */}
            <div className="inventory-list-container">
                {panelMode === 'edit' ? (
                    <div className="inventory-grid">
                        <h3>Inventory</h3>
                        {/* Display a message if no ingredients are in the inventory */}
                        {sortedInventory.length === 0 ? (
                            <p>No Ingredients Added</p>
                        ) : (
                            <div className="grid-container">
                                {/* Render each ingredient in a grid layout */}
                                {sortedInventory.map((ingredient) => (
                                    <div key={ingredient} className="grid-item">
                                        {/* Ingredient image */}
                                        <img
                                            src={getImageUrl(ingredient)}
                                            alt={ingredient}
                                            className="ingredient-image"
                                        />
                                        {/* Ingredient name */}
                                        <div className="ingredient-name">
                                            {ingredient}
                                        </div>
                                        {/* Button to delete the ingredient */}
                                        <button
                                            className="ingredient-delete-button"
                                            onClick={() => handleDeleteIngredient(ingredient)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Display inventory as a list if not in 'edit' mode
                    <div className="inventory-list">
                        <h3>Inventory</h3>
                        {sortedInventory.length === 0 ? (
                            <p>No Ingredients Added</p>
                        ) : (
                            <ul>
                                {/* Render each ingredient as a list item */}
                                {sortedInventory.map((ingredient) => (
                                    <li key={ingredient}>
                                        {ingredient}
                                        {/* Show delete button only in 'edit' mode */}
                                        {panelMode === 'edit' && (
                                            <button onClick={() => handleDeleteIngredient(ingredient)}>Delete</button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Add ingredient section shown when in 'add' mode */}
            {panelMode === 'add' && (
                <div className="add-section ingredient-search">
                    {/* Input for searching ingredients */}
                    <input
                        type="text"
                        placeholder="Search for an ingredient..."
                        value={ingredientSearchQuery}
                        onClick={() => setShowIngredientList(true)}
                        onChange={(e) => setIngredientSearchQuery(e.target.value)}
                        className="ingredient-search-input"
                        style={{ width: '160px', marginRight: '50px' }}
                    />
                    {/* Display filtered ingredients as a dropdown */}
                    {showIngredientList && filteredIngredients.length > 0 && (
                        <div>
                            {filteredIngredients.length > 1 ? (
                                <ul
                                    className="ingredient-dropdown"
                                    style={{
                                        maxHeight: '280px',
                                        overflowY: 'auto',
                                        marginRight: '50px',
                                        width: '160px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        backgroundColor: '#fff',
                                        padding: '5px',
                                        listStyleType: 'none'
                                    }}
                                >
                                    {/* Render each filtered ingredient as a dropdown item */}
                                    {filteredIngredients.map((ingredient, index) => (
                                        <li
                                            key={index}
                                            value={ingredient}
                                            onClick={() => {
                                                setSelectedIngredient(ingredient);
                                                if (panelMode === 'add') {
                                                    handleAddIngredient(ingredient);
                                                }
                                                setShowIngredientList(false);
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '5px',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#f0f0f0';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#fff';
                                            }}
                                        >
                                            {ingredient}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                // If only one filtered ingredient, display it differently
                                filteredIngredients.length === 1 && (
                                    <div
                                        onClick={() => {
                                            const ingredient = filteredIngredients[0];
                                            setSelectedIngredient(ingredient);
                                            if (panelMode === 'add') {
                                                handleAddIngredient(ingredient);
                                            }
                                            setShowIngredientList(false);
                                        }}
                                        className="single-ingredient"
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#e0e0e0';
                                            e.target.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#f0f0f0';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    >
                                        {filteredIngredients[0]}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default IngredientPanel;