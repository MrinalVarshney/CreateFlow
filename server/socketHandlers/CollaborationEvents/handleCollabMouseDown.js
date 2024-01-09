const collabStore = require("../../collabStore");
const serverStore = require("../../serverStore");
const handleCollabMouseDown = (data) => {
  const { roomCode } = data;
  collabStore.updateDownSettings(data);
  console.log("collab mouse down", data);
  const io = serverStore.getSocketServerInstance();

  const clientsInRoom = io.sockets.adapter.rooms.get(roomCode);

  if (clientsInRoom) {
    console.log(`Clients in room ${roomCode}: ${[...clientsInRoom]}`);
  } else {
    console.log(`Room ${roomCode} does not exist or is empty.`);
  }

  io.to(roomCode).emit("collab-mouse-down", data);
};

module.exports = handleCollabMouseDown;
