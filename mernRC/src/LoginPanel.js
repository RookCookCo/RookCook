import React from 'react';

const LoginPanel = ({
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    setShowLogin,
    handleGoogleLogin
}) => {
    return (
        <div className="login-panel">
            <div className="panel-header">
                <button onClick={() => setShowLogin(false)}>Close</button>
            </div>
            <form onSubmit={handleLogin}>
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
                <div className="login-links">
                    <button type="button" className="link-button">Forget Username?</button>
                    <button type="button" className="link-button">Forget Password?</button>
                </div>
                <div className="login-google">
                    <button type="button" onClick={handleGoogleLogin}>Sign in with Google</button>
                </div>
                <button type="submit" className="login-confirm-button">Login</button>
            </form>
        </div>
    );
};

export default LoginPanel;
