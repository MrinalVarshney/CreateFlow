const mongoose = require("mongoose")

const invitationSchema = mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    receiver:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    roomCode:{type:String,required:true}
})

const Invitation = mongoose.model("Invitation",invitationSchema)

module.exports = Invitation