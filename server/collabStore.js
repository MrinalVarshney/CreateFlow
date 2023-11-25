const rooms = new Map();
const userCodeMap = new Map();
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

const createRoom = (data) => {
  const { userId, userName, roomCode } = data;
  if(rooms.has(roomCode) === true){
    console.log("room already exists")
    const room = rooms.get(roomCode);
    return room
  }
  userCodeMap.set(userId,roomCode)
  const room = {
    creator: {
      userId: userId,
      userName: userName,
    },
    collaborators: [
      { userId: userId, userName: userName, drawingSettings: drawingSettings },
    ],
    roomCode: roomCode,
  };
  rooms.set(roomCode, room);
  return room;
};

const joinRoom = (data) => {
  const { userId, userName, roomCode } = data;
  if(rooms.has(roomCode) === false){
    return null;
  }
  userCodeMap.set(userId,roomCode)
    var room = rooms.get(roomCode);
  const updatedCollaborators = [
    ...room.collaborators,
    { userId: userId, userName: userName, drawingSettings: drawingSettings },
  ];
  room = { ...room, collaborators: updatedCollaborators };
  console.log("Updated room", room)
  rooms.set(roomCode, room);
  return room;
};

const leaveRoom = (data) => {
  const { userId, roomCode } = data;
  var room = rooms.get(roomCode);
  const filteredCollaborators = room.collaborators.filter(
    (collaborator) => collaborator.userId !== userId
  );
  room = { ...room, collaborators: filteredCollaborators };
  rooms.set(roomCode, room);
};

const deleteRoom = (data) => {
  const { roomCode } = data;
  rooms.delete(roomCode);
};

const updateDownSettings = (data) => {
  const {
    roomCode,
    userId,
    x,
    y,
    selectedTool,
    selectedColor,
    brushStyle,
    lineCap,
    lineJoin,
    shadowBlur,
    drawing,
  } = data;
  if(!rooms.has(roomCode)){return;}
  const room = rooms.get(roomCode);
  const collaborator = room.collaborators.find(
    (collaborator) => collaborator.userId === userId
  );
  const updatedSettings = {
    ...collaborator.drawingSettings,
    x: x,
    y: y,
    selectedTool: selectedTool,
    selectedColor: selectedColor,
    brushStyle: brushStyle,
    lineCap: lineCap,
    lineJoin: lineJoin,
    shadowBlur: shadowBlur,
    drawing: selectedTool !== "PaintBucket" ? true : false,
  };

  const updatedCollaborator = {
    ...collaborator,
    drawingSettings: updatedSettings,
  };
  room.collaborators.forEach((collaborator, index, array) => {
    if (collaborator.userId === updatedCollaborator.userId) {
      array[index] = updatedCollaborator;
    }
  });
  rooms.set(roomCode, room);
};

const updateMoveSettings = (data) => {
  const { roomCode, userId, x, y } = data;
  if(!rooms.has(roomCode)){return;}
  const room = rooms.get(roomCode);
  const collaborator = room.collaborators.find(
    (collaborator) => collaborator.userId === userId
  );
  if(!collaborator) return;
  const updatedSettings = {
    ...collaborator.drawingSettings,
    x: x,
    y: y,
  };

  const updatedCollaborator = {
    ...collaborator,
    drawingSettings: updatedSettings,
  };
  room.collaborators.forEach((collaborator, index, array) => {
    if (collaborator.userId === updatedCollaborator.userId) {
      array[index] = updatedCollaborator;
    }
  });
  rooms.set(roomCode, room);
};

const updateUpSettings = (data) => {
  const { roomCode, userId, drawing } = data;
  const room = rooms.get(roomCode);
  if(!rooms.has(roomCode)){return;}
  const collaborator = room.collaborators.find(
    (collaborator) => collaborator.userId === userId
  );
  const updatedSettings = {
    ...collaborator.drawingSetting,
    drawing: false,
  };

  const updatedCollaborator = {
    ...collaborator,
    drawingSettings: updatedSettings,
  };
  room.collaborators.forEach((collaborator, index, array) => {
    if (collaborator.userId === updatedCollaborator.userId) {
      array[index] = updatedCollaborator;
    }
  });
  rooms.set(roomCode, room);
};

const getCollabRoomCode = (userId)=>{
  if(userCodeMap.has(userId)){
    return userCodeMap.get(userId)
  }
  return null
}

module.exports = {
  createRoom,
  leaveRoom,
  joinRoom,
  deleteRoom,
  updateDownSettings,
  updateMoveSettings,
  updateUpSettings,
  getCollabRoomCode
};
