const serverStore = require("../../serverStore");

const roomJoinHandler = (socket, roomCode, data) => {
  const socketId = serverStore.getSocketId(socket, data.userId);
  console.log("room joiner socketId:", socketId);
  console.log("room joiner data", data);
  const io = serverStore.getSocketServerInstance();
  console.log(roomCode);
  if (!serverStore.isValidRoom(roomCode)) {
    console.log("Invalid roomCode", roomCode);
    socket.emit("join-room-error", "Invalid room code");
    return;
  }
  if (serverStore.isGameStarted(roomCode)) {
    console.log("Game already started");
    socket.emit("join-room-error", "Game already started");
    return;
  } else {
    serverStore.mapUserToRoomCode(data.userId, roomCode);
    serverStore.joinActiveRoom({ roomCode, socketId, data });
    const roomDetails = serverStore.getActiveRoom(roomCode);

    // Emit "user-joined" to all users in the room
    io.to(roomCode).emit("user-joined", {
      userId: data.userId,
      userName: data.userName,
      pic: data.pic,
      socketId,
    });

    // Join the room (user who joins)
    console.log(roomDetails);
    socket.emit("room-joined", roomDetails);
  }
};

module.exports = roomJoinHandler;
