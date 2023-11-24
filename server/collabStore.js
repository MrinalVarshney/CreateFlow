const rooms = new Map();
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
  rooms.map(roomCode, room);
  return room;
};

const joinRoom = (data) => {
  const { userId, userName, roomCode } = data;
  var room = rooms.get(roomCode);
  const updatedCollaborators = [
    ...room.collaborators,
    { userId: userId, userName: userName, drawingSettings: drawingSettings },
  ];
  room = { ...room, collaborators: updatedCollaborators };
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
  const room = rooms.get(roomCode);
  const collaborator = room.collaborators.find(
    (collaborator) => collaborator.userId === userId
  );
  const updatedSettings = {
    ...collaborator.drawingSetting,
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
  const room = rooms.get(roomCode);
  const collaborator = room.collaborators.find(
    (collaborator) => collaborator.userId === userId
  );
  const updatedSettings = {
    ...collaborator.drawingSetting,
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

module.exports = {
  createRoom,
  leaveRoom,
  joinRoom,
  deleteRoom,
  updateDownSettings,
  updateMoveSettings,
  updateUpSettings,
};
