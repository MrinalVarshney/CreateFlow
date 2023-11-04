import io from "socket.io-client";
import { onHostingRoom, onJoiningRoom } from "./RoomHandler";

let socket = null;

export const connectWithSocketServer = (user) => {
  socket = io("http://localhost:5002", {
    auth: {
      token: user.token,
    },
  });
  socket.on("connect", () => {
    console.log("Successfully connected with socket server");
  });
};

export const createNewRoom = (data, setHostRoomCode, setRoomDetails,navigate,roomDetails,setIsUserJoined) => {
  // console.log("Creating new room with name: "+data)
  socket.emit("room-create", data);
  socket.on("room-created", (room) => {
    onHostingRoom(room, setHostRoomCode, setRoomDetails,navigate,roomDetails,setIsUserJoined);
  });
  socket.on("");
};

export const joinRoom = (
  roomCode,
  data,
  setIsUserJoined,
  setRoomDetails,
  roomDetails,
  navigate
) => {
  console.log("joined the room");
  socket.emit("join-room", roomCode, data);
  socket.on("user-joined", (userData) => {
    onJoiningRoom(userData, roomDetails, setRoomDetails);
  });
  socket.on("room-joined", (room) => {
    console.log("join-room", room);
    setRoomDetails(room);
    setIsUserJoined(true);
    // navigate("/skribble");
  });
};

export const leaveRoom = (data, chats, setChats) => {
  console.log("leaved the room");
  socket.emit("leave-room", data);
  socket.on("user-left", (userData) => {
    const message = `${userData.userName} is left the room.`;
    // sendRoomMessage(message, chats, setChats);
  });
};

export const startGame = (navigate) => {
  socket.emit("start-game");
  socket.on("game-started", () => {
    console.log("Game")
    navigate("/skribble");
  });
};

export const endGame = (navigate) => {
  socket.emit("end-game");
  socket.on("game-ended", () => {
    navigate("/selectionBoard");
  });
};
