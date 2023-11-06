import { useContext, useState, createContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const userContext = createContext();

export const useUserAndChats = () => {
  return useContext(userContext);
};

export const UserAndChatsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  const Socket = useRef(null);

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

  const connectWithSocketServer = (user) => {
    const socket = io("http://localhost:5002", {
      auth: {
        token: user.token,
      },
    });
    Socket.current = socket;
    socket.on("connect", () => {
      console.log("Successfully connected with socket server");
    });
  };

  // The state update might not be visible immediately within this render cycle.

  const contextValue = {
    user,
    setUser,
    chats,
    setChats,
    roomDetails,
    setRoomDetails,
    connectWithSocketServer,
    socket: Socket.current,
  };

  return (
    <userContext.Provider value={contextValue}>{children}</userContext.Provider>
  );
};
