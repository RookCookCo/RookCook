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
    console.log('Filtered Ingredients:', filteredIngredients); // Debugging log
    console.log('Show Ingredient List:', showIngredientList); // Debugging log

    // Sort the inventory alphabetically
    const sortedInventory = [...inventory].sort();

    return (
        <div className="ingredient-panel">
            <div className="panel-header">
                <div>
                    <button
                        onClick={() => setShowPanel(false)}
                        style={{
                            backgroundColor: 'red',
                            color: 'white',
                            padding: '10px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s, color 0.3s, transform 0.3s',
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            letterSpacing: '0.5px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            outline: 'none',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#D50606';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'red';
                            e.target.style.transform = 'scale(1)';
                        }}
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
                        style={{ width: '152px', marginLeft: '90px' }}
                    />
                    {showIngredientList && filteredIngredients.length > 0 && (
                        <div>
                            {filteredIngredients.length > 1 ? (
                                <ul
                                    className="ingredient-dropdown"
                                    style={{
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        marginLeft: '90px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        backgroundColor: '#fff',
                                        padding: '5px',
                                        listStyleType: 'none'
                                    }}
                                >
                                    {filteredIngredients.map((ingredient, index) => (
                                        <li
                                            key={index}
                                            value={ingredient}
                                            onClick={() => {
                                                setSelectedIngredient(ingredient);
                                                handleAddIngredient(ingredient);
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
                                filteredIngredients.length === 1 && (
                                    <div
                                        onClick={() => {
                                            const ingredient = filteredIngredients[0];
                                            setSelectedIngredient(ingredient);
                                            handleAddIngredient(ingredient);
                                            setShowIngredientList(false);
                                        }}
                                        className="single-ingredient"
                                        style={{
                                            cursor: 'pointer',
                                            backgroundColor: '#f0f0f0',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            marginTop: '15px',
                                            width: `${(filteredIngredients[0].length * 10) + 20}px`,
                                            marginLeft: '90px',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                            fontFamily: 'Arial, sans-serif',
                                            textAlign: 'center',
                                            color: '#333',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            lineHeight: '1.4',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            transition: 'transform 0.3s ease-in-out, background-color 0.3s'
                                        }}
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
            <div className="inventory-list" style={{ maxHeight: '500px', overflowY: 'auto', width: '200px' }}>
                <h3>Inventory</h3>
                <ul>
                    {sortedInventory.map((ingredient) => (
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