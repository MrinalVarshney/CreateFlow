const serverStore = require("../../serverStore");

const startGameHandler = (socket, data) => {
  console.log("game-started",data);
  const io = serverStore.getSocketServerInstance();
  const roomCode = data.roomCode;
  const roomType = data.roomType;
  if(roomType === "private"){
    serverStore.setGameStarted(roomCode);
  }
  else{
    serverStore.startRandomGame(roomCode);
  }
  io.to(roomCode).emit("game-started");
};

module.exports = startGameHandler;
