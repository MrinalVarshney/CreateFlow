const collabStore = require("../../collabStore");
const serverStore = require("../../serverStore");

const drawingSettings = {
  userId: null,
  selectedTool: null,
  selectedcolor: null,
  startX: null,
  startY: null,
  endX: null,
  endY: null,
  lineWidth: null,
  shadowBlur: null,
  brushStyle: null,
  lineJoin: null,
  lineCap: null,
  drawing: false,
};

const handleCollabRoomJoin = (socket, data) => {
  const room = collabStore.joinRoom(data);
  console.log("room join request",data)
  socket.join(data.roomCode)
  const updatedData ={...data,drawingSettings}
  if(room){
    console.log("room available",room)
    const io = serverStore.getSocketServerInstance();
    io.to(data.roomCode).emit("collab-user-joined", updatedData);
    socket.emit("collab-room-join-details", room);
  }

};

module.exports = handleCollabRoomJoin;
