import React, { useState } from 'react';
import defaultProfilePic from '../Images/default profile.png'; // Ensure this path is correct
import PreferencesPanel from './PreferencesPanel'; // Import the PreferencesPanel component

const UserProfile = ({ user, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage panel visibility
    const [manageProfile, setManageProfile] = useState(false); // State to manage "Manage Profile" mode
    const [profilePic, setProfilePic] = useState(defaultProfilePic);
    const [showUploadPanel, setShowUploadPanel] = useState(false); // State to manage upload panel visibility
    const [newProfilePic, setNewProfilePic] = useState(null); // State to manage the new profile picture
    const [showPreferencesPanel, setShowPreferencesPanel] = useState(false); // State to manage PreferencesPanel visibility

    if (!user) return null; // Don't render if no user is logged in

    const togglePanel = () => {
        // Toggle panel visibility and set manageProfile to true
        setIsOpen(!isOpen);
        setManageProfile(false);
        setShowUploadPanel(false); // Hide upload panel when toggling main panel
    };

    const handleChangePic = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewProfilePic(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSavePic = () => {
        if (newProfilePic) {
            setProfilePic(newProfilePic);
            setShowUploadPanel(false);
        }
    };

    return (
        <div className="userProfile">
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
                                onClick={() => setShowUploadPanel(true)}>
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
                                className="preferencesButton" 
                                style={{
                                    width: '100px',
                                    height: '40px',
                                    fontSize: '16px',
                                    backgroundColor: '#A1002D', 
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: 'transform 0.3s ease',
                                    position: 'relative', // Allow the button to be moved within its container
                                    left: '174px', // Move the button to the right
                                    top:'-65px',
                                    // right: '20px', // Use this instead of left to move the button to the left
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} 
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                onClick={() => setShowPreferencesPanel(true)}>
                                
                                Preferences
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
            {showUploadPanel && (
                <div className="overlay">
                    <div className="uploadPanel">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleChangePic} 
                        />
                        <button onClick={() => setShowUploadPanel(false)}>
                            Cancel
                        </button>
                        <button onClick={handleSavePic}>
                            Save
                        </button>
                    </div>
                </div>
            )}
            {showPreferencesPanel && (
                <PreferencesPanel setShowPreferencesPanel={setShowPreferencesPanel} />
            )}
        </div>
    );
};

export default UserProfile;
