

import React, { useState } from 'react';
import './PopUpMenu.css'; // Assuming you have a separate CSS file

const PopupMenu = ({ParticipantsName,Restrict,Kick,Warn}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleButtonClick = (action) => {
    // Implement the action based on the button clicked
    console.log(`Action clicked: ${action}`);

    // Close the menu after an action is performed
    setIsMenuOpen(false);
  };

  return (
    <div className="popup-menu">
      <button className="menu-button" onClick={handleMenuToggle}>
        Actions
      </button>

      {isMenuOpen && (
        <div className="menu-options">
          <button onClick={() => handleButtonClick('Kick')}>Kick</button>
          <button onClick={() => handleButtonClick('Restrict Chat')}>Restrict Chat</button>
          <button onClick={() => handleButtonClick('Warn')}>Warn</button>
        </div>
      )}
    </div>
  );
};

export default PopupMenu;
