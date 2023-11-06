const { v4: uuidv4 } = require("uuid");

let activeRooms = [];
let io = null;
let chatMessages = {};

const addNewActiveRoom = ({ socketId, data, roomCode }) => {
  const userId = data.userId;
  const userName = data.userName;

  const newActiveRoom = {
    roomCreator: {
      userId,
      userName,
      socketId,
    },
    participants: [
      {
        userId,
        userName,
        socketId,
      },
    ], // Initialize an empty array for participants
    roomCode,
  };

  activeRooms = [...activeRooms, newActiveRoom];
  return newActiveRoom;
};

const addMessageToChat = ({ roomCode, message }) => {
  if (chatMessages[roomCode]) {
    chatMessages[roomCode].push(message);
  }
  else{
    chatMessages[roomCode] = [message]
  }
};

const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};

const getSocketServerInstance = () => {
  return io;
};

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
  console.log(data);
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
  getSocketServerInstance,
  addMessageToChat
};
