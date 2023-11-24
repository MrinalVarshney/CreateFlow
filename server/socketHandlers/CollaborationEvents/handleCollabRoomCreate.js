const collabStore = require("../../collabStore");

const handleCollabRoomCreate = (socket, data) => {
  const room = collabStore.createRoom(data);
  socket.emit("collab-room-created", room);
};

module.exports = handleCollabRoomCreate;
