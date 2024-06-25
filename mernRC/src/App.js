// App.js
import React, { useState } from 'react';
import background from './background.png';
import logo from './logo.png';
import './App.css';

function App() {
    const [showForm, setShowForm] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');

    const appStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: '100%', // or 'cover'
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '97vh',
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, newIngredient]);
        setNewIngredient('');
        setShowForm(false);
        /// You can add code here to send the ingredients to the backend if needed
    };

    return (
        <div className="App" style={appStyle}>
            <header className="App-header">
                <div className="search-box">
                    <img src={logo} alt="RookCook Logo" className="site-logo" />
                    <label htmlFor="search">Quick recipe search: </label>
                    <input type="text" id="search" name="search" />
                </div>
                <div className="auth-buttons">
                    <button>Login</button>
                    <button>Sign up</button>
                </div>
            </header>
            <button className="add-ingredient-button" onClick={() => setShowForm(true)}>+</button>
            {showForm && (
                <div className="ingredient-form">
                    <input
                        type="text"
                        placeholder="Enter ingredient"
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                    />
                    <button onClick={handleAddIngredient}>Add</button>
                </div>
            )}
        </div>
    );
}

export default App;
