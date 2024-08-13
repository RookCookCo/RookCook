import React, { useState } from 'react';
import defaultProfilePic from '../Images/default profile.png'; // Default profile picture
import PreferencesPanel from './PreferencesPanel'; // Import the PreferencesPanel component

// UserProfile component that manages and displays the user's profile
const UserProfile = ({ user, handleLogout }) => {
    // State to manage the visibility of the user profile panel
    const [isOpen, setIsOpen] = useState(false); 
    
    // State to manage whether the user is in "Manage Profile" mode
    const [manageProfile, setManageProfile] = useState(false); 
    
    // State to manage the profile picture, initialized with the default picture
    const [profilePic, setProfilePic] = useState(defaultProfilePic);
    
    // State to manage the visibility of the upload panel
    const [showUploadPanel, setShowUploadPanel] = useState(false); 
    
    // State to manage the new profile picture selected by the user
    const [newProfilePic, setNewProfilePic] = useState(null); 
    
    // State to manage the visibility of the PreferencesPanel
    const [showPreferencesPanel, setShowPreferencesPanel] = useState(false); 

    // If no user is logged in, do not render the component
    if (!user) return null; 

    // Function to toggle the visibility of the user profile panel
    const togglePanel = () => {
        setIsOpen(!isOpen);
        setManageProfile(false); // Reset manageProfile mode when toggling the panel
        setShowUploadPanel(false); // Hide upload panel when toggling main panel
    };

    // Function to handle the change of profile picture
    const handleChangePic = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewProfilePic(e.target.result); // Set the new profile picture
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    // Function to save the new profile picture
    const handleSavePic = () => {
        if (newProfilePic) {
            setProfilePic(newProfilePic); // Update the profile picture with the new one
            setShowUploadPanel(false); // Hide the upload panel
        }
    };

    return (
        <div className="userProfile">
            {/* Profile picture that toggles the profile panel on click */}
            <img
                src={profilePic}
                alt="Profile"
                className="profilePic"
                onClick={togglePanel} // Toggle panel visibility on click
                title="Click to view profile"
            />
            {isOpen && (
                <div className="userProfilePanel">
                    <h3 className="header">User Profile</h3>
                    <img
                        src={profilePic}
                        alt="Profile"
                        className="innerProfilePic"
                    />
                    {/* Display user information */}
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
                            {/* Back button to exit "Manage Profile" mode */}
                            <button 
                                className="backButton" 
                                onClick={() => setManageProfile(false)}>
                                Back
                            </button>
                            {/* Button to show the upload panel for changing profile picture */}
                            <button 
                                className="changePicButton" 
                                onClick={() => setShowUploadPanel(true)}>
                                Change Profile Pic
                            </button>
                            {/* Button to delete the profile */}
                            <button 
                                className="redButton" 
                                onClick={handleLogout}>
                                DELETE PROFILE
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Button to enter "Manage Profile" mode */}
                            <button 
                                className="manageProfileButton" 
                                onClick={() => setManageProfile(true)}>
                                Manage Profile
                            </button>
                            {/* Button to show the PreferencesPanel */}
                            <button 
                                className="preferencesButton" 
                                onClick={() => setShowPreferencesPanel(true)}>
                                Preferences
                            </button>
                            {/* Button to log out the user */}
                            <button 
                                className="redButton" 
                                onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
            {showUploadPanel && (
                <div className="overlay">
                    <div className="uploadPanel">
                        {/* File input for uploading a new profile picture */}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleChangePic} 
                        />
                        {/* Button to cancel the upload operation */}
                        <button onClick={() => setShowUploadPanel(false)}>
                            Cancel
                        </button>
                        {/* Button to save the new profile picture */}
                        <button onClick={handleSavePic}>
                            Save
                        </button>
                    </div>
                </div>
            )}
            {showPreferencesPanel && (
                <PreferencesPanel 
                    setShowPreferencesPanel={setShowPreferencesPanel} 
                />
            )}
        </div>
    );
};

export default UserProfile;

