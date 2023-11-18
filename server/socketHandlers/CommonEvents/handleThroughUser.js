const serverStore = require("../../serverStore");

const handleThroughUser = (data) => {  
    const roomCode = serverStore.getRoomCode(data.userId);
    const user_to_be_removed_id = data.to_kick_user_id;
    const user_to_be_removed_name = data.to_kick_user_name;
    if(data.room === "random"){
        serverStore.removerUserFromRandomRoom(user_to_be_removed_id,roomCode);
    }
    else{
        serverStore.leaveActiveRoom(user_to_be_removed_id,roomCode);
    }
    const data = {userId:user_to_be_removed_id,userName:user_to_be_removed_name}
    io.to(roomCode).emit("user_removed",data);
}

module.exports = handleThroughUser;