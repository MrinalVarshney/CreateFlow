const authSocket = require("./middlewares/authSocket");
const roomCreateHandler = require("./socketHandlers/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/roomJoinHandler");
const startGameHandler = require("./socketHandlers/startGameHandler");
const serverStore = require("./serverStore");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
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

  serverStore.setSocketServerInstance(io);

  io.on("connection", (socket) => {
    console.log("new user connected with id: ",socket.id)

    socket.on("connect-user", (userId,callback) => {
      newConnectionHandler(socket, userId,callback);
    })

    socket.on("room-create", (data) => {
      const roomCode = uuidv4();
      socket.join(roomCode);
      roomCreateHandler(socket, data, roomCode);
    });


    socket.on("join-room", (roomCode, data) => {
      roomJoinHandler(socket, roomCode, data);
      socket.join(roomCode);
    });

    socket.on("leave-room", (data) => {
      roomLeaveHandler(socket, data);
    });

    socket.on("start-game", (userId) => {
      console.log("game-started")
      startGameHandler(socket,userId);
    });
    socket.on("end-game", () => {
      endGameHandler(socket);
    });
    socket.on("send-message", (data, roomCode) => {
      io.to(roomCode).emit("new-message", data);
    });
  });
};


module.exports = { registerSocketServer };
