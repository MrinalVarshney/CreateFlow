const serverStore = require("../../serverStore");

const kickUserHandler = (data) => {
  const userId = data.userId;
  const roomCode = data.roomCode;
  const roomType = data.roomType;
  const io = serverStore.getSocketServerInstance();

  if (roomType === "random") {
    const updatedRoom = serverStore.removerUserFromRandomRoom(userId, roomCode);
    console.log("Kicked user from random room", updatedRoom);
  } else {
    const updatedRoom = serverStore.leaveActiveRoom(roomCode, userId);
    console.log("Kicked user from active room", updatedRoom);
  }
    io.to(roomCode).emit("user-kicked",data);
};

module.exports = kickUserHandler;
