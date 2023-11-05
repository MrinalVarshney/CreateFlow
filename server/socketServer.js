const authSocket = require("./middlewares/authSocket");
const roomCreateHandler = require("./socketHandlers/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/roomJoinHandler");
const startGameHandler = require("./socketHandlers/startGameHandler")
const serverStore= require("./serverStore")
const { v4: uuidv4 } = require("uuid");

const registerSocketServer = (server) => {
  server.listen(5002, () => {
    console.log("Socket server is listening on port 5002");
  });

  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.use((socket, next) => {
    authSocket(socket, next);
  });

  serverStore.setSocketServerInstance(io)

  io.on("connection", (socket) => {
    console.log("New client connected with id: " + socket.id);

    socket.on("room-create", (data) => {
      // console.log(data)
      // roomCreateHandler(socket, data);
      const roomCode = uuidv4()
      socket.join(roomCode)
      const activeRoom = serverStore.addNewActiveRoom({socketId:socket.id,data,roomCode})
      socket.emit("room-created",activeRoom)
    });

    socket.on("join-room", (roomCode, data) => {
      roomJoinHandler(socket, roomCode, data);
      socket.join(roomCode)
    });

    socket.on("leave-room", (data) => {
      roomLeaveHandler(socket, data);
    });

    socket.on("start-game", () => {
 
    });
    socket.on("end-game", () => {
      endGameHandler(socket);
    });
  });
};

module.exports = { registerSocketServer };
