const socketServer = require('../socketServer');

const startGameHandler = (socket) => {
    const roomCode = socketServer.getRoomCodeFromSocketId(socket.id)
    const activeRoom = socketServer.getActiveRoom(roomCode)
    if(activeRoom){
        activeRoom.participants.forEach((participant)=>{
            socket.to(participant.socketId).emit("game-started")
        })
    }
}

module.exports = startGameHandler