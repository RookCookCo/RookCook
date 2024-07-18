import React from 'react';

const IngredientPanel = ({
    panelMode,
    setShowPanel,
    setPanelMode,
    ingredientSearchQuery,
    setIngredientSearchQuery,
    showIngredientList,
    setShowIngredientList,
    filteredIngredients,
    selectedIngredient,
    setSelectedIngredient,
    handleAddIngredient,
    inventory,
    handleDeleteIngredient
}) => {
    return (
        <div className="ingredient-panel">
            <div className="panel-header">
                <div>
                    <button
                        onClick={() => setShowPanel(false)}
                        style={{ backgroundColor: 'red', color: 'white' }}
                    >
                        Close
                    </button>
                </div>
                <div>
                    <button onClick={() => setPanelMode('add')}>Add</button>
                </div>
                <div>
                    <button onClick={() => setPanelMode('edit')}>Edit</button>
                </div>
            </div>
            {panelMode === 'add' && (
                <div className="add-section ingredient-search">
                    <input
                        type="text"
                        placeholder="Search for an ingredient..."
                        value={ingredientSearchQuery}
                        onClick={() => setShowIngredientList(true)}
                        onChange={(e) => setIngredientSearchQuery(e.target.value)}
                        className="ingredient-search-input"
                        style={{ width: '152px', marginLeft: '90px' }} // Adjust width and margin-left
                    />
                    {showIngredientList && filteredIngredients.length > 0 && (
                        <div>
                            {filteredIngredients.length > 1 ? (
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
                                    className="ingredient-select"
                                    style={{ width: '157px', maxHeight: '200px', overflowY: 'auto', marginLeft: '90px' }} // Adjust width, maxHeight, and marginLeft
                                >
                                    {filteredIngredients.map((ingredient, index) => (
                                        <option key={index} value={ingredient}>
                                            {ingredient}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div
                                    onClick={() => {
                                        const ingredient = filteredIngredients[0];
                                        setSelectedIngredient(ingredient);
                                        handleAddIngredient(ingredient);
                                    }}
                                    className="single-ingredient"
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: '#f0f0f0', // Light gray background
                                        padding: '10px', // Increased padding
                                        border: '1px solid #ccc',
                                        borderRadius: '8px', // Rounded corners
                                        marginTop: '15px', // Increased margin-top
                                        width: `${(filteredIngredients[0].length * 10) + 20}px`, // Adjusted width based on text length
                                        marginLeft: '90px', // Match marginLeft with input field
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Soft shadow for elevation
                                        fontFamily: 'Arial, sans-serif', // Standard font family
                                        textAlign: 'center', // Center text horizontally
                                        color: '#333', // Darker text color
                                        fontSize: '14px', // Font size
                                        fontWeight: 'bold', // Bold text
                                        lineHeight: '1.4', // Line height
                                        textTransform: 'uppercase', // Uppercase text
                                        letterSpacing: '0.5px', // Letter spacing
                                        transition: 'transform 0.3s ease-in-out, background-color 0.3s' // Smooth transform and background-color transition
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#e0e0e0'; // Lighter background on hover
                                        e.target.style.transform = 'scale(1.05)'; // Scale up slightly on hover
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#f0f0f0'; // Restore original background color
                                        e.target.style.transform = 'scale(1)'; // Restore original scale
                                    }}
                                >
                                    {filteredIngredients[0]}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            <div className="inventory-list" style={{ maxHeight: '500px', overflowY: 'auto', width: '200px' }}>
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
    );
};

export default IngredientPanel;
