const authSocket = require("./middlewares/authSocket")

const registerSocketServer = (server) => {
    server.listen(5002,()=>{
        console.log("Socket server is listening on port 5002")
    })

    const io = require("socket.io")(server,{
        cors:{
            origin:"*",
            methods:["GET","POST"]
        }
    })
    io.use((socket,next)=>{
        authSocket(socket,next)
    })

    io.on("connection",(socket)=>{
        console.log("New client connected with id: "+socket.id)
        socket.on("room-create",(data)=>{
            
        })
    })
}

module.exports = {registerSocketServer}