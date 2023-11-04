const { v4: uuidv4 } = require("uuid");

let activeRooms = [];
let io =null

const addNewActiveRoom = ({ socketId, data }) => {
  const roomCode = uuidv4();
  const userId = data.userId;
  const userName = data.userName;

  const newActiveRoom = {
    roomCreator: {
      userId,
      userName,
      socketId,
    },
    participants: [], // Initialize an empty array for participants
    roomCode,
  };

  // Add the room creator as the first participant
  newActiveRoom.participants.push({
    userName,
    userId,
    socketId,
  });

  activeRooms = [...activeRooms, newActiveRoom];
  return newActiveRoom;
};

const setSocketServerInstance = (ioInstance)=>{
  io=ioInstance
}

const getSocketServerInstance = ()=>{
  return io;
}

const isValidRoom = (roomCode) => {
  const room = activeRooms.find((room) => room.roomCode === roomCode);
  return room ? true : false;
};

const getActiveRoom = (roomCode) => {
  const room = activeRooms.find((room) => room.roomCode === roomCode);
  if (room) return room;

  return null;
};

const removeActiveRoom = (roomCode) => {
  const updatedActiveRooms = activeRooms.filter(
    (room) => room.roomCode !== roomCode
  );
  activeRooms = updatedActiveRooms;
  return updatedActiveRooms;
};

const joinActiveRoom = ({ roomCode, socketId, data }) => {
  if (isValidRoom(roomCode)) {
    const activeRoom = getActiveRoom(roomCode);
    activeRoom.participants.push({
      userName: data.userName,
      userId: data.userId,
      socketId,
    });
  } else {
    console.log("Room does not exist");
  }
};

const leaveActiveRoom = ({ socketId, roomCode }) => {
  const room = getActiveRoom(roomCode);
  if (room) {
    const updatedParticipants = room.participants.filter(
      (participant) => participant.socketId !== socketId
    );
    room.participants = updatedParticipants;
  }
};

const getRoomCodeFromSocketId = (socketId) => {
  console.log(activeRooms, socketId);
  const room = activeRooms.find((room) => {
    console.log(room.roomCreator.socketId);
    return room.roomCreator.socketId === socketId; // Add the 'return' statement
  });

  console.log("room", room);
  if (room) return room.roomCode;
};


module.exports = {
  addNewActiveRoom,
  joinActiveRoom,
  isValidRoom,
  getActiveRoom,
  leaveActiveRoom,
  getRoomCodeFromSocketId,
  removeActiveRoom,
  setSocketServerInstance,
  getSocketServerInstance
};
