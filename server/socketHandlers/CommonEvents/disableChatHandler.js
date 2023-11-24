const serverStore = require('../../serverStore');                                                                       

const disableChat = (socket,data) => {
    const roomCode = data.roomCode;
    // const io = serverStore.getSocketServerInstance();
    const activeRoom = serverStore.getActiveRoom(roomCode)
    if(activeRoom){
        activeRoom.participants.forEach((participant)=>{
            const userId = participant.userId;
            socket.to(userId).emit("chat-disabled",data)
        })
    }
    // io.to(roomCode).emit('chat-disabled', data);
}

module.exports = disableChat;
