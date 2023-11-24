const serverStore = require("../../serverStore");

const roomLeaveHandler = (data) => {
  const userId = data.userId;
  const roomCode = serverStore.getRoomCode(userId);
  const roomType = data.roomType;
  const io = serverStore.getSocketServerInstance();
    if (roomType === "random") {
    console.log("userID", userId, "roomCode", roomCode)
    const updatedRoom = serverStore.removerUserFromRandomRoom(userId, roomCode);
    console.log("Removed user from random room", updatedRoom);
  } else {
    const activeRoom = serverStore.getActiveRoom(roomCode);
    if (activeRoom) {
      const updatedRoom = serverStore.leaveActiveRoom({ roomCode, userId });
      console.log("Removed user from active room", updatedRoom);
    }
  }
  io.to(roomCode).emit("user-left", {
    userId: data.userId,
    userName: data.userName,
    action: data.action,
  });
};

module.exports = roomLeaveHandler;
