import React, { useState } from 'react';
import defaultProfilePic from './default profile.png'; // Ensure this path is correct

const UserProfile = ({ user, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage panel visibility

    if (!user) return null; // Don't render if no user is logged in

    const styles = {
        userProfile: {
            position: 'absolute',
            top: '20px',
            right: '35px',
            zIndex: 1000,
        },
        profilePic: {
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            cursor: 'pointer',
        },
        userProfilePanel: {
            position: 'fixed', // Changed to 'fixed' to keep it independent
            top: '100px', // Adjust to fit your layout
            right: '50px', // Adjust to fit your layout
            background: 'white',
            padding: '200px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            display: isOpen ? 'block' : 'none',
        },
        header: {
            position: 'absolute',
            top: '20px',
            left: '20px',
            margin: '0',
            fontSize: '16px',
        },
        innerProfilePic: {
            position: 'absolute',
            top: '10px',
            right: '26px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
        },
        paragraph: {
            position: 'absolute',
            left: '10px',
            top: '130px', // Adjust this to position the text correctly under the header
            margin: '5px 0',
            fontSize: '14px',
        },
        email: {
            position: 'absolute',
            left: '10px',
            top: '160px', // Adjust this to position the email correctly under the name
            margin: '5px 0',
            fontSize: '14px',
        },
        bold: {
            fontWeight: 'bold',
        },
        changePicButton: {
            position: 'absolute',
            left: '260px',
            top: '120px', // Adjust this to position the button correctly under the profile pic
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
        },
        logoutButton: {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)', // Center the button horizontally
            bottom: '10px', // Position it at the bottom
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
                    <img
                        src={defaultProfilePic}
                        alt="Profile"
                        style={styles.innerProfilePic}
                    />
                    <p style={styles.paragraph}>
                        <span style={styles.bold}>Name:</span> {user.displayName}
                    </p>
                    <p style={styles.email}>
                        <span style={styles.bold}>Email:</span> {user.email}
                    </p>
                    <button style={styles.changePicButton} onClick={() => alert('Change Profile Pic')}>
                        Change Profile Pic
                    </button>
                    <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
