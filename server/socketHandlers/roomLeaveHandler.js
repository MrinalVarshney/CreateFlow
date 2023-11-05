const socketServer = require("./../socketServer");

const roomLeaveHandler = (socket, data) => {
  const { roomCode } = data;
  const activeRoom = socketServer.getActiveRoom(roomCode);
  const io = serverStore.getSocketServerInstance()
  const socketId = socket.id;
  if (activeRoom) {
    socketServer.leaveActiveRoom({ roomCode, socketId });
    io.to(roomCode).emit("user-left", {username:data.username});
    }
};

module.exports = roomLeaveHandler;
