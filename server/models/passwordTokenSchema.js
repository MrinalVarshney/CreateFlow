const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User",
        unique: "true",
    },
    token: {type:String, required:true},
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000), 
      },
    used: {type:Boolean, default:false}
},{
    timestamps:true
})




const passwordToken = mongoose.model("passwordToken",tokenSchema)

module.exports = passwordToken