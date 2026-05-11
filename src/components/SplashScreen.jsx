import React, { useState, useEffect } from 'react';
import fifaImage from '../assets/fifa.jpeg';
import '../styles/SplashScreen.css';

const SplashScreen = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <>
      {isVisible && (
        <div className="splash-overlay">
          <div className="splash-container">
            <img 
              src={fifaImage} 
              alt="Splash Screen" 
              className="splash-image"
            />
            <button 
              className="splash-close"
              onClick={handleClose}
              aria-label="Close splash screen"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SplashScreen;
