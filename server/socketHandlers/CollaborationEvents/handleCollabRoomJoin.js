const collabStore = require("../../collabStore");
const serverStore = require("../../serverStore");

const handleCollabRoomJoin = (socket, data) => {
  const room = collabStore.joinRoom(data);
  const io = serverStore.getSocketServerInstance();
  io.to(data.roomCode).emit("collab-user-joined", data);
  socket.emit("collab-room-join-details", room);
};

module.exports = handleCollabRoomJoin;
