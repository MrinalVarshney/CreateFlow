const serverStore = require("../../serverStore");
const collabStore = require("../../collabStore");

const newConnectionHandler = (socket, userId, callback) => {
  const socketId = serverStore.addUserToStore(socket.id, userId);
  const roomCode = serverStore.getRoomCode(userId);
  const collab_roomCode = collabStore.getCollabRoomCode(userId);
  if (roomCode){
    socket.join(roomCode);
  }
  else if(collab_roomCode){
    socket.join(collab_roomCode);
  }
  else{
    console.log("Joining using userId")
    socket.join(userId)
  }
  callback(socketId);
};

module.exports = newConnectionHandler;
