const collabStore = require("../../collabStore");
const serverStore = require("../../serverStore");

const handleCollabRoomleave = (data) => {
  collabStore.leaveRoom(data);
  const io = serverStore.getSocketServerInstance();
  io.to(data.roomCode).emit("collab-user-leave", data);
};

module.exports = handleCollabRoomleave;
