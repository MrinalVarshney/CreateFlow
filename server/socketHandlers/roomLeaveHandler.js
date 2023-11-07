const socketServer = require("./../socketServer");

const roomLeaveHandler = (socket, data) => {
  const { roomCode } = data;
  const activeRoom = socketServer.getActiveRoom(roomCode);
  const io = serverStore.getSocketServerInstance()
  const userId = data.userId;
  const socketId = serverStore.getSocketId(socket,userId);
  if (activeRoom) {
    socketServer.leaveActiveRoom(roomCode,socketId,userId);
    io.to(roomCode).emit("user-left", {username:data.username});
    }
};

module.exports = roomLeaveHandler;
