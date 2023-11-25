const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')


const protect = async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(" ")[1]
            // console.log(token)
            const decoded =  jwt.verify(token, "CreateFlow")
            req.user = await User.findById(decoded.id).select("-password")
            next()
        }
        catch(error){
            res.status(401).send("Not authorized, Token failed")
            // throw new Error("Not authorized, Token failed")
        }
    }
    else{
        res.status(401).send("Not authorized , no token")

    }
}


module.exports = protect