import React, { useState } from "react";
import "./PopUpMenu.css"; // Assuming you have a separate CSS file

const PopupMenu = ({ userId, handleKick, handleRestrict, handleWarn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleButtonClick = (e, action) => {
    // Implement the action based on the button clicked
    console.log(`Action clicked: ${action}`);
    if (action === "Kick") {
      handleKick(e, userId);
    } else if (action === "Restrict Chat") {
      handleRestrict(e, userId);
    } else {
      handleWarn(e, userId);
    }
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
          <button onClick={(e) => handleButtonClick(e, "Kick")}>Kick</button>
          <button onClick={(e) => handleButtonClick(e, "Restrict Chat")}>
            Restrict Chat
          </button>
          <button onClick={(e) => handleButtonClick(e, "Warn")}>Warn</button>
        </div>
      )}
    </div>
  );
};

export default PopupMenu;
