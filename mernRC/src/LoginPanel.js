import React from 'react';

// LoginPanel component handles the user login process
const LoginPanel = ({
                        username, // State variable for the username input
                        setUsername, // Function to update the username state
                        password, // State variable for the password input
                        setPassword, // Function to update the password state
                        handleLogin, // Function to handle the form submission for login
                        setShowLogin, // Function to toggle the visibility of the login panel
                        handleGoogleLogin // Function to handle login via Google
                    }) => {
    return (
        <div className="login-panel">
            {/* Panel header with an exit button to close the login panel */}
            <div className="panel-header">
                <button className="exit-button" onClick={() => setShowLogin(false)}>X</button>
            </div>
            <h1>Welcome Back!</h1>
            {/* Login form */}
            <form onSubmit={handleLogin}>
                {/* Username input field */}
                <div className="login-field">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                {/* Password input field */}
                <div className="login-field">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/* Links for forgetting username or password */}
                <div className="login-links">
                    <button type="button" className="link-button">Forget Username?</button>
                    <button type="button" className="link-button">Forget Password?</button>
                </div>
                {/* Button to login with Google */}
                <div className="login-google">
                    <button type="button" onClick={handleGoogleLogin}>Sign in with Google</button>
                </div>
                {/* Submit button to confirm login */}
                <button type="submit" className="login-confirm-button">Login</button>
            </form>
        </div>
    );
};

export default LoginPanel;
