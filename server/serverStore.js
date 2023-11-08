let activeRooms = [];
let io = null;
const userSocketMap = new Map(); // Create a mapping of user IDs to socket IDs
const roomCodeMap = new Map(); // Create a mapping of user IDs to roomCode
const gameStartedMap = new Map(); // Create a mapping of room Code to game started

const mapUserToRoomCode = (userId, roomCode) => {
  console.log("setting roomCode", roomCode, userId);
  roomCodeMap.set(userId, roomCode);
};

const setGameStarted = (roomCode) => {
  gameStartedMap.set(roomCode, true);
};

const isGameStarted = (roomCode) => {
  return gameStartedMap.get(roomCode);
};

const getRoomCode = (userId) => {
  return roomCodeMap.get(userId);
};

const addUserToStore = (socketId, userId) => {
  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, socketId);
  }
  return userSocketMap.get(userId);
};

const getSocketId = (socket, userId) => {
  if (userSocketMap.has(userId)) {
    console.log("user found");
    return userSocketMap.get(userId);
  }
  return socket.id;
};

const addNewActiveRoom = ({ socketId, data, roomCode }) => {
  const userId = data.userId;
  const userName = data.userName;
  if (userSocketMap.has(userId)) {
    socketId = userSocketMap.get(userId);
  }
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
  console.log(activeRooms);
  const updatedActiveRooms = activeRooms.filter(
    (room) => room.roomCode !== roomCode
  );
  activeRooms = updatedActiveRooms;
  console.log(activeRooms);
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

const leaveActiveRoom = (roomCode, socketId, userId) => {
  const room = getActiveRoom(roomCode);
  if (room) {
    const updatedParticipants = room.participants.filter(
      (participant) => participant.socketId !== socketId
    );
    room.participants = updatedParticipants;
    if (room.participants.length === 0) {
      removeActiveRoom(roomCode);
    }
  }
  if (roomCodeMap.has(userId)) {
    roomCodeMap.delete(userId);
  }
};

module.exports = {
  addNewActiveRoom,
  joinActiveRoom,
  isValidRoom,
  getActiveRoom,
  leaveActiveRoom,
  removeActiveRoom,
  setSocketServerInstance,
  getSocketServerInstance,
  addUserToStore,
  getSocketId,
  mapUserToRoomCode,
  getRoomCode,
  setGameStarted,
  isGameStarted,
};
