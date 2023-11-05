const serverStore = require("../serverStore")


const startGameHandler = (socket) => {
    const roomCode = serverStore.getRoomCodeFromSocketId(socket.id)
    const io = serverStore.getSocketServerInstance()
    console.log("game started",roomCode)
    io.to(roomCode).emit("game-started")
}

module.exports = startGameHandler