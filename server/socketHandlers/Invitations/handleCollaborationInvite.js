const User = require("../../models/userSchema");
const Invitation = require("../../models/invitationSchema")
const serverStore = require("../../serverStore");

const handleCollaborationInvite = async (socket ,data)=>{
    console.log("Collaboration invitation",data)
    const {senderId,recieverId,roomCode} = data; 
    const io = serverStore.getSocketServerInstance();
    const user = io.sockets.adapter.rooms.get(recieverId);
    
    console.log("User",user)
    if(user){
      socket.to(recieverId).emit("join-invitation",data)
    }
    else{
        const reciever = await User.findById(recieverId);
        const invitation  = await Invitation.create({
            sender:senderId,
            receiver:recieverId,
            roomCode:roomCode
        })
        await invitation.save();
        reciever.invitations.push(invitation._id);
        await reciever.save();
        console.log("Sent successfully")
    }
}

module.exports = handleCollaborationInvite