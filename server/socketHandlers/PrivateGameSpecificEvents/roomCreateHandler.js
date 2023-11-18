const serverStore = require("../../serverStore");

const roomCreateHandler = (socket, data, roomCode) => {
  const socketId = serverStore.getSocketId(socket);
  const roomDetails = serverStore.addNewActiveRoom({
    socketId,
    data,
    roomCode,
  });
  serverStore.mapUserToRoomCode(data.userId, roomCode)
  socket.emit("room-created", roomDetails);
};

module.exports = roomCreateHandler;
