import React, { useState } from 'react';

// SignUpPanel component to handle the user sign-up process
const SignUpPanel = ({
        handleSignUp,
        setShowSignUp, // Function to toggle the visibility of the sign-up panel
    }) => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState(null); // State to hold the user data after sign-up

    const SigningUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const newUser = {
            username: username,
            email: email,
            uid: password,
        };
        
        handleSignUp(newUser);
    };

    return (
        <div className="signup-panel">
            {/* Panel header with an exit button to close the sign-up panel */}
            <div className="panel-header">
                <button className="exit-button" onClick={() => setShowSignUp(false)}>X</button>
            </div>
            <h1>Sign Up!</h1>
            {/* Sign-up form */}
            <form onSubmit={SigningUp}>
                {/* Email input field */}
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
                {/* Username input field */}
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
                {/* Password input field */}
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
                {/* Confirm Password input field */}
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
                {/* Submit button to register the user */}
                <button type="submit" className="signup-confirm-button">Register</button>
            </form>
        </div>
    );
};

export default SignUpPanel;
