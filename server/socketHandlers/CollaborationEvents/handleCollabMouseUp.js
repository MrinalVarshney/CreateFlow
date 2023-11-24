const collabStore = require("../../collabStore");
const serverStore = require("../../serverStore");
const handleCollabMouseUp = (data) => {
  const { roomCode } = data;
  collabStore.updateUpSettings(data);
  const io = serverStore.getSocketServerInstance;
  io.to(roomCode).emit("collab-mouse-up", data);
};

module.exports = handleCollabMouseUp;
