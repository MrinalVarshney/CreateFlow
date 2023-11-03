const serverStore = require("../serverStore");

const roomJoinHandler = (socket, data) => {
  const socketId = socket.id;
  const roomCode = data.roomCode;

  serverStore.joinActiveRoom({ roomCode, socketId, data });
  socket
    .to(roomCode)
    .emit("user-joined", { userName: data.userName, userId: data.userId });
};

module.exports = roomJoinHandler;
