import React, { useState } from 'react';
import './Tutorial.css'; // Import the associated CSS file for styling

const Tutorial = () => {
    // useState hook to manage the state of whether the tutorial popup is visible
    const [showTutorial, setShowTutorial] = useState(false);

    // Function to handle the click event on the "Tutorial" button
    const handleTutorialClick = () => {
        setShowTutorial(true); // Show the tutorial popup
    };

    // Function to handle the close event for the popup
    const closePopup = () => {
        setShowTutorial(false); // Hide the tutorial popup
    };

    return (
        <>
            {/* Button that triggers the tutorial popup to show */}
            <button
                className="tutorial-button"
                onClick={handleTutorialClick}
            >
                Tutorial
            </button>

            {/* Conditionally render the tutorial popup if showTutorial is true */}
            {showTutorial && (
                <div className="tutorial-popup">
                    {/* Popup header with a title and close button */}
                    <div className="popup-header">
                        <h2>Tutorial</h2>
                        <button onClick={closePopup} className="close-button">X</button>
                    </div>
                    {/* Container for the embedded YouTube video */}
                    <div className="video-container">
                        <iframe
                            src="https://www.youtube.com/embed/PiNuJKOOgMo"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </>
    );
};

export default Tutorial;
