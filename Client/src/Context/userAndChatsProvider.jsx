import { useContext, useState, createContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import NetworkErrorPage from "../NetworkErrorPages/ErrorPage";

const userContext = createContext();

export const useUserAndChats = () => {
  return useContext(userContext);
};

export const UserAndChatsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  const [rounds, setRounds] = useState(2);
  const [time, setTime] = useState(10);
  const [difficulty, setDifficulty] = useState("Easy");
  const playingGameRef = useRef(false);
  const Socket = useRef(null);
  const [showTimer, setShowTimer] = useState(false);
  const collabUsers = useRef(new Map());

  useEffect(() => {
    if (collabUsers)
      localStorage.setItem("collabUsers", JSON.stringify(collabUsers));
  }, [collabUsers]);

  useEffect(() => {
    if (roomDetails) {
      console.log("saving TO local");
      const room = "roomDetails";
      localStorage.setItem(room, JSON.stringify(roomDetails));
    }
  }, [roomDetails]);

  useEffect(() => {
    if (chats) {
      const chatSessionKey = "chats";
      localStorage.setItem(chatSessionKey, JSON.stringify(chats));
    }
  }, [chats]);

  useEffect(() => {
      if(window.navigator.onLine===false){
        navigate("/offline")
        return
      } 
      else{
        const userDetails = JSON.parse(localStorage.getItem("user"));
        const currentPath = window.location.pathname;
        console.log(userDetails, "user");
    
        if (userDetails) {
          setUser(userDetails);
          if (currentPath === "/" || currentPath === "/register") {
            navigate("/dashboard");
          }
        } else if (
          currentPath === "/register" ||
          currentPath === "/reset-password/"
        ) {
          // Allow access to the register page
          return;
        } else {
          // Redirect to the login page
          console.log(currentPath);
          navigate("/");
        }
      }

  
  }, [navigate]);

  const connectWithSocketServer = () => {
    console.log("connecting to socket server");
    const user = JSON.parse(localStorage.getItem("user"));
    const socket = io("http://localhost:5002", {
      auth: {
        token: user.token,
      },
    });
    const userId = user._id;

    /// For maintaining unique socket id for each user
    socket?.emit("connect-user", userId, (socketId) => {
      console.log("socketId", socketId);
      socket.id = socketId;
    });
    Socket.current = socket;
    socket?.on("connect", () => {
      console.log("Successfully connected with socket server");
    });
  };

  const contextValue = {
    user,
    setUser,
    chats,
    setChats,
    roomDetails,
    setRoomDetails,
    connectWithSocketServer,
    Socket,
    playingGameRef,
    showTimer,
    setShowTimer,
    rounds,
    setRounds,
    time,
    setTime,
    difficulty,
    setDifficulty,
    collabUsers,
  };

  return (
    <userContext.Provider value={contextValue}>{children}</userContext.Provider>
  );
};
