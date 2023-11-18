const serverStore = require("../serverStore");

const startGameHandler = (socket, userId) => {
  console.log("game-started");
  const io = serverStore.getSocketServerInstance();
  const roomCode = serverStore.getRoomCode(userId);
  serverStore.setGameStarted(roomCode);
  io.to(roomCode).emit("game-started");
};

module.exports = startGameHandler;
