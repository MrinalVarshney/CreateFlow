const serverStore = require("../serverStore");

const startGameHandler = (socket) => {
  console.log("game-started");
  const io = serverStore.getSocketServerInstance();
  const socketId = socket.id;
  const roomCode = serverStore.getRoomCodeFromSocketId(socketId);
  io.to(roomCode).emit("game-started", { title: "game started" });
};

module.exports = startGameHandler;
