const collabStore = require("../../collabStore");
const serverStore = require("../../serverStore");

const handleCollabRoomDelete = (data) => {
  collabStore.deleteRoom(data);
  const io = serverStore.getSocketServerInstance();
  io.to(data.roomCode).emit("collab-room-deleted", data);
};

module.exports = handleCollabRoomDelete;
