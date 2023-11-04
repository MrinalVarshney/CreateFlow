import io from "socket.io-client";
import { useUser } from "../Context/userAndChatsProvider";

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

export const createNewRoom = (data) => {
  // console.log("Creating new room with name: "+data)
  socket.emit("create", data);
};
