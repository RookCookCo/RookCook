import React from 'react';

const SignUpPanel = ({
                         email,
                         setEmail,
                         username,
                         setUsername,
                         password,
                         setPassword,
                         confirmPassword,
                         setConfirmPassword,
                         handleSignUp,
                         setShowSignUp
                     }) => {
    return (
        <div className="signup-panel">
            <div className="panel-header">
                <button className="exit-button" onClick={() => setShowSignUp(false)}>X</button>
            </div>
            <h1>Sign Up!</h1>
            <form onSubmit={handleSignUp}>
                <div className="signup-field">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="signup-confirm-button">Register</button>
            </form>
        </div>
    );
};

export default SignUpPanel;
