const authSocket = require("./middlewares/authSocket");
const roomCreateHandler = require("./socketHandlers/PrivateGameSpecificEvents/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/PrivateGameSpecificEvents/roomJoinHandler");
const startGameHandler = require("./socketHandlers/CommonEvents/startGameHandler");
const endGameHandler = require("./socketHandlers/CommonEvents/endGameHandler");
const roomLeaveHandler = require("./socketHandlers/CommonEvents/roomLeaveHandler");
const serverStore = require("./serverStore");
const newConnectionHandler = require("./socketHandlers/CommonEvents/newConnectionHandler");
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
    console.log("new user connected with id: ", socket.id);

    socket.on("connect-user", (userId, callback) => {
      newConnectionHandler(socket, userId, callback);
    });

    socket.on("play-random",(data)=>{
      handlePlayRandom(socket,data);
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
      roomLeaveHandler(data);
    });

    socket.on("start-game", (userId) => {
      console.log("game-started");
      startGameHandler(socket, userId);
    });
    socket.on("end-game", (userId) => {
      endGameHandler(userId);
    });
    socket.on("send-message", (data, roomCode) => {
      io.to(roomCode).emit("new-message", data);
    });

    socket.on("mouse-down", (data) => {
      console.log("mouse-down socket", data);
      io.to(data?.roomCode).emit("mouse-down", data);
    });
    socket.on("mouse-move", (data) => {
      console.log("mouse-move socket", data);
      io.to(data?.roomCode).emit("mouse-move", data);
    });
    socket.on("mouse-up", (roomCode) => {
      console.log("mouse-up")
      io.to(roomCode).emit("mouse-up");
    });
    socket.on("virtual-mouse-down", (data) => {
      console.log("virtual-mouse-down socket");
      io.to(data?.roomCode).emit("virtual-mouse-down", data);
    });
    socket.on("virtual-mouse-move", (data) => {
      // console.log("virtual-mouse-move socket", data);
      io.to(data?.roomCode).emit("virtual-mouse-move", data);
    });
    socket.on("virtual-mouse-up", (data) => {
      io.to(data?.roomCode).emit("virtual-mouse-up", data);
    });
    socket.on("undo", (roomCode) => {
      console.log("Undo event ")
      io.to(roomCode).emit("undo");
    });
    socket.on("redo", (roomCode) => {
      io.to(roomCode).emit("redo");
    });
    socket.on("color-change",(data)=>{
      console.log(data)
      io.to(data.roomCode).emit("color-change",data.color)
    })
    socket.on("tool-change",(data)=>{
      console.log("Selected tool event")
      io.to(data.roomCode).emit("selected-tool",{tool:data.tool,width:data.width})
    })
  });
};

module.exports = { registerSocketServer };
