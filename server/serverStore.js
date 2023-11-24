let activeRooms = [];
let randomRooms = [];
let io = null;
const userSocketMap = new Map(); // Create a mapping of user IDs to socket IDs
const roomCodeMap = new Map(); // Create a mapping of user IDs to roomCode
const gameStartedMap = new Map(); // Create a mapping of room Code to game started
const userWarningMap = new Map(); // Create a mapping of user ID to warning count
const uuidv4 = require("uuid").v4;

/*********************************       Random Game Handling      *********************** */

const addWarningToUser = (userId) => {
  if (userWarningMap.has(userId)) {
    const warningCount = userWarningMap.get(userId);
    userWarningMap.set(userId, warningCount + 1);
  } else {
    userWarningMap.set(userId, 1);
  }
};

const getWarningCount = (userId) => {
  if (userWarningMap.has(userId)) {
    return userWarningMap.get(userId);
  }
  return 0;
};

const checkRandomRoomAvailable = () => {
  for (let i = 0; i < randomRooms.length; i++) {
    if (randomRooms[i].participants.length < randomRooms[i].maxParticipants) {
      return randomRooms[i];
    }
  }
  return null;
};

const createNewRandomRoom = (data) => {
  const roomCode = uuidv4();
  const newRandomRoom = {
    roomCreator: {
      userId: data.userId,
      userName: data.userName,
    },
    participants: [
      {
        userId: data.userId,
        userName: data.userName,
      },
    ],
    roomCode,
    roomType: "random",
    maxParticipants: 5,
    rounds: 5,
    duration: 80,
    isGameStarted: false,
  };
  randomRooms.push(newRandomRoom);
  roomCodeMap.set(data.userId, roomCode);
  return newRandomRoom;
};

const getRandomRoom = (roomCode) => {
  const room = randomRooms.find((room) => room.roomCode === roomCode);
  if (room) return room;
  return null;
};

const pushInAvailableRandomRoom = (data, roomCode) => {
  const room = randomRooms.find((room) => room.roomCode === roomCode);
  room.participants.push({
    userId: data.userId,
    userName: data.userName,
  });
  roomCodeMap.set(data.userId, roomCode);
  return room;
};

const removerUserFromRandomRoom = (userId, roomCode) => {
  const room = randomRooms.find((room) => room.roomCode === roomCode);
  room.participants = room.participants.filter(
    (participant) => participant.userId !== userId
  );
  if (room.participants.length === 0) {
    randomRooms = randomRooms.filter((room) => room.roomCode !== roomCode);
  }
  if (roomCodeMap.has(userId)) {
    roomCodeMap.delete(userId);
  }
  if (userWarningMap.has(userId)) {
    userWarningMap.delete(userId);
  }
  return room;
};

const removeRandomRoom = (roomCode) => {
  const room = randomRooms.find((room) => room.roomCode === roomCode);
  const UpdatedRandomRooms = randomRooms.filter(
    (room) => room.roomCode !== roomCode
  );
  randomRooms = UpdatedRandomRooms;
  room.participants.forEach((participant) => {
    if (userWarningMap.has(participant.userId)) {
      userWarningMap.delete(participant.userId);
    }
    if (roomCodeMap.has(participant.userId)) {
      roomCodeMap.delete(participant.userId);
    }
  });
  console.log("Game ended available random rooms", randomRooms);
};

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
    roomType: "private",
  };

  activeRooms = [...activeRooms, newActiveRoom];
  return newActiveRoom;
};

const startRandomGame = (roomCode) => {
  const room = randomRooms.find((room) => room.roomCode === roomCode);
  if (room) {
    console.log("starting random game");
    room.isGameStarted = true;
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
  if (room) {
    console.log("room found");
    return room;
  }

  return null;
};

const removeActiveRoom = (roomCode) => {
  console.log("room to be removed", activeRooms);
  const room = getActiveRoom(roomCode);
  if (room) {
    const updatedActiveRooms = activeRooms.filter(
      (room) => room.roomCode !== roomCode
    );

    room.participants.forEach((participant) => {
      if (userWarningMap.has(participant.userId)) {
        userWarningMap.delete(participant.userId);
      }
    });
    activeRooms = updatedActiveRooms;
  }
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

const leaveActiveRoom = (roomCode, userId) => {
  const room = getActiveRoom(roomCode);
  console.log("Room from which users leave ", room);
  if (room) {
    const updatedParticipants = room.participants.filter(
      (participant) => participant.userId !== userId
    );
    console.log("updated participants", updatedParticipants);
    room.participants = updatedParticipants;
    if (room.participants.length === 0) {
      removeActiveRoom(roomCode);
    } else if (room.roomCreator.userId === userId) {
      room.creator = room.participants[0];
    }
  }
  if (userWarningMap.has(userId)) {
    userWarningMap.delete(userId);
  }
  if (roomCodeMap.has(userId)) {
    roomCodeMap.delete(userId);
  }
  return room;
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
  checkRandomRoomAvailable,
  createNewRandomRoom,
  pushInAvailableRandomRoom,
  removerUserFromRandomRoom,
  startRandomGame,
  addWarningToUser,
  getWarningCount,
  removeRandomRoom,
  getRandomRoom,
};
