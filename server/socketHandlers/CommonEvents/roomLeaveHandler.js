const serverStore = require("../../serverStore");
// const { getActiveRoom, leaveActiveRoom } = require("../serverStore");
const roomLeaveHandler = (data) => {
  const userId = data.userId;
  const roomCode = serverStore.getRoomCode(userId);
  const roomType = data.roomType;
  const io = serverStore.getSocketServerInstance();
  if (roomType === "random") {
    serverStore.removerUserFromRandomRoom(userId, roomCode);
  } else {
    const activeRoom = serverStore.getActiveRoom(roomCode);
    if (activeRoom) {
      serverStore.leaveActiveRoom({ roomCode, userId });
    }
  }
  io.to(roomCode).emit("user-left", {
    userId: data.userId,
    userName: data.userName,
  });
};

module.exports = roomLeaveHandler;
