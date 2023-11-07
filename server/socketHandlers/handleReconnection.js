const serverStore = require("./../serverStore");

const handleRoomReconnection = (userId, callback) => {
    const roomCode = serverStore.getRoomCode(userId);
    console.log(userId,roomCode)
    const room = serverStore.getActiveRoom(roomCode);
    const messages = serverStore.getMessagesFromChat(roomCode);
    console.log(messages)
    callback(room, messages)
}

module.exports = handleRoomReconnection