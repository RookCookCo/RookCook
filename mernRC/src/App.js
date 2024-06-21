// App.js
import React from 'react';
import background from './background.png';
import './App.css';

function App() {
    const appStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'contain', // or 'cover'
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100vh',
        margin: 0
    };

    return (
        <div className="App" style={appStyle}>
            <header className="App-header">
                <div className="top-bar">
                    <div className="search-box">
                        <label htmlFor="search">Quick recipe search: </label>
                        <input type="text" id="search" name="search" />
                    </div>
                    <div className="auth-buttons">
                        <button>Login</button>
                        <button>Sign up</button>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
