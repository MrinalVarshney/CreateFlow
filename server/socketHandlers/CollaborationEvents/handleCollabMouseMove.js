const collabStore = require("../../collabStore");
const serverStore = require("../../serverStore");
const handleCollabMouseMove = (data) => {
  const { roomCode } = data;
  collabStore.updateMoveSettings(data);
  const io = serverStore.getSocketServerInstance;
  io.to(roomCode).emit("collab-mouse-move", data);
};

module.exports = handleCollabMouseMove;
