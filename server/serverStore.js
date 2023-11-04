const { v4: uuidv4 } = require("uuid");

let activeRooms = [];

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

const joinActiveRoom = ({ roomCode, socketId, data }) => {
  console.log(activeRooms, roomCode);
  if (activeRooms[roomCode]) {
    activeRooms[roomCode].participants.push({
      userName: data.userName,
      userId: data.userId,
      socketId,
    });
  } else {
    console.log("Room does not exist");
  }
};

module.exports = { addNewActiveRoom, joinActiveRoom };
