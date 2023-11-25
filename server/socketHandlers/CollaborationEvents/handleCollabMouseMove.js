const collabStore = require("../../collabStore");
const serverStore = require("../../serverStore");
const handleCollabMouseMove = (data) => {
  const { roomCode } = data;

  const io =  serverStore.getSocketServerInstance();
  collabStore.updateMoveSettings(data);
  io.to(roomCode).emit("collab-mouse-move", data);
};

module.exports = handleCollabMouseMove;
