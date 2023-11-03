import { useContext, useState, createContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const userContext = createContext();

export const useUser = () => {
    return useContext(userContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  
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
        navigate("/login");
      }
    }, [navigate]);
  
    // The state update might not be visible immediately within this render cycle.
  
    const contextValue = {
      user,
      setUser,
    };
  
    return (
      <userContext.Provider value={contextValue}>
        {children}
      </userContext.Provider>
    );
  };
  