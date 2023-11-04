import { useContext, useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const userContext = createContext();

export const useUserAndChats = () => {
  return useContext(userContext);
};

export const UserAndChatsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    const currentPath = window.location.pathname;

    if (userDetails) {
      // Set the user data in the state
      setUser(userDetails);
    } else if (currentPath === "/register") {
      // Allow access to the register page
      return;
    } else {
      // Redirect to the login page
      navigate("/");
    }
  }, [navigate]);

  // The state update might not be visible immediately within this render cycle.

  const contextValue = {
    user,
    setUser,
    chats,
    setChats,
    roomDetails,
    setRoomDetails,
  };

  return (
    <userContext.Provider value={contextValue}>{children}</userContext.Provider>
  );
};
