const serverStore = require("../serverStore");

const newConnectionHandler = (socket, userId,callback) => {
    const socketId = serverStore.addUserToStore(socket.id, userId);
    const roomCode = serverStore.getRoomCode(userId);
    if(roomCode) socket.join(roomCode)
    callback(socketId)
}

module.exports = newConnectionHandler