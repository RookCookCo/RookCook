// App.js
import React from 'react';
import background from './background.png';

import './App.css';

function App() {
    const appStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: '100%', // or 'cover'
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '97vh',
    };

    return (
        <div className="App" style={appStyle}>
            <header className="App-header">
                
                <div className="search-box">
                    <label htmlFor="search">Quick recipe search: </label>
                    <input type="text" id="search" name="search" />
                </div>
                <div className="auth-buttons">
                    <button>Login</button>
                    <button>Sign up</button>
                </div>
            </header>
        </div>
    );
}

export default App;
