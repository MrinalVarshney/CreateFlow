const socketServer = require("./../socketServer");

const roomLeaveHandler = (socket, data) => {
  const { roomCode } = data;
  const activeRoom = socketServer.getActiveRoom(roomCode);
  const socketId = socket.id;
  if (activeRoom) {
    socketServer.leaveActiveRoom({ roomCode, socketId });
    const updatedActiveRooms = socketServer.getActiveRooms(roomCode);
    if (updatedActiveRooms) {
      updatedActiveRooms.participants.forEach((participant) => {
        socket.to(participant.socketId).emit("user-left", {
          userId: data.userId,
          userName: data.userName,
        });
      });
    }
  }
};

module.exports = roomLeaveHandler;
