const serverStore = require("../serverStore");
const roomJoinHandler = (socket, data) => {
  const socketId = socket.id;
  const roomCode = data.roomCode;

  if (!serverStore.isValidRoom(roomCode)) {
    socket.emit("join-room-error", "Invalid room code");
    return;
  }
  const roomDetails = serverStore.getActiveRoom(roomCode);

  serverStore.joinActiveRoom({ roomCode, socketId, data });

  socket.emit("room-joined", roomDetails);

  roomDetails.participants.forEach((participant) => {
    socket
      .to(participant.socketId)
      .emit("user-joined", {
        userId: data.userId,
        userName: data.userName,
        socketId,
      });
  });
};

module.exports = roomJoinHandler;
