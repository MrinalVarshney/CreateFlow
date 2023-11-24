const collabStore = require("../../collabStore");
const serverStore = require("../../serverStore");
const handleCollabMouseDown = (data) => {
  const { roomCode } = data;
  collabStore.updateDownSettings(data);
  const io = serverStore.getSocketServerInstance;
  io.to(roomCode).emit("collab-mouse-down", data);
};

module.exports = handleCollabMouseDown;
