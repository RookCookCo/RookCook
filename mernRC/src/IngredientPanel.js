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
                    <button onClick={() => setShowPanel(false)}>Close</button>
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
    );
};

export default IngredientPanel;
