const serverStore = require('../../serverStore');

const handlePlayRandom = (socket,data)=>{
    const availableRandomRoom = serverStore.checkRandomRoomAvailable(socket,data);
    console.log("player random",data)
    var roomCode;
    const io = serverStore.getSocketServerInstance();
        if(availableRandomRoom){
        roomCode = availableRandomRoom.roomCode;
        console.log("Room available")
        const updatedAvailableRoom = serverStore.pushInAvailableRandomRoom(data,roomCode);
        console.log(updatedAvailableRoom)
        socket.emit("random-room-joined",updatedAvailableRoom)
        io.to(roomCode).emit("random-user-join",data)
        console.log("user joined random room")
    }
    else{
        newRandomRoom = serverStore.createNewRandomRoom(data);
        roomCode = newRandomRoom.roomCode;
        socket.emit("random-room-created",newRandomRoom);
    }
    socket.join(roomCode);
    serverStore.mapUserToRoomCode(data.userId, roomCode);
}

module.exports = handlePlayRandom;