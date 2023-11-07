const socketServer = require("../serverStore");
// const { getActiveRoom, leaveActiveRoom } = require("../serverStore");
const roomLeaveHandler = (socket, data) => {
  const { roomCode } = data;
  const activeRoom = socketServer.getActiveRoom(roomCode);
  const io = socketServer.getSocketServerInstance();
  const socketId = socket.id;
  if (activeRoom) {
    socketServer.leaveActiveRoom({ roomCode, socketId });
    io.to(roomCode).emit("user-left", {
      userId: data.userId,
      userName: data.userName,
    });
  }
};

module.exports = roomLeaveHandler;
