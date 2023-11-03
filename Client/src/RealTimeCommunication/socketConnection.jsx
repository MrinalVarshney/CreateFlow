import io from "socket.io-client"

let socket = null;
export const connectWithSocketServer = ()=>{
    socket = io("http://localhost:5002",[])
    socket.on("connect",()=>{
        console.log("Successfully connected with socket server")
    })
    
}

export const createNewRoom = (data) =>{
    // console.log("Creating new room with name: "+data)
    socket.emit("create",data)
}