const serverStore = require("./../serverStore")

const endGameHandler = (socket) => {   
    const roomCode = serverStore.getRoomCode(socket.id)
    const updatedActiveRoom = serverStore.removeActiveRoom(roomCode)

    if(updatedActiveRoom){
        updatedActiveRoom.participants.forEach((participant)=>{
            socket.to(participant.socketId).emit("game-ended")
        })
    }
}

module.exports = endGameHandler