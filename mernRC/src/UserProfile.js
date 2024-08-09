import React, { useState } from 'react';
import './UserProfile.css'; // Import the CSS file
import defaultProfilePic from './default profile.png'; // Ensure this path is correct

const UserProfile = ({ user, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage panel visibility
    const [manageProfile, setManageProfile] = useState(false); // State to manage "Manage Profile" mode

    if (!user) return null; // Don't render if no user is logged in

    const togglePanel = () => {
        // Toggle panel visibility and set manageProfile to true
        setIsOpen(!isOpen);
        setManageProfile(false);
    };

    return (
        <div className="userProfile">
            <img
                src={defaultProfilePic}
                alt="Profile"
                className="profilePic"
                onClick={togglePanel} // // Toggle panel visibility on click
                title="Click to view profile"
            />
            {isOpen && (
                <div className="userProfilePanel">
                    <h3 className="header">User Profile</h3>
                    <img
                        src={defaultProfilePic}
                        alt="Profile"
                        className="innerProfilePic"
                    />
                    <p className="name">
                                <span className="bold">Name:</span> {user.displayName}
                            </p>
                            <p className="username"> 
                                <span className="bold">Username:</span> {user.username}
                            </p>
                            <p className="email">
                                <span className="bold">Email:</span> {user.email}
                            </p>
                    {manageProfile ? (
                        <>
                            <button 
                                className="backButton" 
                                onClick={() => setManageProfile(false)}>
                                Back
                            </button>
                            <button 
                                className="changePicButton" 
                                onClick={() => alert('Change Profile Pic')}>
                                Change Profile Pic
                            </button>
                            <button 
                                className="redButton" 
                                onClick={handleLogout}>
                                DELETE PROFILE
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="manageProfileButton" 
                                onClick={() => setManageProfile(true)}>
                                Manage Profile
                            </button>
                            <button 
                                className="redButton" 
                                onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfile;

