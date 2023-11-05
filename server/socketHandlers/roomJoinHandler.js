const serverStore = require("../serverStore");

const roomJoinHandler = (socket, roomCode, data) => {
  const socketId = socket.id;
  const io = serverStore.getSocketServerInstance();
  console.log(roomCode)
  if (!serverStore.isValidRoom(roomCode)) {
    console.log("Invalid roomCode", roomCode);
    socket.emit("join-room-error", "Invalid room code");
    return;
  }

  serverStore.joinActiveRoom({ roomCode, socketId, data });
  const roomDetails = serverStore.getActiveRoom(roomCode);

  // Emit "user-joined" to all users in the room
  io.to(roomCode).emit("user-joined", {
    userId: data.userId,
    userName: data.userName,
    socketId,
  });

  // Join the room (user who joins)
  socket.join(roomCode);
  socket.emit("room-joined", roomDetails);
};

module.exports = roomJoinHandler;
