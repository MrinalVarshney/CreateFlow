const collabStore = require("../../collabStore");

const handleCollabRoomCreate = (socket, data) => {
  console.log(data);
  socket.join(data.roomCode);
  const room = collabStore.createRoom(data);
  console.log("room", room);
  console.log("drawing settings", room.collaborators[0].drawingSettings);
  socket.emit("collab-room-created", room);
};

module.exports = handleCollabRoomCreate;
