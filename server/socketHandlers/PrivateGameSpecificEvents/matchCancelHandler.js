const serverStore = require("../../serverStore");

const matchCancelHandler = (socket,roomCode) => {
    const activeRoom = serverStore.getActiveRoom(roomCode)
    if(activeRoom){
        activeRoom.participants.forEach((participant)=>{
            const userId = participant.userId;
            socket.to(userId).emit("match-cancelled")
        })
    }
    serverStore.removeActiveRoom(roomCode);
}

module.exports = matchCancelHandler;