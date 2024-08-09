import React, { useState } from 'react';
import './Tutorial.css'; // Import the associated CSS file

const Tutorial = () => {
    const [showTutorial, setShowTutorial] = useState(false);

    const handleTutorialClick = () => {
        setShowTutorial(true);
    };

    const closePopup = () => {
        setShowTutorial(false);
    };

    return (
        <>
            <button
                className="tutorial-button"
                onClick={handleTutorialClick}
            >
                Tutorial
            </button>

            {showTutorial && (
                <div className="tutorial-popup">
                    <div className="popup-header">
                        <h2>Tutorial</h2>
                        <button onClick={closePopup} className="close-button">X</button>
                    </div>
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
