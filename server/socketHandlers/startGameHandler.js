const serverStore = require("../serverStore")


const startGameHandler = (socket) => {
    console.log("game-started")
    const roomCode = serverStore.getRoomCodeFromSocketId(socket.id)
    const roomSockets = io.sockets.adapter.rooms.get(roomCode);
    console.log(`Users in room ${roomCode}:`, roomSockets);
    io.to(roomCode).emit("game-started",{title:"game started"})
}

module.exports = startGameHandler