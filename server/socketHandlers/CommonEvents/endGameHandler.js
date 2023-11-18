const serverStore = require("../../serverStore");

const endGameHandler = (userId) => {
  const roomCode = serverStore.getRoomCode(userId);
  const io = serverStore.getSocketServerInstance();
  console.log(roomCode);
  serverStore.removeActiveRoom(roomCode);
  io.to(roomCode).emit("game-ended");
};

module.exports = endGameHandler;
