const authSocket = require("./middlewares/authSocket");
const roomCreateHandler = require("./socketHandlers/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/roomJoinHandler");

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

  io.on("connection", (socket) => {
    console.log("New client connected with id: " + socket.id);

    socket.on("room-create", (data) => {
      roomCreateHandler(socket, data);
    });

    socket.on("join-room", (roomCode, data) => {
      console.log(roomCode, data);
      roomJoinHandler(socket, roomCode, data);
    });
  });
};

module.exports = { registerSocketServer };
