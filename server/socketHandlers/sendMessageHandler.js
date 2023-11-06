const serverStore = require("./../serverStore");

const sendMessageHandler = (socket, data)=>{
    const roomCode = serverStore.getRoomCodeFromSocketId(socket.id)
    serverStore.addMessageToChat(roomCode,data)
    const io = serverStore.getSocketServerInstance()
    io.to(roomCode).emit("new-message",data)
}

module.exports = sendMessageHandler

