const serverStore = require("./../serverStore");

const roomCreateHandler = (socket, data, roomCode) => {
  const socketId = socket.id;
  const roomDetails = serverStore.addNewActiveRoom({
    socketId,
    data,
    roomCode,
  });
  socket.emit("room-created", roomDetails);
};

module.exports = roomCreateHandler;
