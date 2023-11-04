const serverStore = require("../serverStore");

const roomJoinHandler = (socket, roomCode, data) => {
  const socketId = socket.id;

  serverStore.joinActiveRoom({ roomCode, socketId, data });
  socket
    .to(roomCode)
    .emit("user-joined", { userName: data.userName, userId: data.userId });
};

module.exports = roomJoinHandler;
