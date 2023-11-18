const serverStore = require("./../serverStore");

const roomCreateHandler = (socket, data, roomCode) => {
  const socketId = serverStore.getSocketId(socket);
  const roomDetails = serverStore.addNewActiveRoom({
    socketId,
    data,
    roomCode,
  });
  console.log("rmDCreate", roomDetails, socketId);
  serverStore.mapUserToRoomCode(data.userId, roomCode);
  socket.emit("room-created", roomDetails);
};

module.exports = roomCreateHandler;
