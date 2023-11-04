const serverStore = require("../serverStore");

const roomCreateHandler = (socket, data) => {
  const socketId = socket.id;
  const roomDetails = serverStore.addNewActiveRoom({ socketId, data });
  socket.emit("room-created", roomDetails);
};

module.exports = roomCreateHandler;
