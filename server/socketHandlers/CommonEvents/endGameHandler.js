const serverStore = require("../../serverStore");

const endGameHandler = (roomCode) => {
  const io = serverStore.getSocketServerInstance();
  console.log("Ending",roomCode);
  serverStore.removeActiveRoom(roomCode);
  io.to(roomCode).emit("game-ended");
};

module.exports = endGameHandler;
