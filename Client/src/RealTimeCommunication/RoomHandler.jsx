const onHostingRoom = (room, setHostRoomCode, setRoomDetails) => {
  setRoomDetails(room);
  const { roomCode, roomCreator } = room;
  //   console.log("Hosting room with roomCode: " + roomCode, roomCreator);
  setHostRoomCode({ host: roomCreator.userName, roomCode: roomCode });
};

const onJoiningRoom = (
  userData,
  setIsUserJoined,
  setRoomDetails,
  roomDetails
) => {
  setRoomDetails({
    ...roomDetails,
    participants: [...roomDetails.participants, userData],
  });
  setIsUserJoined(true);
};

module.exports = { onHostingRoom, onJoiningRoom };
