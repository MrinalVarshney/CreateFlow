import io from "socket.io-client";
import { useUser } from "../Context/userAndChatsProvider";
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

export const createNewRoom = (data, setHostRoomCode, setRoomDetails) => {
  // console.log("Creating new room with name: "+data)
  socket.emit("room-create", data);
  socket.on("room-created", (room) => {
    onHostingRoom(room, setHostRoomCode, setRoomDetails);
  });
};

export const joinRoom = (
  roomCode,
  data,
  setIsUserJoined,
  setRoomDetails,
  roomDetails
) => {
  console.log("joined the room");
  socket.emit("join-room", roomCode, data);
  socket.on("user-joined", (userData) => {
    onJoiningRoom(userData, setIsUserJoined, roomDetails, setRoomDetails);
  });
  socket.on("room-joined", (room) => {
    setRoomDetails(room);
  });
};
