import React, { useState } from 'react';
import defaultProfilePic from './logo.png'; // Ensure this path is correct

const UserProfile = ({ user, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage panel visibility

    if (!user) return null; // Don't render if no user is logged in

    const styles = {
        userProfile: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
        },
        profilePic: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
        },
        userProfilePanel: {
            position: 'absolute',
            top: '50px',
            right: '10px',
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            display: isOpen ? 'block' : 'none',
        },
        header: {
            margin: '0 0 10px 0',
            fontSize: '16px',
        },
        paragraph: {
            margin: '5px 0',
            fontSize: '14px',
        },
        logoutButton: {
            marginTop: '10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
        }
    };

    return (
        <div style={styles.userProfile}>
            <img
                src={defaultProfilePic}
                alt="Profile"
                style={styles.profilePic}
                onClick={() => setIsOpen(!isOpen)} // Toggle panel visibility on click
                title="Click to view profile"
            />
            {isOpen && (
                <div style={styles.userProfilePanel}>
                    <h3 style={styles.header}>User Profile</h3>
                    <p style={styles.paragraph}>Name: {user.displayName}</p>
                    <p style={styles.paragraph}>Email: {user.email}</p>
                    <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;