const socketServer = require('../../socketServer');

const handlePlayRandom = (socket,data)=>{
    const availableRandomRoom = socketServer.checkRandomRoomAvailable(socket,data);
    var roomCode;
    if(availableRandomRoom){
        roomCode = availableRandomRoom.roomCode;
        socketServer.pushInAvailableRandomRoom(data,roomCode);
        io.to(roomCode).emit("user-joined",data)
    }
    else{
        newRandomRoom = socketServer.createNewRandomRoom(socket,data);
        roomCode = newRandomRoom.roomCode;
    }
    socket.join(roomCode);
    socketServer.mapUserToRoomCode(data.userId, roomCode);
}

module.exports = handlePlayRandom;