const serverStore = require("../serverStore")


const startGameHandler = (socket) => {
    console.log("game-started")
    const io = serverStore.getSocketServerInstance()
    const roomCode = serverStore.getRoomCodeFromSocketId(socket.id)
    io.to(roomCode).emit("game-started",{title:"game started"})
}

module.exports = startGameHandler