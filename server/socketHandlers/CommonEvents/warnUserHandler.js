const serverStore = requirE("../../serverStore");

const warnUserHandler = (data) => {
  const io = serverStore.getSocketServerInstance();
  const roomCode = data.roomCode;
  const userId = data.userId;
  const roomType = data.roomType;
  serverStore.addWarningToUser(userId);
  const warnings = serverStore.getWarningsCount(userId);

  if (warnings >= 3) {
    if (roomType === "random") {
      
      const updatedRoom = serverStore.removerUserFromRandomRoom(
        userId,
        roomCode
      );
      console.log("User auto kicked from random room", updatedRoom);
    } else {
      room = serverStore.getActiveRoom(roomCode);
      const updatedRoom = serverStore.leaveActiveRoom(roomCode, userId);
      console.log("User auto kicked from active room", updatedRoom);
    }
    io.to(roomCode).emit("user-auto-kicked", data);

  } else {
    io.to(roomCode).emit("user-warned", data);
  }
};

module.exports = warnUserHandler;
